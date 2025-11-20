// src/screens/SignInScreen.tsx
import { useState } from "react";
import {
  View,
  TextInput,
  Alert,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { AppButton } from "../components/AppButton";
import { COLORS } from "../theme";

export function SignInScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignIn() {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      Alert.alert("Erro ao entrar", error.message);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Image
            source={require("../../assets/icon.png")}
            style={styles.logo}
          />
          <View>
            <Text style={styles.title}>ReSkill Planner</Text>
            <Text style={styles.subtitle}>Seu plano de requalificação</Text>
          </View>
        </View>

        <Text style={[styles.subtitle, { marginTop: 12 }]}>
          Entre para continuar
        </Text>

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

        <AppButton title="Entrar" onPress={handleSignIn} style={{ marginTop: 12 }} />

        <Text
          style={styles.linkText}
          onPress={() => navigation.navigate("SignUp")}
        >
          Ainda não tem conta?{" "}
          <Text style={{ color: COLORS.accent }}>Cadastre-se</Text>
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    color: COLORS.textSecondary,
  },
  input: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: COLORS.textPrimary,
    marginTop: 12,
  },
  linkText: {
    color: COLORS.textSecondary,
    marginTop: 16,
    textAlign: "center",
  },
});
