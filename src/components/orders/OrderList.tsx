import { Image, ScrollView, StyleSheet, View } from "react-native";
import { scale, verticalScale } from "@/utils/styling";
import Typo from "../Typo";
import { colors, radius } from "@/constants/theme";

const OrderList = () => {
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
          <View style={styles.orderDetail}>
            <View>
              <Typo size={16} color={colors.NEUTRAL900} fontFamily="Medium">
                Burj Al Mandhi
              </Typo>
              <Typo size={12} color={colors.NEUTRAL400}>
                Thiruvananthapuram
              </Typo>
              <Typo
                size={12}
                color={colors.PRIMARY}
                style={{ paddingTop: verticalScale(10) }}
              >
                24th Apr 2024 | 09:35PM
              </Typo>
            </View>

            <Typo size={12} color={colors.GREEN} style={styles.completed}>
              Completed
            </Typo>
          </View>
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

          <View style={styles.orderDetail}>
            <View>
              <Typo size={16} color={colors.NEUTRAL900} fontFamily="Medium">
                Pick & Drop
              </Typo>
              <Typo size={12} color={colors.PRIMARY}>
                24th Apr 2024 | 09:35PM
              </Typo>
            </View>
            <Typo size={12} color={colors.GREEN} style={styles.completed}>
              Completed
            </Typo>
          </View>
        </View>

        <View
          style={[styles.orderItemFooter, { marginTop: verticalScale(15) }]}
        >
          <Typo size={13} color={colors.PRIMARY} fontFamily="Medium">
            Grand Total
          </Typo>
          <Typo size={16} color={colors.NEUTRAL900} fontFamily="SemiBold">
            ₹ 638
          </Typo>
        </View>
      </View>

      {/* Order List */}
      <View style={styles.orderItem}>
        <View style={styles.orderItemHeader}>
          <Image
            source={require("@/assets/icons/notes.webp")}
            resizeMode="cover"
            style={styles.image}
          />

          <View style={styles.orderDetail}>
            <View>
              <Typo size={16} color={colors.NEUTRAL900} fontFamily="Medium">
                Custom Order
              </Typo>
              <Typo size={12} color={colors.PRIMARY}>
                24th Apr 2024 | 09:35PM
              </Typo>
            </View>

            <Typo size={12} color={colors.GREEN} style={styles.completed}>
              Completed
            </Typo>
          </View>
        </View>

        <View
          style={[styles.orderItemFooter, { marginTop: verticalScale(15) }]}
        >
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
});
