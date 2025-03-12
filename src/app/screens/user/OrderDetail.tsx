import {
  Alert,
  FlatList,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import Typo from "@/components/Typo";
import { colors } from "@/constants/theme";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/store";
import { getOrderDetail } from "@/service/orderService";
import { scale, verticalScale } from "@/utils/styling";
import OrderBillDetail from "@/components/orders/OrderBillDetail";
import { ChatTeardropDots, Phone } from "phosphor-react-native";

const OrderDetail = () => {
  const { orderId } = useLocalSearchParams();

  const { token } = useAuthStore.getState();

  const { data, isLoading } = useQuery({
    queryKey: ["order-details", orderId],
    queryFn: () => getOrderDetail(orderId.toString()),
    enabled: !!token && !!orderId,
  });

  // console.log("data", data);

  const renderItem = ({ item }: any) => {
    if (
      data?.deliveryMode !== "Home Delivery" &&
      data?.deliveryMode !== "Take Away"
    ) {
      return (
        <View style={styles.tableContainer}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Typo
              size={13}
              fontFamily="SemiBold"
              color={colors.NEUTRAL900}
              style={styles.tableHeaderCell}
            >
              Item
            </Typo>
            <Typo
              size={13}
              fontFamily="SemiBold"
              color={colors.NEUTRAL900}
              style={styles.tableHeaderCell}
            >
              {data?.deliveryMode === "Custom Order" ? "Quantity" : "Dimension"}
            </Typo>
            <Typo
              size={13}
              fontFamily="SemiBold"
              color={colors.NEUTRAL900}
              style={styles.tableHeaderCell}
            >
              {data?.deliveryMode === "Custom Order" ? "No of units" : "Weight"}
            </Typo>
          </View>

          {/* Table Row */}
          <View style={styles.tableRow}>
            <Typo size={13} color={colors.NEUTRAL900} style={styles.tableCell}>
              {item?.itemName}
            </Typo>
            <Typo size={13} color={colors.NEUTRAL900} style={styles.tableCell}>
              {data?.deliveryMode !== "Custom Order"
                ? `${item?.length} x ${item?.width} x ${item?.height} ${item?.unit}` ||
                  "N/A"
                : `${item?.quantity} ${item?.unit}`}
            </Typo>
            <Typo size={13} color={colors.NEUTRAL900} style={styles.tableCell}>
              {data?.deliveryMode !== "Custom Order"
                ? item?.weight
                  ? `${item.weight} kg`
                  : "N/A"
                : `${item?.numOfUnits}`}
            </Typo>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.billItems}>
        <View
          style={{
            width: scale(8),
            height: scale(8),
            borderRadius: scale(4),
            backgroundColor: colors.NEUTRAL900,
          }}
        />
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            marginHorizontal: scale(30),
            gap: 10,
          }}
        >
          <Typo size={13} color={colors.NEUTRAL400}>
            {item?.quantity} x
          </Typo>
          <Typo size={13} fontFamily="Medium" color={colors.NEUTRAL900}>
            {item?.itemName}
          </Typo>
        </View>
        <Typo size={14} fontFamily="SemiBold" color={colors.NEUTRAL900}>
          ₹ {item?.price}
        </Typo>
      </View>
    );
  };

  return (
    <ScreenWrapper>
      <Header title="Order details" />
      <ScrollView
        contentContainerStyle={{ paddingBottom: scale(10) }}
        showsVerticalScrollIndicator={false}
      >
        {data?.status === "On-going" && data?.deliveryMode !== "Take Away" && (
          <View
            style={{
              backgroundColor: colors.NEUTRAL400,
              width: SCREEN_WIDTH,
              height: SCREEN_HEIGHT * 0.4,
              marginTop: scale(10),
            }}
          >
            <Typo>Map</Typo>
          </View>
        )}
        <View style={styles.headerTile}>
          <View>
            <Typo size={16} fontFamily="SemiBold" color={colors.NEUTRAL900}>
              Order ID: {orderId}{" "}
            </Typo>
            <Typo size={12} color={colors.NEUTRAL900}>
              {data?.status === "Completed"
                ? `Order delivered on ${data?.orderDate} ${data?.orderTime}`
                : `Order will be delivered at ${data?.deliveryTime} `}
            </Typo>
          </View>
          {data?.status === "On-going" &&
            data?.deliveryMode !== "Take Away" && (
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  gap: scale(15),
                }}
              >
                <Pressable
                  onPress={() => {
                    if (data?.agentId) {
                      const dialerUrl = `tel:${data?.agentPhone}`;
                      Linking.openURL(dialerUrl).catch((err) =>
                        Alert.alert("Error", "Unable to open dialer")
                      );
                    } else {
                      Alert.alert("No agent assigned for this order");
                    }
                  }}
                >
                  <Phone size={32} color={colors.PRIMARY} />
                </Pressable>
                <Pressable
                  onPress={() => {
                    if (data?.agentId) {
                      router.push({
                        pathname: "/screens/user/chatPage",
                        params: {
                          agentId: data?.agentId,
                          agentImage: data?.agentImageURL,
                          agentName: data?.agentName,
                          agentPhone: data?.agentPhone,
                        },
                      });
                    } else {
                      Alert.alert("No agent assigned for this order");
                    }
                  }}
                >
                  <ChatTeardropDots size={32} color={colors.PRIMARY} />
                </Pressable>
              </View>
            )}
        </View>
        <View style={styles.deliveryMode}>
          <Typo size={12} color={colors.NEUTRAL900}>
            {data?.deliveryMode}
          </Typo>
        </View>
        <View style={styles.addressDetails}>
          <View style={styles.address}>
            {/* <View> */}
            <Image
              source={require("@/assets/icons/pickup-icon-order-detail.webp")}
              resizeMode="cover"
              style={{
                width: SCREEN_WIDTH * 0.1,
                height: SCREEN_WIDTH * 0.1,
                marginVertical: scale(15),
                marginRight: scale(20),
              }}
            />
            {/* </View> */}
            <View
              style={{
                marginTop:
                  data?.deliveryMode === "Take Away" ||
                  data?.deliveryMode === "Home Delivery"
                    ? 0
                    : data?.pickUpAddress &&
                      Object.keys(data.pickUpAddress).length === 0
                    ? verticalScale(-30)
                    : verticalScale(44),
              }}
            >
              <Typo size={14} fontFamily="Medium" color={colors.NEUTRAL900}>
                {data?.pickUpAddress?.fullName}
              </Typo>
              {data?.deliveryMode !== "Take Away" &&
              data?.deliveryMode !== "Home Delivery" ? (
                <>
                  {data?.pickUpAddress &&
                  Object.keys(data.pickUpAddress).length === 0 ? (
                    <Typo
                      size={13}
                      fontFamily="Medium"
                      color={colors.NEUTRAL900}
                    >
                      Buy from Anywhere
                    </Typo>
                  ) : (
                    <>
                      <Typo size={13} color={colors.NEUTRAL900}>
                        {data?.pickUpAddress?.phoneNumber}
                      </Typo>
                      <Typo size={12} color={colors.NEUTRAL400}>
                        {data?.pickUpAddress?.flat}
                      </Typo>
                      <Typo size={12} color={colors.NEUTRAL400}>
                        {data?.pickUpAddress?.area}
                      </Typo>
                      <Typo size={12} color={colors.NEUTRAL400}>
                        {data?.pickUpAddress?.landmark}
                      </Typo>
                    </>
                  )}
                </>
              ) : (
                <Typo size={12} color={colors.NEUTRAL400}>
                  {data?.pickUpAddress?.area}
                </Typo>
              )}
            </View>
          </View>
          {data?.deliveryMode !== "Take Away" && (
            <>
              <View style={styles.separator} />
              <View style={styles.address}>
                <View>
                  <Image
                    source={require("@/assets/icons/drop-icon-order-detail.webp")}
                    resizeMode="cover"
                    style={{
                      width: SCREEN_WIDTH * 0.1,
                      height: SCREEN_WIDTH * 0.1,
                      marginVertical: scale(15),
                      marginRight: scale(20),
                    }}
                  />
                </View>
                <View style={{ marginTop: verticalScale(43) }}>
                  <Typo size={14} fontFamily="Medium" color={colors.NEUTRAL900}>
                    {data?.deliveryAddress?.fullName}
                  </Typo>
                  <Typo size={13} color={colors.NEUTRAL900}>
                    {data?.deliveryAddress?.phoneNumber}
                  </Typo>
                  <Typo size={12} color={colors.NEUTRAL400}>
                    {data?.deliveryAddress?.flat}
                  </Typo>
                  <Typo size={12} color={colors.NEUTRAL400}>
                    {data?.deliveryAddress?.area}
                  </Typo>
                  <Typo size={12} color={colors.NEUTRAL400}>
                    {data?.deliveryAddress?.landmark}
                  </Typo>
                </View>
              </View>
            </>
          )}
        </View>
        <View style={styles.billDetails}>
          <Typo size={14} fontFamily="Medium" color={colors.PRIMARY}>
            {data?.deliveryMode !== "Home Delivery" &&
            data?.deliveryMode !== "Take Away"
              ? "Item Specifications"
              : "Bill details"}
          </Typo>
          <FlatList
            data={data?.items}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            style={{
              marginTop: scale(10),
            }}
          />
        </View>
        <View>
          {data?.deliveryMode !== "Home Delivery" &&
            data?.deliveryMode !== "Take Away" && (
              <View style={{ marginHorizontal: scale(20) }}>
                <Typo size={14} fontFamily="Medium" color={colors.PRIMARY}>
                  Bill details
                </Typo>
              </View>
            )}
          {data?.deliveryMode === "Custom Order" ? (
            <View style={{ marginTop: scale(10), marginHorizontal: scale(20) }}>
              <Typo size={14} fontFamily="Medium" color={colors.NEUTRAL900}>
                Bill will be updated soon
              </Typo>
            </View>
          ) : (
            <OrderBillDetail data={data?.billDetail} isLoading={isLoading} />
          )}
        </View>
        <View
          style={{
            marginHorizontal: scale(20),
            marginVertical: verticalScale(30),
          }}
        >
          <Typo size={12} color={colors.NEUTRAL400}>
            Payment mode
          </Typo>
          <Typo fontFamily="Medium" size={14} color={colors.NEUTRAL900}>
            {data?.paymentMode}
          </Typo>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default OrderDetail;

