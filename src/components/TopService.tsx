import { Image, Pressable, StyleSheet, View } from "react-native";
import React from "react";
import { scale, verticalScale } from "@/utils/styling";
import Typo from "./Typo";
import { colors, radius, spacingX } from "@/constants/theme";
import { router } from "expo-router";

const TopService = () => {
  return (
    <View style={styles.container}>
      <Typo size={15} fontFamily="SemiBold" color={colors.NEUTRAL900}>
        Top Services
      </Typo>

      <View
        style={{
          marginTop: verticalScale(12),
          flexDirection: "row",
          gap: spacingX._10,
        }}
      >
        <Pressable
          onPress={() => router.push("/screens/pick-and-drop-home")}
          style={styles.serviceCard}
        >
          <Image
            source={require("@/assets/images/box-truck 1.webp")}
            style={{ height: verticalScale(40), width: verticalScale(40) }}
          />

          <View>
            <Typo size={14} fontFamily="SemiBold">
              Pick and
            </Typo>
            <Typo size={14} fontFamily="SemiBold">
              Drop
            </Typo>
          </View>
        </Pressable>

        <Pressable style={styles.serviceCard}>
          <Image
            source={require("@/assets/images/sticky-note 1.webp")}
            style={{ height: verticalScale(40), width: verticalScale(40) }}
          />

          <View>
            <Typo size={14} fontFamily="SemiBold">
              Custom
            </Typo>
            <Typo size={14} fontFamily="SemiBold">
              Order
            </Typo>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

export default TopService;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(20),
    marginTop: verticalScale(24),
  },
  serviceCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.NEUTRAL300,
    borderRadius: radius._10,
    height: verticalScale(80),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacingX._15,
  },
});
