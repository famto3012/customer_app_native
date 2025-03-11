import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  View,
  RefreshControl,
} from "react-native";
import { scale, verticalScale } from "@/utils/styling";
import Typo from "../Typo";
import { colors, radius } from "@/constants/theme";
import { useQuery } from "@tanstack/react-query";
import { getOrderList } from "@/service/orderService";
import { useEffect, useState, useCallback, FC } from "react";
import { OrderItemProps } from "@/types";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import { useFocusEffect } from "@react-navigation/native";
import { useAuthStore } from "@/store/store";
import LottieView from "lottie-react-native";
import { router } from "expo-router";

const OrderList = () => {
  const [orderList, setOrderList] = useState<OrderItemProps[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isScreenActive, setIsScreenActive] = useState(true);

  const { token } = useAuthStore.getState();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["orderList"],
    queryFn: () => getOrderList(),
    enabled: !!token,
  });

  useEffect(() => {
    if (data) setOrderList(data);
  }, [data]);

  useFocusEffect(
    useCallback(() => {
      setIsScreenActive(true);
      return () => setIsScreenActive(false);
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (token) await refetch();
    setRefreshing(false);
  }, [refetch]);

  // const renderItem = ({ item }: any) => {
  //   console.log("item", item);
  //   return (
  //     <Pressable
  //       style={styles.orderItem}
  //       onPress={() => {
  //         router.push({
  //           pathname: "/screens/user/OrderDetail",
  //           params: { orderId: item.orderId },
  //         });
  //       }}
  //     >
  //       <View style={styles.orderItemHeader}>
  //         {item.deliveryMode === "Home Delivery" ||
  //         item.deliveryMode === "Take Away" ? (
  //           <LottieView
  //             source={require("@/assets/images/universal-order.json")} // Path to your Lottie JSON file
  //             autoPlay
  //             loop
  //             style={styles.image} // Adjust size as needed
  //           />
  //         ) : item.deliveryMode === "Pick and Drop" ? (
  //           <LottieView
  //             source={require("@/assets/images/pick-drop-order.json")} // Path to your Lottie JSON file
  //             autoPlay
  //             loop
  //             style={styles.image} // Adjust size as needed
  //           />
  //         ) : (
  //           <LottieView
  //             source={require("@/assets/images/custom-order.json")} // Path to your Lottie JSON file
  //             autoPlay
  //             loop
  //             style={styles.image} // Adjust size as needed
  //           />
  //         )}

  //         <View style={styles.orderDetail}>
  //           <View>
  //             <Typo size={16} color={colors.NEUTRAL900} fontFamily="Medium">
  //               {item.deliveryMode === "Home Delivery" ||
  //               item.deliveryMode === "Take Away"
  //                 ? item.merchantName
  //                 : item.deliveryMode}
  //             </Typo>
  //             <Typo size={12} color={colors.NEUTRAL400}>
  //               {item.deliveryMode === "Home Delivery" ||
  //               item.deliveryMode === "Take Away"
  //                 ? item.displayAddress
  //                 : ""}
  //             </Typo>
  //             <Typo
  //               size={12}
  //               color={colors.PRIMARY}
  //               style={{ paddingTop: verticalScale(10) }}
  //             >
  //               {item.orderDate} | {item.orderTime}
  //             </Typo>
  //           </View>

  //           <Typo
  //             size={12}
  //             color={
  //               item.orderStatus === "On-going" ||
  //               item.orderStatus === "Pending"
  //                 ? colors.YELLOW
  //                 : item.orderStatus === "Completed"
  //                 ? colors.GREEN
  //                 : colors.RED
  //             }
  //             style={styles.completed}
  //           >
  //             {item.orderStatus}
  //           </Typo>
  //         </View>
  //       </View>

  //       <View style={styles.orderItemFooter}>
  //         <Typo size={13} color={colors.PRIMARY} fontFamily="Medium">
  //           Grand Total
  //         </Typo>
  //         <Typo
  //           size={item?.grandTotal ? 16 : 12}
  //           color={colors.NEUTRAL900}
  //           fontFamily="SemiBold"
  //         >
  //           {item?.grandTotal
  //             ? ` ₹ ${item?.grandTotal}`
  //             : "Will be updated soon"}
  //         </Typo>
  //       </View>
  //     </Pressable>
  //   );
  // };

  const OrderItem: FC<{ item: any }> = ({ item }) => {
    const [remainingTime, setRemainingTime] = useState("");

    useEffect(() => {
      if (item.orderStatus === "On-going") {
        const interval = setInterval(() => {
          const now = new Date().getTime();

          const [orderHours, orderMinutes] = item.orderTime
            .split(":")
            .map(Number);
          const orderDate = new Date();
          orderDate.setHours(orderHours, orderMinutes, 0, 0);

          const deliveryTime: any = new Date(
            orderDate.getTime() + 30 * 60 * 1000
          );

          const diffInMinutes = Math.max(
            0,
            Math.floor((deliveryTime - now) / 60000)
          );

          if (diffInMinutes > 0) {
            setRemainingTime(`${diffInMinutes} min`);
          } else {
            setRemainingTime("Arriving soon");
            clearInterval(interval);
          }
        }, 1000);

        return () => clearInterval(interval);
      }
    }, [item.orderStatus, item.orderTime]);

    return (
      <Pressable
        style={styles.orderItem}
        onPress={() => {
          router.push({
            pathname: "/screens/user/OrderDetail",
            params: { orderId: item.orderId },
          });
        }}
      >
        <View style={styles.orderItemHeader}>
          {item.deliveryMode === "Home Delivery" ||
          item.deliveryMode === "Take Away" ? (
            <LottieView
              source={require("@/assets/images/universal-order.json")}
              autoPlay
              loop
              style={styles.image}
            />
          ) : item.deliveryMode === "Pick and Drop" ? (
            <LottieView
              source={require("@/assets/images/pick-drop-order.json")}
              autoPlay
              loop
              style={styles.image}
            />
          ) : (
            <LottieView
              source={require("@/assets/images/custom-order.json")}
              autoPlay
              loop
              style={styles.image}
            />
          )}

          <View style={styles.orderDetail}>
            <View>
              <Typo size={16} color={colors.NEUTRAL900} fontFamily="Medium">
                {item.deliveryMode === "Home Delivery" ||
                item.deliveryMode === "Take Away"
                  ? item.merchantName
                  : item.deliveryMode}
              </Typo>
              <Typo size={12} color={colors.NEUTRAL400}>
                {item.deliveryMode === "Home Delivery" ||
                item.deliveryMode === "Take Away"
                  ? item.displayAddress
                  : ""}
              </Typo>
              <Typo
                size={12}
                color={colors.PRIMARY}
                style={{ paddingTop: verticalScale(10) }}
              >
                {item.orderDate} | {item.orderTime}
              </Typo>
            </View>

            <View style={{ flexDirection: "column", alignItems: "center" }}>
              {item.orderStatus === "On-going" && (
                <Typo
                  size={12}
                  color={
                    remainingTime === "Arriving soon"
                      ? colors.RED
                      : colors.GREEN
                  }
                  style={{
                    width: SCREEN_WIDTH * 0.25,
                    backgroundColor: colors.NEUTRAL100,
                    paddingVertical: verticalScale(4),
                    borderRadius: radius._20,
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  {remainingTime}
                </Typo>
              )}
              <Typo
                size={12}
                color={
                  item.orderStatus === "On-going" ||
                  item.orderStatus === "Pending"
                    ? colors.YELLOW
                    : item.orderStatus === "Completed"
                    ? colors.GREEN
                    : colors.RED
                }
                style={styles.completed}
              >
                {item.orderStatus}
              </Typo>
            </View>
          </View>
        </View>

        <View style={styles.orderItemFooter}>
          <Typo size={13} color={colors.PRIMARY} fontFamily="Medium">
            Grand Total
          </Typo>
          <Typo
            size={item?.grandTotal ? 16 : 12}
            color={colors.NEUTRAL900}
            fontFamily="SemiBold"
          >
            {item?.grandTotal
              ? ` ₹ ${item?.grandTotal}`
              : "Will be updated soon"}
          </Typo>
        </View>
      </Pressable>
    );
  };

  const renderItem = ({ item }: any) => <OrderItem item={item} />;

  return (
    <FlatList
      data={isScreenActive ? orderList : []}
      renderItem={renderItem}
      keyExtractor={(item) => item.orderId}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListEmptyComponent={
        !isLoading && !orderList?.length ? (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              height: SCREEN_HEIGHT - verticalScale(300),
            }}
          >
            <Image
              source={require("@/assets/images/order.webp")}
              resizeMode="contain"
              style={styles.orderImage}
            />
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              height: SCREEN_HEIGHT - verticalScale(250),
            }}
          >
            <Typo>Loading...</Typo>
          </View>
        )
      }
    />
  );
};

export default OrderList;

const styles = StyleSheet.create({
  orderItem: {
    backgroundColor: colors.WHITE,
    marginHorizontal: scale(20),
    marginVertical: verticalScale(12),
    borderRadius: radius._10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 2,
  },
  orderItemHeader: {
    paddingHorizontal: scale(10),
    marginTop: verticalScale(10),
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  orderItemFooter: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(12),
    backgroundColor: colors.NEUTRAL100,
    borderBottomLeftRadius: radius._10,
    borderBottomRightRadius: radius._10,
  },
  image: {
    width: scale(40),
    height: scale(40),
    marginRight: scale(15),
  },
  orderDetail: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  completed: {
    backgroundColor: colors.NEUTRAL100,
    paddingVertical: verticalScale(4),
    paddingHorizontal: scale(8),
    borderRadius: radius._20,
    marginTop: scale(8),
  },
  orderImage: {
    width: scale(340),
    height: scale(340),
  },
});
