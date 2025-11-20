// src/screens/ProfileScreen.tsx
import { useContext, useEffect, useState } from "react";
import {
  View,
  TextInput,
  Alert,
  ActivityIndicator,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { AuthContext } from "../context/AuthContext";
import { db, auth } from "../services/firebase";
import { onValue, ref, update } from "firebase/database";
import { signOut } from "firebase/auth";
import { COLORS } from "../theme";
import { AppButton } from "../components/AppButton";

type UserProfile = {
  name: string;
  goal: string;
  currentSkillLevel: string;
  weeklyHours: number;
  learningStyle: string;
  interestArea: string; // IA, Gestão, etc.
};

const DEFAULT_PROFILE: UserProfile = {
  name: "",
  goal: "",
  currentSkillLevel: "iniciante",
  weeklyHours: 5,
  learningStyle: "misto",
  interestArea: "",
};

export function ProfileScreen() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [editProfile, setEditProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!user) return;

    const profileRef = ref(db, `users/${user.uid}`);

    const unsubscribe = onValue(profileRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const merged = { ...DEFAULT_PROFILE, ...data };
        setProfile(merged);
        if (!isEditing) setEditProfile(merged);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, isEditing]);

  if (!user) return null;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={COLORS.accent} />
      </View>
    );
  }

  async function handleSave() {
    if (!user) {
      Alert.alert("Erro", "Usuário não autenticado.");
      return;
    }

    try {
      await update(ref(db, `users/${user.uid}`), editProfile);
      setProfile(editProfile);
      setIsEditing(false);
      Alert.alert("Sucesso", "Perfil atualizado!");
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    }
  }

  async function handleLogout() {
    try {
      await signOut(auth);
    } catch {
      Alert.alert("Erro", "Não foi possível sair da conta.");
    }
  }

  function handleStartEdit() {
    setEditProfile(profile);
    setIsEditing(true);
  }

  function handleCancelEdit() {
    setEditProfile(profile);
    setIsEditing(false);
  }

  // ========= MODO VISUALIZAÇÃO =========
  if (!isEditing) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
        <View style={styles.card}>
          <Text style={styles.title}>Meu perfil</Text>

          <Text style={styles.label}>Nome</Text>
          <Text style={styles.value}>{profile.name || "Não informado"}</Text>

          <Text style={styles.label}>Objetivo</Text>
          <Text style={styles.value}>{profile.goal || "Não informado"}</Text>

          <Text style={styles.label}>Horas semanais</Text>
          <Text style={styles.value}>{profile.weeklyHours} h/semana</Text>

          <Text style={styles.label}>Nível atual</Text>
          <Text style={styles.value}>{profile.currentSkillLevel}</Text>

          <Text style={styles.label}>Estilo de aprendizado</Text>
          <Text style={styles.value}>{profile.learningStyle}</Text>

          <Text style={styles.label}>Área de interesse</Text>
          <Text style={styles.value}>
            {profile.interestArea
              ? mapInterestLabel(profile.interestArea)
              : "Não informado"}
          </Text>

          <AppButton
            title="Alterar informações"
            onPress={handleStartEdit}
            style={{ marginTop: 16 }}
          />

          <AppButton
            title="Sair da conta"
            onPress={handleLogout}
            variant="danger"
            style={{ marginTop: 12 }}
          />
        </View>
      </ScrollView>
    );
  }

  // ========= MODO EDIÇÃO =========
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <View style={styles.card}>
        <Text style={styles.title}>Editar perfil</Text>

        <TextInput
          placeholder="Nome"
          placeholderTextColor={COLORS.textSecondary}
          value={editProfile.name}
          onChangeText={(text) => setEditProfile({ ...editProfile, name: text })}
          style={styles.input}
        />

        <TextInput
          placeholder="Objetivo (ex: virar dev front-end)"
          placeholderTextColor={COLORS.textSecondary}
          value={editProfile.goal}
          onChangeText={(text) =>
            setEditProfile({ ...editProfile, goal: text })
          }
          style={styles.input}
        />

        <TextInput
          placeholder="Horas semanais (ex: 5)"
          placeholderTextColor={COLORS.textSecondary}
          keyboardType="numeric"
          value={String(editProfile.weeklyHours)}
          onChangeText={(text) =>
            setEditProfile({
              ...editProfile,
              weeklyHours: Number(text) || 0,
            })
          }
          style={styles.input}
        />

        <Text style={styles.sectionLabel}>Nível atual</Text>
        <View style={styles.row}>
          <AppButton
            title="Iniciante"
            onPress={() =>
              setEditProfile({
                ...editProfile,
                currentSkillLevel: "iniciante",
              })
            }
            style={styles.chip}
          />
          <AppButton
            title="Intermediário"
            onPress={() =>
              setEditProfile({
                ...editProfile,
                currentSkillLevel: "intermediário",
              })
            }
            style={styles.chip}
          />
        </View>

        <Text style={styles.sectionLabel}>Estilo de aprendizado</Text>
        <View style={styles.row}>
          <AppButton
            title="Vídeo"
            onPress={() =>
              setEditProfile({ ...editProfile, learningStyle: "vídeo" })
            }
            style={styles.chip}
          />
          <AppButton
            title="Leitura"
            onPress={() =>
              setEditProfile({ ...editProfile, learningStyle: "leitura" })
            }
            style={styles.chip}
          />
          <AppButton
            title="Misto"
            onPress={() =>
              setEditProfile({ ...editProfile, learningStyle: "misto" })
            }
            style={styles.chip}
          />
        </View>

        <Text style={styles.sectionLabel}>Área de interesse</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={editProfile.interestArea}
            onValueChange={(value) =>
              setEditProfile({ ...editProfile, interestArea: String(value) })
            }
            style={styles.picker}
            dropdownIconColor={COLORS.textPrimary}
          >
            <Picker.Item
              label="Selecione uma área"
              value=""
              color={COLORS.textSecondary}
            />
            <Picker.Item label="IA" value="ia" />
            <Picker.Item label="Desenvolvimento Front-end" value="frontend" />
            <Picker.Item label="Desenvolvimento Back-end" value="backend" />
            <Picker.Item label="Dados / Analytics" value="dados" />
            <Picker.Item label="Gestão e Liderança" value="gestao" />
            <Picker.Item label="UX / UI" value="uxui" />
          </Picker>
        </View>

        <AppButton title="Salvar" onPress={handleSave} style={{ marginTop: 16 }} />
        <AppButton
          title="Cancelar"
          onPress={handleCancelEdit}
          variant="secondary"
          style={{ marginTop: 10 }}
        />
      </View>
    </ScrollView>
  );
}

function mapInterestLabel(value: string) {
  switch (value) {
    case "ia":
      return "IA";
    case "frontend":
      return "Desenvolvimento Front-end";
    case "backend":
      return "Desenvolvimento Back-end";
    case "dados":
      return "Dados / Analytics";
    case "gestao":
      return "Gestão e Liderança";
    case "uxui":
      return "UX / UI";
    default:
      return value;
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
  },
  center: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  value: {
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  input: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  sectionLabel: {
    color: COLORS.textSecondary,
    marginTop: 8,
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    flex: 1,
    paddingVertical: 10,
  },
  pickerWrapper: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.inputBg,
    overflow: "hidden",
    marginBottom: 8,
  },
  picker: {
    color: COLORS.textPrimary,
    height: 44,
  },
});
