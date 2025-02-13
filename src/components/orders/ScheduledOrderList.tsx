import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { scale, verticalScale } from "@/utils/styling";
import Typo from "../Typo";
import { colors, radius } from "@/constants/theme";

const ScheduledOrderList = () => {
  return (
    <ScrollView
      contentContainerStyle={{
        paddingBottom: verticalScale(120),
        paddingTop: verticalScale(20),
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Home Delivery & Take Away */}
      <View style={styles.orderItem}>
        <View style={styles.orderItemHeader}>
          <Image
            source={require("@/assets/icons/shopping-cart.webp")}
            resizeMode="cover"
            style={styles.image}
          />
          <View style={{ flex: 1 }}>
            <Typo size={14} color={colors.NEUTRAL900} fontFamily="Medium">
              Burj Al Mandhi
            </Typo>
            <Typo size={12} color={colors.NEUTRAL400}>
              Thiruvananthapuram
            </Typo>
          </View>
        </View>

        <View style={styles.orderItemBody}>
          <Typo size={12} color={colors.NEUTRAL900} fontFamily="Medium">
            Order is scheduled for{" "}
            <Typo size={12} color={colors.PRIMARY} fontFamily="Medium">
              09 days
            </Typo>
          </Typo>

          <View style={styles.orderItemBodyContent} />

          <Typo size={12} color={colors.NEUTRAL900} fontFamily="Medium">
            20th April 2024 - 29th April 2024 | 09:30 AM
          </Typo>
        </View>

        <View style={styles.orderItemFooter}>
          <Typo size={13} color={colors.PRIMARY} fontFamily="Medium">
            Grand Total
          </Typo>
          <Typo size={16} color={colors.NEUTRAL900} fontFamily="SemiBold">
            ₹ 638
          </Typo>
        </View>
      </View>

      {/* Pick and Drop */}
      <View style={styles.orderItem}>
        <View style={styles.orderItemHeader}>
          <Image
            source={require("@/assets/icons/shipping.webp")}
            resizeMode="cover"
            style={styles.image}
          />

          <Typo size={14} color={colors.NEUTRAL900} fontFamily="Medium">
            Pick & Drop
          </Typo>
        </View>

        <View style={styles.orderItemBody}>
          <Typo size={12} color={colors.NEUTRAL900} fontFamily="Medium">
            Order is scheduled for{" "}
            <Typo size={12} color={colors.PRIMARY} fontFamily="Medium">
              {" "}
              09 days
            </Typo>
          </Typo>

          <View style={styles.orderItemBodyContent}></View>

          <Typo size={12} color={colors.NEUTRAL900} fontFamily="Medium">
            20th April 2024 - 29th April 2024 | 09:30 AM
          </Typo>
        </View>

        <View style={styles.orderItemFooter}>
          <Typo size={13} color={colors.PRIMARY} fontFamily="Medium">
            Grand Total
          </Typo>
          <Typo size={16} color={colors.NEUTRAL900} fontFamily="SemiBold">
            ₹ 638
          </Typo>
        </View>
      </View>
    </ScrollView>
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
});
