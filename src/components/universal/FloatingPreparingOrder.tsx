import { Image, Pressable, StyleSheet, View } from "react-native";
import { colors, radius, spacingY } from "@/constants/theme";
import { scale, SCREEN_WIDTH, verticalScale } from "@/utils/styling";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";
import Typo from "../Typo";
import { FC } from "react";
import { router } from "expo-router";

const FloatingPreparingOrder: FC<{ data: any }> = ({ data }) => {
  return (
    <Animated.View
      entering={FadeInUp.springify().damping(12).stiffness(100)}
      exiting={FadeOutDown.springify().damping(10).stiffness(80)}
      style={[styles.container, { display: data?.length ? "flex" : "none" }]}
    >
      <Image
        source={require("@/assets/images/preparing-order.webp")}
        style={{ width: scale(50), height: scale(50) }}
        resizeMode="cover"
      />

      <View style={{ width: "50%", flexDirection: "column", gap: spacingY._5 }}>
        <Typo
          size={13}
          fontFamily="SemiBold"
          textProps={{ numberOfLines: 1 }}
          color={colors.NEUTRAL800}
        >
          Preparing your order
        </Typo>
        <Typo size={12} color={colors.NEUTRAL800}>
          Exp delivery at{" "}
          <Typo size={12} color={colors.PRIMARY}>
            {data?.[0].deliveryTime}
          </Typo>
        </Typo>
      </View>

      <Pressable
        onPress={() => {
          router.push({
            pathname: "/order",
          });
        }}
        style={styles.checkoutBtn}
      >
        <Image
          source={require("@/assets/icons/maximize.webp")}
          style={{ width: scale(30), height: scale(30) }}
          resizeMode="cover"
        />
      </Pressable>
    </Animated.View>
  );
};

export default FloatingPreparingOrder;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.WHITE,
    width: SCREEN_WIDTH - 40,
    marginHorizontal: scale(20),
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(10),
    borderRadius: radius._10,
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 5,
    flexDirection: "row",
  },
  text: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: "bold",
  },
  checkoutBtn: {
    backgroundColor: colors.WHITE,
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(10),
    borderRadius: radius._10,
  },
  clearBtn: {
    padding: scale(10),
  },
});
