// src/components/AppButton.tsx
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";
import { COLORS } from "../theme";

type Variant = "primary" | "secondary" | "danger";

type Props = {
  title: string;
  onPress: () => void;
  variant?: Variant;
  style?: ViewStyle;
  disabled?: boolean;
};

export function AppButton({
  title,
  onPress,
  variant = "primary",
  style,
  disabled,
}: Props) {
  const baseStyle = [styles.button, style];
  if (variant === "secondary") baseStyle.push(styles.secondary);
  if (variant === "danger") baseStyle.push(styles.danger);
  if (disabled) baseStyle.push(styles.disabled);

  return (
    <TouchableOpacity
      style={baseStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.accent,
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  secondary: {
    backgroundColor: COLORS.surfaceAlt,
  },
  danger: {
    backgroundColor: COLORS.danger,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    color: COLORS.textPrimary,
    fontWeight: "600",
    fontSize: 15,
  },
});
