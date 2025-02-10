import { View, StyleSheet, Pressable } from "react-native";
import { CaretLeft, Info } from "phosphor-react-native";
import { colors } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import Typo from "./Typo";
import { HeaderProps } from "@/types";
import { router } from "expo-router";

const Header = ({
  title,
  iconSize = 20,
  showLeftIcon = true,
  showRightIcon = false,
  icon,
}: HeaderProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.emptyIcon}>
        {showLeftIcon && (
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <CaretLeft
              size={verticalScale(iconSize)}
              color={colors.PRIMARY}
              weight="bold"
            />
          </Pressable>
        )}
      </View>

      <Typo
        size={16}
        fontWeight={"bold"}
        color={colors.PRIMARY}
        fontFamily="Regular"
      >
        {title}
      </Typo>

      <View style={styles.emptyIcon}>
        {showRightIcon && (
          <Pressable style={styles.rightIcon}>
            <Info size={24} />
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(15),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: { padding: scale(2) },
  emptyIcon: { flex: 1 },
  rightIcon: {
    width: "100%",
    justifyContent: "flex-end",
  },
});
