import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { verticalScale } from "@/utils/styling";
import Typo from "../Typo";
import { colors } from "@/constants/theme";

const OrderList = () => {
  return (
    <ScrollView
      contentContainerStyle={{
        paddingBottom: verticalScale(120),
        paddingTop: verticalScale(20),
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Order List */}
      <View style={styles.orderItem}>
        <View style={styles.orderItemHeader}>
          <Image
            source={require("@/assets/icons/shopping-cart.webp")}
            resizeMode="cover"
            style={{
              width: verticalScale(55),
              height: verticalScale(55),
              marginTop: 14,
            }}
          />
          <View style={styles.orderItemHeaderContent}>
            <Typo size={18} color={colors.NEUTRAL900} fontFamily="Medium">
              Burj Al Mandhi
            </Typo>
            <Typo size={14} color={colors.NEUTRAL400} fontFamily="Regular">
              Thiruvananthapuram
            </Typo>
            <Typo size={13} color={colors.PRIMARY} fontFamily="Regular">
              24th Apr 2024 | 09:35PM
            </Typo>
          </View>
          <View style={{ marginLeft: 5 }}>
            <Typo size={12} color={colors.GREEN} fontFamily="Regular">
              Completed
            </Typo>
          </View>
        </View>
        <View style={styles.orderItemFooter}>
          <Typo size={16} color={colors.PRIMARY} fontFamily="Regular">
            Grand Total
          </Typo>
          <Typo size={16} color={colors.NEUTRAL900} fontFamily="SemiBold">
            638
          </Typo>
        </View>
      </View>
      {/* Order List */}
      <View style={styles.orderItem}>
        <View style={styles.orderItemHeader}>
          <Image
            source={require("@/assets/icons/shipping.webp")}
            resizeMode="cover"
            style={{
              width: verticalScale(55),
              height: verticalScale(55),
            }}
          />
          <View style={{ marginTop: 5, ...styles.orderItemHeaderContent }}>
            <Typo size={18} color={colors.NEUTRAL900} fontFamily="Medium">
              Pick & Drop
            </Typo>
            <Typo size={13} color={colors.PRIMARY} fontFamily="Regular">
              24th Apr 2024 | 09:35PM
            </Typo>
          </View>
          <View style={{ marginLeft: 5, marginTop: 5 }}>
            <Typo size={12} color={colors.GREEN} fontFamily="Regular">
              Completed
            </Typo>
          </View>
        </View>
        <View style={styles.orderItemFooter}>
          <Typo size={16} color={colors.PRIMARY} fontFamily="Regular">
            Grand Total
          </Typo>
          <Typo size={16} color={colors.NEUTRAL900} fontFamily="SemiBold">
            638
          </Typo>
        </View>
      </View>
      {/* Order List */}
      <View style={styles.orderItem}>
        <View style={styles.orderItemHeader}>
          <Image
            source={require("@/assets/icons/notes.webp")}
            resizeMode="cover"
            style={{
              width: verticalScale(55),
              height: verticalScale(55),
            }}
          />
          <View style={{ marginTop: 5, ...styles.orderItemHeaderContent }}>
            <Typo size={18} color={colors.NEUTRAL900} fontFamily="Medium">
              Custom Order
            </Typo>
            <Typo size={13} color={colors.PRIMARY} fontFamily="Regular">
              24th Apr 2024 | 09:35PM
            </Typo>
          </View>
          <View style={{ marginLeft: 5, marginTop: 5 }}>
            <Typo size={12} color={colors.GREEN} fontFamily="Regular">
              Completed
            </Typo>
          </View>
        </View>
        <View style={styles.orderItemFooter}>
          <Typo size={16} color={colors.PRIMARY} fontFamily="Regular">
            Grand Total
          </Typo>
          <Typo size={16} color={colors.NEUTRAL900} fontFamily="SemiBold">
            638
          </Typo>
        </View>
      </View>
    </ScrollView>
  );
};

export default OrderList;

const styles = StyleSheet.create({
  orderItem: {
    backgroundColor: "#fff",
    padding: 15,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 }, // Small negative height moves shadow above
    shadowOpacity: 0.15, // Subtle but visible
    shadowRadius: 10,
    elevation: 2,
  },
  orderItemHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  orderItemHeaderContent: {
    marginLeft: -25,
  },
  orderItemFooter: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingLeft: 5,
  },
});
