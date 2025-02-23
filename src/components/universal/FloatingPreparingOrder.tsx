import { Image, Pressable, StyleSheet, View } from "react-native";
import { colors, radius, spacingY } from "@/constants/theme";
import { scale, SCREEN_WIDTH, verticalScale } from "@/utils/styling";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";
import Typo from "../Typo";
import { FC, useEffect, useState } from "react";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getTemporaryOrder } from "@/service/userService";
import { useAuthStore } from "@/store/store";

const FloatingPreparingOrder: FC<{ data: any }> = ({ data }) => {
  const { token } = useAuthStore.getState();
  const [timeLeft, setTimeLeft] = useState(60); // Timer (in seconds)
  const [showInitialUI, setShowInitialUI] = useState(false); // Controls which UI to show

  const { data: temporaryOrderData } = useQuery({
    queryKey: ["temporary-order"],
    queryFn: () => getTemporaryOrder(),
    enabled: !!token,
  });

  const orderImage = showInitialUI
    ? require("@/assets/images/confirming-order.webp")
    : require("@/assets/images/preparing-order.gif");

  useEffect(() => {
    console.log("Temporary order", temporaryOrderData);

    if (temporaryOrderData) {
      const createdAt = new Date(temporaryOrderData.createdAt).getTime();
      const now = Date.now();
      const diff = Math.floor((now - createdAt) / 1000); // Difference in seconds

      if (diff < 60) {
        setTimeLeft(60 - diff); // Set countdown timer
        setShowInitialUI(true); // Show different UI

        // Start countdown timer
        const interval = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              setShowInitialUI(false); // Hide UI after timer ends
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        return () => clearInterval(interval); // Cleanup on unmount
      } else {
        setShowInitialUI(false);
      }
    } else {
      setShowInitialUI(false); // Ensure UI is hidden if no temporary order exists
    }
  }, [temporaryOrderData]); // Runs when `temporaryOrderData` changes

  useEffect(() => {
    console.log("showInitialUI", showInitialUI);
  }, [showInitialUI]);

  return (
    <Animated.View
      entering={FadeInUp.springify().damping(12).stiffness(100)}
      exiting={FadeOutDown.springify().damping(10).stiffness(80)}
      style={[styles.container, { display: data?.length ? "flex" : "none" }]}
    >
      <Image
        source={orderImage}
        style={{ width: scale(50), height: scale(50) }}
        resizeMode="cover"
      />

      <View style={{ width: "60%", flexDirection: "column", gap: spacingY._5 }}>
        <Typo
          size={13}
          fontFamily="SemiBold"
          textProps={{ numberOfLines: 1 }}
          color={colors.NEUTRAL800}
        >
          {showInitialUI ? "Confirming" : "Preparing"} your order
        </Typo>
        <Typo size={12} color={colors.NEUTRAL800}>
          {showInitialUI ? "Your order will be placed in" : "Exp delivery at"}{" "}
          <Typo size={12} color={colors.PRIMARY}>
            {showInitialUI ? `${timeLeft}s` : data?.[0]?.deliveryTime}
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
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(10),
    borderRadius: radius._10,
  },
  clearBtn: {
    padding: scale(10),
  },
});
