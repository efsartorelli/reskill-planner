// src/screens/NewsScreen.tsx
import { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Alert,
  StyleSheet,
} from "react-native";
import { askGemini } from "../services/gemini";
import { COLORS } from "../theme";
import { AppButton } from "../components/AppButton";

type NewsItem = {
  id: string;
  title: string;
  summary: string;
};

type NewsResponse = {
  items: NewsItem[];
};

export function NewsScreen() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchNews() {
    try {
      setLoading(true);

      const prompt = `
Você é um assistente que gera notícias curtas sobre futuro do trabalho,
requalificação profissional e uso de IA para aprendizado.

Responda APENAS em JSON no formato:

{
  "items": [
    {
      "id": "1",
      "title": "Título curto da notícia",
      "summary": "Resumo em 2 ou 3 frases, em português do Brasil."
    }
  ]
}

Gere 5 notícias diferentes.
      `.trim();

      const raw = await askGemini(prompt);

      const cleaned = raw
        .replace("```json", "")
        .replace("```", "")
        .trim();

      const parsed: NewsResponse = JSON.parse(cleaned);

      setNews(parsed.items || []);
    } catch (err: any) {
      console.error(err);
      Alert.alert(
        "Erro",
        "Não foi possível carregar as notícias agora. Tente novamente em alguns minutos."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <View style={styles.container}>
      <AppButton
        title={loading ? "Carregando notícias..." : "Resetar notícias"}
        onPress={fetchNews}
        style={{ marginBottom: 12 }}
        disabled={loading}
      />

      {loading && news.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator color={COLORS.accent} />
        </View>
      ) : (
        <FlatList
          data={news}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchNews}
              tintColor={COLORS.accent}
            />
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.summary}>{item.summary}</Text>
            </View>
          )}
          ListEmptyComponent={
            !loading ? (
              <Text style={styles.empty}>
                Nenhuma notícia carregada ainda. Toque em "Resetar notícias".
              </Text>
            ) : null
          }
        />
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
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10,
  },
  title: {
    color: COLORS.textPrimary,
    fontWeight: "700",
    marginBottom: 4,
  },
  summary: {
    color: COLORS.textSecondary,
  },
  empty: {
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 20,
  },
});
