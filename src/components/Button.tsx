import { ActivityIndicator, Pressable, StyleSheet } from "react-native";

import Typo from "./Typo";

import { ButtonProps } from "@/types";
import { colors, radius, spacingX } from "@/constants/theme";
import { scale } from "@/utils/styling";

const Button = ({
  title,
  onPress,
  style,
  isLoading,
  labelColor,
  icon,
}: ButtonProps) => {
  const textColor = labelColor || colors.WHITE;

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        style,
        {
          gap: icon ? spacingX._10 : 0,
          flexDirection: "row",
          justifyContent: "center",
        },
      ]}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size={"small"} color={textColor} />
      ) : (
        <>
          {icon && icon}

          <Typo size={14} color={textColor} style={{ textAlign: "center" }}>
            {title}
          </Typo>
        </>
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
    paddingVertical: scale(15),
    borderRadius: radius._30,
  },
});
