// src/navigation/RootNavigator.tsx
import { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AuthContext } from "../context/AuthContext";
import { SignInScreen } from "../screens/SignInScreen";
import { SignUpScreen } from "../screens/SignUpScreen";
import { AppTabs } from "./AppTabs";

const Stack = createNativeStackNavigator();

export function RootNavigator() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return null; // aqui você pode colocar um splash depois
  }

  return (
    <Stack.Navigator>
      {user ? (
        <Stack.Screen
          name="AppTabs"
          component={AppTabs}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen
            name="SignIn"
            component={SignInScreen}
            options={{ title: "Entrar" }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{ title: "Criar conta" }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
