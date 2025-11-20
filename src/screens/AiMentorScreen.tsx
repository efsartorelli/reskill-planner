// src/screens/AiMentorScreen.tsx
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { askGemini } from "../services/gemini";
import { COLORS } from "../theme";
import { AppButton } from "../components/AppButton";

type ChatMessage = {
  id: string;
  role: "user" | "ai";
  text: string;
};

export function AiMentorScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "ai",
      text: "Oi! Sou seu mentor de carreira com IA. Me conta seu objetivo e quanto tempo você tem por semana para estudar 🤝",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || sending) return;

    const userMessage: ChatMessage = {
      id: String(Date.now()),
      role: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSending(true);

    try {
      const contextText = messages
        .concat(userMessage)
        .map((m) => `${m.role === "user" ? "Pessoa" : "Mentor"}: ${m.text}`)
        .join("\n");

      const prompt = `
Você é um mentor de carreira focado em requalificação profissional.
Responda em tom humano, amigável e prático. Use parágrafos curtos.

Conversa até agora:
${contextText}

Responda apenas a próxima mensagem da pessoa.
      `.trim();

      const replyText = await askGemini(prompt);

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "ai",
        text: replyText.trim(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      const aiMessage: ChatMessage = {
        id: `ai-error-${Date.now()}`,
        role: "ai",
        text: "Tive um problema para responder agora. Tenta de novo em alguns instantes 🙏",
      };
      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setSending(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
    >
      <View style={styles.container}>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isUser = item.role === "user";
            return (
              <View
                style={[
                  styles.bubble,
                  isUser ? styles.bubbleUser : styles.bubbleAi,
                ]}
              >
                <Text style={styles.bubbleText}>{item.text}</Text>
              </View>
            );
          }}
          contentContainerStyle={{ padding: 12, paddingBottom: 80 }}
        />

        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Digite sua mensagem..."
            placeholderTextColor={COLORS.textSecondary}
            value={input}
            onChangeText={setInput}
            multiline
          />
          <AppButton
            title={sending ? "..." : "Enviar"}
            onPress={handleSend}
            style={styles.sendButton}
            disabled={sending}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  bubble: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 16,
    marginBottom: 8,
  },
  bubbleUser: {
    alignSelf: "flex-end",
    backgroundColor: COLORS.accent,
  },
  bubbleAi: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.surfaceAlt,
  },
  bubbleText: {
    color: COLORS.textPrimary,
  },
  inputBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    flexDirection: "row",
    gap: 8,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: COLORS.textPrimary,
  },
  sendButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
});
