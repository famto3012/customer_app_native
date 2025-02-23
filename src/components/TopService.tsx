import { Image, Pressable, StyleSheet, View } from "react-native";
import React from "react";
import { scale, verticalScale } from "@/utils/styling";
import Typo from "./Typo";
import { colors, radius, spacingX } from "@/constants/theme";
import { router } from "expo-router";
import LottieView from "lottie-react-native";

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
          onPress={() => router.push("/screens/pickAndDrop/pick-and-drop-home")}
          style={styles.serviceCard}
        >
          <LottieView
            source={require("@/assets/images/truck-animation.json")} // Path to your Lottie JSON file
            autoPlay
            loop
            style={{ width: verticalScale(90), height: verticalScale(90) }} // Adjust size as needed
          />

          <View>
            <Typo size={14} fontFamily="SemiBold">
              Pick
            </Typo>
            <Typo size={14} fontFamily="SemiBold">
              & Drop
            </Typo>
          </View>
        </Pressable>

        <Pressable
          onPress={() => router.push("/screens/customOrder/custom-order-home")}
          style={styles.serviceCard}
        >
          {/* <Image
            source={require("@/assets/images/custom-order-animation.gif")}
            style={{ height: verticalScale(68), width: verticalScale(68) }}
          /> */}
          <LottieView
            source={require("@/assets/images/custom-order-animation.json")} // Path to your Lottie JSON file
            autoPlay
            loop
            style={{ width: verticalScale(70), height: verticalScale(70) }} // Adjust size as needed
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
    height: verticalScale(90),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacingX._10,
  },
});