const styles = StyleSheet.create({
  headerTile: {
    backgroundColor: colors.NEUTRAL100,
    padding: scale(20),
    marginTop: 40,
    marginBottom: scale(20),
    borderRadius: 10,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  deliveryMode: {
    backgroundColor: colors.PRIMARY_LIGHT,
    padding: 10,
    borderRadius: scale(15),
    marginHorizontal: scale(20),
    width: SCREEN_WIDTH * 0.35,
    justifyContent: "center",
    alignItems: "center",
  },
  address: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: SCREEN_WIDTH * 0.9,
    // backgroundColor: colors.NEUTRAL400,
  },
  addressDetails: {
    height: SCREEN_HEIGHT * 0.2,
    marginVertical: scale(15),
    marginHorizontal: scale(20),
    alignItems: "flex-start",
  },
  billDetails: {
    marginHorizontal: scale(20),
    marginTop: scale(20),
    paddingBottom: scale(10),
    marginBottom: scale(15),
    borderBottomWidth: 1,
    borderColor: colors.NEUTRAL300,
  },
  billItems: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: scale(30),
  },
  separator: {
    width: 1,
    height: "25%",
    borderColor: colors.NEUTRAL300,
    alignSelf: "flex-start",
    marginHorizontal: scale(18),
    borderWidth: 1,
    borderStyle: "dotted",
  },
  tableContainer: {
    // marginHorizontal: scale(20),
    marginVertical: scale(10),
    borderWidth: 1,
    borderColor: colors.NEUTRAL300,
    borderRadius: scale(5),
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.NEUTRAL100,
    paddingVertical: scale(8),
    borderBottomWidth: 1,
    borderColor: colors.NEUTRAL300,
  },
  tableHeaderCell: {
    flex: 1,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: scale(8),
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
  },
});
