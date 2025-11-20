// src/navigation/AppTabs.tsx
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import { ProfileScreen } from "../screens/ProfileScreen";
import { NewsScreen } from "../screens/NewsScreen";
import { AiMentorScreen } from "../screens/AiMentorScreen";
import { WeeklyPlanScreen } from "../screens/WeeklyPlanScreen";
import { COLORS } from "../theme";

type AppTabParamList = {
  News: undefined;
  AiMentor: undefined;
  WeeklyPlan: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<AppTabParamList>();

export function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: COLORS.surface },
        headerTintColor: COLORS.textPrimary,
        headerTitleAlign: "center",
        tabBarStyle: {
          backgroundColor: COLORS.tabBar,
          borderTopColor: COLORS.border,
        },
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "ellipse-outline";

          if (route.name === "News") {
            iconName = focused ? "newspaper" : "newspaper-outline";
          } else if (route.name === "AiMentor") {
            iconName = focused ? "chatbubbles" : "chatbubbles-outline";
          } else if (route.name === "WeeklyPlan") {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person-circle" : "person-circle-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="News"
        component={NewsScreen}
        options={{ title: "Novidades" }}
      />
      <Tab.Screen
        name="AiMentor"
        component={AiMentorScreen}
        options={{ title: "Mentor IA" }}
      />
      <Tab.Screen
        name="WeeklyPlan"
        component={WeeklyPlanScreen}
        options={{ title: "Plano semanal" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Perfil" }}
      />
    </Tab.Navigator>
  );
}
