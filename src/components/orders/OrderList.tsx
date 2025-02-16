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
import { useEffect, useState, useCallback } from "react";
import { OrderItemProps } from "@/types";
import { SCREEN_HEIGHT } from "@gorhom/bottom-sheet";
import { useFocusEffect } from "@react-navigation/native";
import { useAuthStore } from "@/store/store";

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

  const renderItem = ({ item }: any) => {
    return (
      <Pressable style={styles.orderItem}>
        <View style={styles.orderItemHeader}>
          {item.deliveryMode === "Home Delivery" ||
          item.deliveryMode === "Take Away" ? (
            <Image
              source={require("@/assets/icons/shopping-cart.webp")}
              resizeMode="cover"
              style={styles.image}
            />
          ) : item.deliveryMode === "Pick and Drop" ? (
            <Image
              source={require("@/assets/icons/shipping.webp")}
              resizeMode="cover"
              style={styles.image}
            />
          ) : (
            <Image
              source={require("@/assets/icons/notes.webp")}
              resizeMode="cover"
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

        <View style={styles.orderItemFooter}>
          <Typo size={13} color={colors.PRIMARY} fontFamily="Medium">
            Grand Total
          </Typo>
          <Typo size={16} color={colors.NEUTRAL900} fontFamily="SemiBold">
            ₹ {item.grandTotal}
          </Typo>
        </View>
      </Pressable>
    );
  };

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
  },
  orderImage: {
    width: scale(340),
    height: scale(340),
  },
});
