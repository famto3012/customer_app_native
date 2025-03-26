import { Image, Pressable, StyleSheet, View } from "react-native";
import { colors, radius, spacingY } from "@/constants/theme";
import { scale, SCREEN_WIDTH, verticalScale } from "@/utils/styling";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";
import Typo from "../Typo";
import { FC, useEffect, useState, useRef, useCallback } from "react";
import { router } from "expo-router";
import {
  getAllOrder,
  removeOrderById,
} from "@/localDB/controller/orderController";

const FloatingPreparingOrder: FC<{
  data: any;
  refetchOngoingOrder: () => void;
  openTempOrderSheet: () => void;
  countUpdate: number;
}> = ({ data, refetchOngoingOrder, openTempOrderSheet, countUpdate }) => {
  const [showCountDown, setShowCountDown] = useState(false);
  const [tempOrders, setTempOrders] = useState<
    { orderId: string; createdAt: string }[]
  >([]);
  const [timeLeftMap, setTimeLeftMap] = useState<{ [key: string]: number }>({});
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const orderImage = showCountDown
    ? require("@/assets/images/confirming-order.webp")
    : require("@/assets/images/preparing-order.gif");

  // Precise time calculation method
  const calculateRemainingTime = useCallback((createdAt: string) => {
    const orderCreatedTime = new Date(createdAt).getTime();
    const currentTime = Date.now();
    const elapsedTime = (currentTime - orderCreatedTime) / 1000; // Convert to seconds

    // Ensure we always start with 60 seconds and subtract elapsed time
    const remainingTime = Math.max(60 - Math.floor(elapsedTime), 0);

    return remainingTime;
  }, []);

  // Fetch and initialize orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orders = await getAllOrder();

        if (orders.length > 0) {
          setTempOrders(orders);

          // Initialize timeLeftMap with calculated remaining time
          const initialTimeLeftMap: { [key: string]: number } = {};
          orders.forEach((order) => {
            const remainingTime = calculateRemainingTime(order.createdAt);
            initialTimeLeftMap[order.orderId] = remainingTime;
          });

          setTimeLeftMap(initialTimeLeftMap);
          setShowCountDown(true);
        } else {
          setShowCountDown(false);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [calculateRemainingTime]);

  useEffect(() => {
    const fetchOrders = async () => {
      const orders = await getAllOrder();

      // Update tempOrders state with fresh data
      setTempOrders(orders);

      if (orders.length > 0) {
        // Reinitialize timer for all orders
        const initialTimeLeftMap: any = {};
        orders.forEach((order) => {
          // For existing orders, preserve current time if available
          initialTimeLeftMap[order.orderId] = timeLeftMap[order.orderId] || 60;
        });

        setTimeLeftMap(initialTimeLeftMap);
        setShowCountDown(true);
      } else {
        setShowCountDown(false);
      }
    };

    // Fetch orders whenever countUpdate changes
    fetchOrders();
  }, [countUpdate]);

  // Countdown interval effect
  useEffect(() => {
    if (tempOrders.length <= 0) {
      setShowCountDown(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    setShowCountDown(true);

    intervalRef.current = setInterval(() => {
      setTimeLeftMap((prev) => {
        const updatedTimeLeftMap = { ...prev };
        const ordersToRemove: string[] = [];

        tempOrders.forEach((order) => {
          const currentTimeLeft = prev[order.orderId] || 0;
          const newTimeLeft = Math.max(currentTimeLeft - 1, 0);

          if (newTimeLeft === 0) {
            // Mark for removal
            ordersToRemove.push(order.orderId);
          } else {
            updatedTimeLeftMap[order.orderId] = newTimeLeft;
          }
        });

        // Remove completed orders
        if (ordersToRemove.length > 0) {
          // Remove from DB
          ordersToRemove.forEach((orderId) => {
            removeOrderById(orderId);
          });

          // Update state
          setTempOrders((prev) =>
            prev.filter((o) => !ordersToRemove.includes(o.orderId))
          );
          refetchOngoingOrder();
        }

        return updatedTimeLeftMap;
      });
    }, 1000);

    // Cleanup interval on unmount or when tempOrders changes
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [tempOrders, refetchOngoingOrder]);

  const lastOrder = tempOrders.length
    ? tempOrders[tempOrders.length - 1]
    : null;
  const timeLeft = lastOrder ? timeLeftMap[lastOrder.orderId] || 0 : 0;

  return (
    <Animated.View
      entering={FadeInUp.springify().damping(12).stiffness(100)}
      exiting={FadeOutDown.springify().damping(10).stiffness(80)}
      style={[
        styles.container,
        {
          display:
            (data && data.length) || (tempOrders && tempOrders.length)
              ? "flex"
              : "none",
        },
      ]}
    >
      {/* Rest of the component remains the same */}
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
          {showCountDown ? "Confirming" : "Preparing"} your order
        </Typo>
        <Typo size={12} color={colors.NEUTRAL800}>
          {showCountDown ? "Your order will be placed in" : "Exp delivery at"}{" "}
          <Typo size={12} color={colors.PRIMARY}>
            {showCountDown ? `${timeLeft}s` : data?.[0]?.deliveryTime}
          </Typo>
        </Typo>
      </View>

      <Pressable
        onPress={() => {
          showCountDown
            ? openTempOrderSheet()
            : router.push({
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

// Styles remain the same as in previous example
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
    marginBottom: verticalScale(75),
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
