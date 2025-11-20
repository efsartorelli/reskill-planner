// src/screens/SignUpScreen.tsx
import { useState } from "react";
import {
  View,
  TextInput,
  Alert,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../services/firebase";
import { ref, set } from "firebase/database";
import { AppButton } from "../components/AppButton";
import { COLORS } from "../theme";

export function SignUpScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignUp() {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      await set(ref(db, `users/${cred.user.uid}`), {
        name: "",
        goal: "",
        currentSkillLevel: "iniciante",
        weeklyHours: 5,
        learningStyle: "misto",
        interestArea: "",
      });

      Alert.alert("Sucesso", "Conta criada com sucesso!");
      navigation.navigate("SignIn");
    } catch (error: any) {
      Alert.alert("Erro ao cadastrar", error.message);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Criar conta</Text>
        <Text style={styles.subtitle}>Comece sua jornada de requalificação</Text>

        <TextInput
          placeholder="E-mail"
          placeholderTextColor={COLORS.textSecondary}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />
        <TextInput
          placeholder="Senha"
          placeholderTextColor={COLORS.textSecondary}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />

        <AppButton
          title="Criar conta"
          onPress={handleSignUp}
          style={{ marginTop: 12 }}
        />

        <Text
          style={styles.linkText}
          onPress={() => navigation.navigate("SignIn")}
        >
          Já tem conta?{" "}
          <Text style={{ color: COLORS.accent }}>Entrar</Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    color: COLORS.textSecondary,
    marginBottom: 16,
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
  linkText: {
    color: COLORS.textSecondary,
    marginTop: 16,
    textAlign: "center",
  },
});
