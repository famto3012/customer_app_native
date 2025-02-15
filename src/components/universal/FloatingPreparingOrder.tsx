import { Image, Pressable, StyleSheet, View } from "react-native";
import { colors, radius, spacingY } from "@/constants/theme";
import { scale, SCREEN_WIDTH, verticalScale } from "@/utils/styling";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";
import Typo from "../Typo";
import { XCircle } from "phosphor-react-native";
import { FC, useCallback, useEffect, useState } from "react";
import { router } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getOngoingOrder } from "@/service/orderService";
import { useFocusEffect } from "@react-navigation/native";
const FloatingPreparingOrder: FC<{}> = ({}) => {
  const [showPopUp, setShowPopUp] = useState<boolean>(false);
  const [isScreenActive, setIsScreenActive] = useState(true);
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["ongoingOrder"],
    queryFn: () => getOngoingOrder(),
    enabled: !!isScreenActive,
  });

  useEffect(() => {
    if (data?.length > 0) {
      setShowPopUp(true);
    }
  }, [data]);

  useFocusEffect(
    useCallback(() => {
      setIsScreenActive(true);
      return () => {
        setIsScreenActive(false);
        // setShowPopUp(false);
      }; // Reset on screen blur
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      queryClient.invalidateQueries(["ongoingOrder"]);
    }, [queryClient])
  );

  return showPopUp && isScreenActive ? (
    <Animated.View
      entering={FadeInUp.springify().damping(12).stiffness(100)}
      exiting={FadeOutDown.springify().damping(10).stiffness(80)}
      style={styles.container}
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
            {" "}
            {data?.[0].deliveryTime}
          </Typo>
        </Typo>
      </View>

      <Pressable
        onPress={() => {
          //   setShowPopUp(false);
          // navigation.navigate("Order");
          router.push({
            pathname: "/order",
            // params: {
            //   cartId,
            // },
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
  ) : null;
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
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.3,
    // shadowRadius: 4,
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
