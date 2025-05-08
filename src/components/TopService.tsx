import { Pressable, StyleSheet, View } from "react-native";
import React from "react";
import { scale, verticalScale } from "@/utils/styling";
import Typo from "./Typo";
import { colors, radius, spacingX } from "@/constants/theme";
import { Href, router } from "expo-router";
import LottieView from "lottie-react-native";
import { useQuery } from "@tanstack/react-query";
import { getServiceTimings } from "@/service/userService";
import { useShowAlert } from "@/hooks/useShowAlert";

const TopService = () => {
  const { showAlert } = useShowAlert();

  const { data, isError } = useQuery({
    queryKey: ["service-timings"],
    queryFn: getServiceTimings,
  });

  const replaceScreen = (
    type: "Pick and Drop" | "Custom Order",
    route: Href
  ) => {
    if (isError) {
      showAlert("Something went wrong!");
      return;
    }

    const { customOrderTimings, pickAndDropOrderTimings } = data;

    const now = new Date();

    const year = now.getFullYear();

    // Helper function to create local date
    const createLocalDate = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(":").map(Number);
      return new Date(year, now.getMonth(), now.getDate(), hours, minutes, 0); // Local date
    };

    if (type === "Pick and Drop") {
      const startTime = createLocalDate(pickAndDropOrderTimings.startTime);
      const endTime = createLocalDate(pickAndDropOrderTimings.endTime);

      if (now > endTime || now < startTime) {
        showAlert("Currently Pick and drop service is unavailable!");
        return;
      }

      router.push(route);
    }

    if (type === "Custom Order") {
      const startTime = createLocalDate(customOrderTimings.startTime);
      const endTime = createLocalDate(customOrderTimings.endTime);

      if (now > endTime || now < startTime) {
        showAlert("Currently Custom Order service is unavailable!");
        return;
      }

      router.push(route);
    }
  };

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
          onPress={() =>
            replaceScreen(
              "Pick and Drop",
              "/screens/pickAndDrop/pick-and-drop-home"
            )
          }
          style={styles.serviceCard}
        >
          <LottieView
            source={require("@/assets/images/truck-animation.json")}
            autoPlay
            loop
            style={{ width: verticalScale(90), height: verticalScale(90) }}
            renderMode="HARDWARE"
            cacheComposition={true}
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
          onPress={() =>
            replaceScreen(
              "Custom Order",
              "/screens/customOrder/custom-order-home"
            )
          }
          style={styles.serviceCard}
        >
          <LottieView
            source={require("@/assets/images/custom-order-animation.json")}
            autoPlay
            loop
            style={{ width: verticalScale(70), height: verticalScale(70) }}
            renderMode="HARDWARE"
            cacheComposition={true}
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
