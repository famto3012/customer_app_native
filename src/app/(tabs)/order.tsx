import { View, StyleSheet, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "@/constants/theme";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import Typo from "@/components/Typo";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { scale, verticalScale } from "@/utils/styling";
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import OrderList from "@/components/orders/OrderList";
import ScheduledOrderList from "@/components/orders/ScheduledOrderList";

const TAB_WIDTH = (SCREEN_WIDTH - scale(40)) / 2;

const order = () => {
  const [orderType, setOrderType] = useState("Order");
  const indicatorPosition = useSharedValue(0);

  useEffect(() => {
    indicatorPosition.value = withTiming(
      orderType === "Order" ? 0 : TAB_WIDTH,
      {
        duration: 300,
      }
    );
  }, [orderType]);

  const animatedIndicator = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorPosition.value }],
  }));

  return (
    <ScreenWrapper>
      <Header title="Orders" />

      <View style={styles.tabContainer}>
        <View style={styles.tab}>
          {/* Home Delivery Tab */}
          <Pressable
            onPress={() => setOrderType("Order")}
            style={styles.tabOption}
          >
            <Typo
              size={14}
              color={
                orderType === "Order" ? colors.NEUTRAL900 : colors.NEUTRAL400
              }
              fontFamily="SemiBold"
            >
              Orders
            </Typo>
          </Pressable>

          {/* Take Away Tab */}
          <Pressable
            onPress={() => setOrderType("Scheduled order")}
            style={styles.tabOption}
          >
            <Typo
              size={14}
              color={
                orderType === "Scheduled order"
                  ? colors.NEUTRAL900
                  : colors.NEUTRAL400
              }
              fontFamily="SemiBold"
            >
              Scheduled orders
            </Typo>
          </Pressable>

          {/* Sliding Bottom Border */}
          <Animated.View style={[styles.indicator, animatedIndicator]} />
        </View>
      </View>
      {orderType === "Order" ? <OrderList /> : <ScheduledOrderList />}
    </ScreenWrapper>
  );
};

export default order;

const styles = StyleSheet.create({
  tabContainer: {
    marginHorizontal: scale(20),
    marginTop: verticalScale(15),
  },
  tab: {
    flexDirection: "row",
    position: "relative",
    overflow: "hidden",
  },
  tabOption: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: verticalScale(10),
    width: TAB_WIDTH,
  },
  indicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: TAB_WIDTH,
    height: verticalScale(2),
    backgroundColor: colors.NEUTRAL900,
  },
});
