import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { verticalScale } from "@/utils/styling";
import Typo from "../Typo";
import { colors } from "@/constants/theme";

const ScheduledOrderList = () => {
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
            }}
          />
          <View style={{ marginTop: 10, ...styles.orderItemHeaderContent }}>
            <Typo size={18} color={colors.NEUTRAL900} fontFamily="Medium">
              Burj Al Mandhi
            </Typo>
            <Typo size={14} color={colors.NEUTRAL400} fontFamily="Regular">
              Thiruvananthapuram
            </Typo>
          </View>
        </View>
        <View style={styles.orderItemBody}>
          <View>
            <Typo size={14} color={colors.NEUTRAL900} fontFamily="Medium">
              Order is scheduled for{" "}
              <Typo size={14} color={colors.PRIMARY}>
                {" "}
                09 days
              </Typo>
            </Typo>
          </View>
          <View style={styles.orderItemBodyContent}></View>
          <View>
            <Typo size={14} color={colors.NEUTRAL900} fontFamily="Medium">
              20th April 2024 - 29th April 2024 | 09:30 AM
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
          <View style={{ marginTop: 15, ...styles.orderItemHeaderContent }}>
            <Typo size={18} color={colors.NEUTRAL900} fontFamily="Medium">
              Pick & Drop
            </Typo>
          </View>
        </View>
        <View style={styles.orderItemBody}>
          <View>
            <Typo size={14} color={colors.NEUTRAL900} fontFamily="Medium">
              Order is scheduled for{" "}
              <Typo size={14} color={colors.PRIMARY}>
                {" "}
                09 days
              </Typo>
            </Typo>
          </View>
          <View style={styles.orderItemBodyContent}></View>
          <View>
            <Typo size={14} color={colors.NEUTRAL900} fontFamily="Medium">
              20th April 2024 - 29th April 2024 | 09:30 AM
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
          <View style={{ marginTop: 15, ...styles.orderItemHeaderContent }}>
            <Typo size={18} color={colors.NEUTRAL900} fontFamily="Medium">
              Pick & Drop
            </Typo>
          </View>
        </View>
        <View style={styles.orderItemBody}>
          <View>
            <Typo size={14} color={colors.NEUTRAL900} fontFamily="Medium">
              Order is scheduled for{" "}
              <Typo size={14} color={colors.PRIMARY}>
                {" "}
                09 days
              </Typo>
            </Typo>
          </View>
          <View style={styles.orderItemBodyContent}></View>
          <View>
            <Typo size={14} color={colors.NEUTRAL900} fontFamily="Medium">
              20th April 2024 - 29th April 2024 | 09:30 AM
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

export default ScheduledOrderList;

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
  },
  orderItemHeaderContent: {
    marginLeft: 10,
  },
  orderItemBody: {
    marginTop: 10,
    borderRadius: 10,
    borderColor: colors.NEUTRAL200,
    borderWidth: 1,
    padding: 10,
  },
  orderItemBodyContent: {
    borderColor: colors.NEUTRAL200,
    borderWidth: 0.5,
    marginTop: 5,
    marginBottom: 5,
    height: 0,
  },
  orderItemFooter: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    paddingLeft: 5,
  },
});
