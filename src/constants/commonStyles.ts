import { StyleSheet } from "react-native";

export const commonStyles = StyleSheet.create({
  // For background overlay of Bottom Sheet
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 1)",
  },
});
