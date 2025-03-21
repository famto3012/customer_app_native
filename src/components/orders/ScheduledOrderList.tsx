import { FlatList, Image, Pressable, StyleSheet, View } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { scale, verticalScale } from "@/utils/styling";
import Typo from "../Typo";
import { colors, radius } from "@/constants/theme";
import { ScheduledOrderItemProps } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { getScheduledOrderList } from "@/service/orderService";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import { RefreshControl } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useAuthStore } from "@/store/store";
import LottieView from "lottie-react-native";
import { router } from "expo-router";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const ScheduledOrderList = () => {
  const [scheduledOrderList, setScheduledOrderList] = useState<
    ScheduledOrderItemProps[]
  >([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isScreenActive, setIsScreenActive] = useState(true);

  const { token } = useAuthStore.getState();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["scheduledOrderList"],
    queryFn: () => getScheduledOrderList(),
    enabled: !!token,
  });

  useEffect(() => {
    data && setScheduledOrderList(data);
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
      <Pressable
        style={styles.orderItem}
        onPress={() => {
          router.push({
            pathname: "/screens/user/ScheduledOrderDetail",
            params: {
              orderId: item?.orderId,
              deliveryMode: item?.deliveryMode,
            },
          });
        }}
      >
        <View style={styles.orderItemHeader}>
          {item.deliveryMode === "Home Delivery" ||
          item.deliveryMode === "Take Away" ? (
            <LottieView
              source={require("@/assets/images/universal-order.json")} // Path to your Lottie JSON file
              autoPlay
              loop
              style={styles.image} // Adjust size as needed
              renderMode="HARDWARE"
              cacheComposition={true}
            />
          ) : item.deliveryMode === "Pick and Drop" ? (
            <LottieView
              source={require("@/assets/images/pick-drop-order.json")} // Path to your Lottie JSON file
              autoPlay
              loop
              style={styles.image} // Adjust size as needed
              renderMode="HARDWARE"
              cacheComposition={true}
            />
          ) : (
            <LottieView
              source={require("@/assets/images/custom-order.json")} // Path to your Lottie JSON file
              autoPlay
              loop
              style={styles.image} // Adjust size as needed
              renderMode="HARDWARE"
              cacheComposition={true}
            />
          )}
          <View style={{ flex: 1 }}>
            <Typo size={14} color={colors.NEUTRAL900} fontFamily="Medium">
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
          </View>
          <Typo
            size={12}
            color={
              item.orderStatus === "Pending" ? colors.YELLOW : colors.GREEN
            }
            style={styles.completed}
          >
            {item.orderStatus}
          </Typo>
        </View>

        <View style={styles.orderItemBody}>
          <Typo size={12} color={colors.NEUTRAL900} fontFamily="Medium">
            Order is scheduled for{" "}
            <Typo size={12} color={colors.PRIMARY} fontFamily="Medium">
              {" "}
              {item.numberOfDays} days
            </Typo>
          </Typo>

          <View style={styles.orderItemBodyContent} />

          <Typo size={12} color={colors.NEUTRAL900} fontFamily="Medium">
            {item.startDate} - {item.endDate} | {item.time}
          </Typo>
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
    // <ScrollView
    //   contentContainerStyle={{
    //     paddingBottom: verticalScale(120),
    //     paddingTop: verticalScale(20),
    //   }}
    //   showsVerticalScrollIndicator={false}
    // >
    //   {/* Home Delivery & Take Away */}
    //   <View style={styles.orderItem}>
    //     <View style={styles.orderItemHeader}>
    //       <Image
    //         source={require("@/assets/icons/shopping-cart.webp")}
    //         resizeMode="cover"
    //         style={styles.image}
    //       />
    //       <View style={{ flex: 1 }}>
    //         <Typo size={14} color={colors.NEUTRAL900} fontFamily="Medium">
    //           Burj Al Mandhi
    //         </Typo>
    //         <Typo size={12} color={colors.NEUTRAL400}>
    //           Thiruvananthapuram
    //         </Typo>
    //       </View>
    //     </View>

    //     <View style={styles.orderItemBody}>
    //       <Typo size={12} color={colors.NEUTRAL900} fontFamily="Medium">
    //         Order is scheduled for{" "}
    //         <Typo size={12} color={colors.PRIMARY} fontFamily="Medium">
    //           09 days
    //         </Typo>
    //       </Typo>

    //       <View style={styles.orderItemBodyContent} />

    //       <Typo size={12} color={colors.NEUTRAL900} fontFamily="Medium">
    //         20th April 2024 - 29th April 2024 | 09:30 AM
    //       </Typo>
    //     </View>

    //     <View style={styles.orderItemFooter}>
    //       <Typo size={13} color={colors.PRIMARY} fontFamily="Medium">
    //         Grand Total
    //       </Typo>
    //       <Typo size={16} color={colors.NEUTRAL900} fontFamily="SemiBold">
    //         ₹ 638
    //       </Typo>
    //     </View>
    //   </View>

    //   {/* Pick and Drop */}
    //   <View style={styles.orderItem}>
    //     <View style={styles.orderItemHeader}>
    //       <Image
    //         source={require("@/assets/icons/shipping.webp")}
    //         resizeMode="cover"
    //         style={styles.image}
    //       />

    //       <Typo size={14} color={colors.NEUTRAL900} fontFamily="Medium">
    //         Pick & Drop
    //       </Typo>
    //     </View>

    //     <View style={styles.orderItemBody}>
    //       <Typo size={12} color={colors.NEUTRAL900} fontFamily="Medium">
    //         Order is scheduled for{" "}
    //         <Typo size={12} color={colors.PRIMARY} fontFamily="Medium">
    //           {" "}
    //           09 days
    //         </Typo>
    //       </Typo>

    //       <View style={styles.orderItemBodyContent}></View>

    //       <Typo size={12} color={colors.NEUTRAL900} fontFamily="Medium">
    //         20th April 2024 - 29th April 2024 | 09:30 AM
    //       </Typo>
    //     </View>

    //     <View style={styles.orderItemFooter}>
    //       <Typo size={13} color={colors.PRIMARY} fontFamily="Medium">
    //         Grand Total
    //       </Typo>
    //       <Typo size={16} color={colors.NEUTRAL900} fontFamily="SemiBold">
    //         ₹ 638
    //       </Typo>
    //     </View>
    //   </View>
    // </ScrollView>

    <FlatList
      data={isScreenActive ? scheduledOrderList : []}
      renderItem={renderItem}
      keyExtractor={(item) => item.orderId}
      showsVerticalScrollIndicator={false}
      refreshControl={
        // ✅ Attach RefreshControl
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          enabled={isScreenActive}
        />
      }
      ListEmptyComponent={
        !isLoading && !scheduledOrderList?.length ? (
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
              alignItems: "flex-start",
              // justifyContent: "center",
              gap: scale(30),
              height: SCREEN_HEIGHT - verticalScale(250),
              marginTop: verticalScale(20),
              paddingHorizontal: scale(30),
            }}
          >
            <SkeletonPlaceholder borderRadius={4}>
              <View style={{ width: SCREEN_WIDTH * 0.8 }}>
                <SkeletonPlaceholder.Item
                  flexDirection="row"
                  alignItems="center"
                >
                  <SkeletonPlaceholder.Item
                    width={60}
                    height={60}
                    borderRadius={10}
                  />
                  <SkeletonPlaceholder.Item marginLeft={20}>
                    <SkeletonPlaceholder.Item width={120} height={20} />
                    <SkeletonPlaceholder.Item
                      marginTop={6}
                      width={80}
                      height={20}
                    />
                  </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item
                  marginLeft={20}
                  marginTop={10}
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                  gap={20}
                >
                  <SkeletonPlaceholder.Item width={120} height={20} />
                  <SkeletonPlaceholder.Item
                    marginTop={6}
                    width={80}
                    height={20}
                  />
                </SkeletonPlaceholder.Item>
              </View>
            </SkeletonPlaceholder>
            <SkeletonPlaceholder borderRadius={4}>
              <View style={{ width: SCREEN_WIDTH * 0.8 }}>
                <SkeletonPlaceholder.Item
                  flexDirection="row"
                  alignItems="center"
                >
                  <SkeletonPlaceholder.Item
                    width={60}
                    height={60}
                    borderRadius={10}
                  />
                  <SkeletonPlaceholder.Item marginLeft={20}>
                    <SkeletonPlaceholder.Item width={120} height={20} />
                    <SkeletonPlaceholder.Item
                      marginTop={6}
                      width={80}
                      height={20}
                    />
                  </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item
                  marginLeft={20}
                  marginTop={10}
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                  gap={20}
                >
                  <SkeletonPlaceholder.Item width={120} height={20} />
                  <SkeletonPlaceholder.Item
                    marginTop={6}
                    width={80}
                    height={20}
                  />
                </SkeletonPlaceholder.Item>
              </View>
            </SkeletonPlaceholder>
            <SkeletonPlaceholder borderRadius={4}>
              <View style={{ width: SCREEN_WIDTH * 0.8 }}>
                <SkeletonPlaceholder.Item
                  flexDirection="row"
                  alignItems="center"
                >
                  <SkeletonPlaceholder.Item
                    width={60}
                    height={60}
                    borderRadius={10}
                  />
                  <SkeletonPlaceholder.Item marginLeft={20}>
                    <SkeletonPlaceholder.Item width={120} height={20} />
                    <SkeletonPlaceholder.Item
                      marginTop={6}
                      width={80}
                      height={20}
                    />
                  </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item
                  marginLeft={20}
                  marginTop={10}
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                  gap={20}
                >
                  <SkeletonPlaceholder.Item width={120} height={20} />
                  <SkeletonPlaceholder.Item
                    marginTop={6}
                    width={80}
                    height={20}
                  />
                </SkeletonPlaceholder.Item>
              </View>
            </SkeletonPlaceholder>
          </View>
        )
      }
    />
  );
};

export default ScheduledOrderList;

const styles = StyleSheet.create({
  image: {
    width: scale(40),
    height: scale(40),
    marginRight: scale(15),
  },
  orderItem: {
    backgroundColor: colors.WHITE,
    paddingTop: verticalScale(10),
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(10),
  },
  orderItemBody: {
    marginTop: verticalScale(10),
    borderRadius: radius._10,
    borderColor: colors.NEUTRAL200,
    borderWidth: 1,
    padding: scale(10),
    marginHorizontal: scale(15),
  },
  orderItemBodyContent: {
    borderColor: colors.NEUTRAL200,
    borderWidth: 0.5,
    marginVertical: verticalScale(5),
  },
  orderItemFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.NEUTRAL100,
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(15),
    marginTop: verticalScale(12),
    borderBottomLeftRadius: radius._10,
    borderBottomRightRadius: radius._10,
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
