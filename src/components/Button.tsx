import { ActivityIndicator, Pressable, StyleSheet } from "react-native";

import Typo from "./Typo";

import { ButtonProps } from "@/types";
import { colors, radius } from "@/constants/theme";

const Button = ({
  title,
  onPress,
  style,
  isLoading,
  labelColor,
}: ButtonProps) => {
  const textColor = labelColor || colors.WHITE;

  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, style]}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size={"small"} color={textColor} />
      ) : (
        <Typo size={14} color={textColor} style={{ textAlign: "center" }}>
          {title}
        </Typo>
      )}
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignSelf: "center",
    backgroundColor: colors.PRIMARY,
    padding: 15,
    borderRadius: radius._30,
  },
});
