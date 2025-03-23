import { StyleSheet } from "react-native";
import { spacingX } from "./theme";
import { scale } from "@/utils/styling";

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
  flexRowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  flexRowGap: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  emptyFavoriteListImage: {
    width: scale(340),
    height: scale(340),
    resizeMode: "cover",
  },
});
