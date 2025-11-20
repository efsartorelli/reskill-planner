// src/screens/WeeklyPlanScreen.tsx
import { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { db } from "../services/firebase";
import { onValue, ref, set, update } from "firebase/database";
import { askGemini } from "../services/gemini";
import { COLORS } from "../theme";
import { AppButton } from "../components/AppButton";

type Task = {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  done: boolean;
};

type WeeklyPlan = {
  weekId: string;
  summary: string;
  tasks: Task[];
};

type UserProfile = {
  name: string;
  goal: string;
  currentSkillLevel: string;
  weeklyHours: number;
  learningStyle: string;
  interestArea?: string;
};

function getCurrentWeekId() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const week = Math.ceil(now.getDate() / 7);
  return `${year}-${month}-w${week}`;
}

export function WeeklyPlanScreen() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [plan, setPlan] = useState<WeeklyPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const weekId = getCurrentWeekId();

  useEffect(() => {
    if (!user) return;

    const profileRef = ref(db, `users/${user.uid}`);
    const planRef = ref(db, `plans/${user.uid}/${weekId}`);

    const unsubProfile = onValue(profileRef, (snap) => {
      const data = snap.val();
      if (data) setProfile(data);
    });

    const unsubPlan = onValue(planRef, (snap) => {
      const data = snap.val();
      if (data) setPlan(data);
      setLoading(false);
    });

    return () => {
      unsubProfile();
      unsubPlan();
    };
  }, [user, weekId]);

  if (!user) return null;

  async function handleGeneratePlan() {
    if (!user) {
      Alert.alert("Erro", "Usuário não autenticado.");
      return;
    }
    if (!profile) {
      Alert.alert("Atenção", "Preencha seu perfil antes de gerar o plano.");
      return;
    }

    try {
      setGenerating(true);

      const prompt = `
Você é um planejador de estudos de carreira.
Gere um plano de aprendizado para UMA semana, em formato JSON.

Perfil da pessoa:
- Nome: ${profile.name || "não informado"}
- Objetivo: ${profile.goal}
- Nível atual: ${profile.currentSkillLevel}
- Horas disponíveis por semana: ${profile.weeklyHours}
- Estilo de aprendizado: ${profile.learningStyle}
- Área de interesse: ${profile.interestArea || "não informada"}

Responda APENAS com JSON no formato:

{
  "summary": "texto curto explicando o foco da semana",
  "tasks": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "estimatedMinutes": 45
    }
  ]
}
      `.trim();

      const raw = await askGemini(prompt);

      const cleaned = raw
        .replace("```json", "")
        .replace("```", "")
        .trim();

      const parsed = JSON.parse(cleaned);

      const newPlan: WeeklyPlan = {
        weekId,
        summary: parsed.summary,
        tasks: parsed.tasks.map((t: any, index: number) => ({
          id: t.id || String(index + 1),
          title: t.title,
          description: t.description,
          estimatedMinutes: t.estimatedMinutes ?? 45,
          done: false,
        })),
      };

      await set(ref(db, `plans/${user.uid}/${weekId}`), newPlan);
      setPlan(newPlan);
      Alert.alert("Plano criado!", "Seu plano semanal foi gerado com IA.");
    } catch (err: any) {
      console.error(err);
      Alert.alert(
        "Erro",
        "Não foi possível gerar o plano. Tente novamente em alguns minutos."
      );
    } finally {
      setGenerating(false);
    }
  }

  async function toggleTask(taskId: string) {
    if (!user || !plan) return;

    const updatedTasks = plan.tasks.map((t) =>
      t.id === taskId ? { ...t, done: !t.done } : t
    );

    const updatedPlan = { ...plan, tasks: updatedTasks };
    setPlan(updatedPlan);

    await update(ref(db, `plans/${user.uid}/${weekId}`), {
      tasks: updatedTasks,
    });
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={COLORS.accent} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Plano da semana ({weekId})</Text>

      {plan ? (
        <>
          <Text style={styles.summary}>{plan.summary}</Text>

          <FlatList
            data={plan.tasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => toggleTask(item.id)}
                style={[
                  styles.taskCard,
                  item.done && styles.taskCardDone,
                ]}
              >
                <Text style={styles.taskTitle}>{item.title}</Text>
                <Text style={styles.taskDesc}>{item.description}</Text>
                <Text style={styles.taskMeta}>
                  Estimado: {item.estimatedMinutes} min — toque para marcar como{" "}
                  {item.done ? "não concluída" : "concluída"}
                </Text>
              </TouchableOpacity>
            )}
          />

          <AppButton
            title={generating ? "Gerando..." : "Regerar plano da semana"}
            onPress={handleGeneratePlan}
            style={{ marginTop: 12 }}
            disabled={generating}
          />
        </>
      ) : (
        <>
          <Text style={styles.summary}>
            Você ainda não tem um plano para esta semana. Gere um plano com base
            no seu perfil.
          </Text>
          <AppButton
            title={generating ? "Gerando..." : "Gerar plano desta semana"}
            onPress={handleGeneratePlan}
            disabled={generating}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  center: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  summary: {
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  taskCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10,
  },
  taskCardDone: {
    backgroundColor: "#052e16",
    borderColor: COLORS.accentDark,
  },
  taskTitle: {
    color: COLORS.textPrimary,
    fontWeight: "700",
    marginBottom: 4,
  },
  taskDesc: {
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  taskMeta: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
});
