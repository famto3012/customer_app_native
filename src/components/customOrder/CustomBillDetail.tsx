import { Image, StyleSheet, View } from "react-native";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import Typo from "../Typo";
import { FC } from "react";
import { CustomCartBill } from "@/types";

const CustomBillDetail: FC<{ data: CustomCartBill }> = ({ data }) => {
  return (
    <BottomSheetScrollView style={styles.container}>
      <Typo
        size={15}
        fontFamily="SemiBold"
        color={colors.PRIMARY}
        style={{
          paddingBottom: verticalScale(10),
          borderBottomWidth: 1,
          borderBottomColor: colors.NEUTRAL350,
        }}
      >
        Bill Summary
      </Typo>

      <View style={{ gap: spacingY._10, marginTop: verticalScale(20) }}>
        <View style={styles.field}>
          <Typo size={14} color={colors.NEUTRAL800}>
            Delivery charges
          </Typo>
          <Typo fontFamily="Medium" size={16} color={colors.NEUTRAL800}>
            Will be updated soon
          </Typo>
        </View>

        <View style={styles.field}>
          <Typo size={14} color={colors.NEUTRAL800}>
            Surge charges
          </Typo>
          <Typo fontFamily="Medium" size={16} color={colors.NEUTRAL800}>
            ₹ {data?.surgePrice?.toFixed(0) || "0.00"}
          </Typo>
        </View>

        {data?.addedTip && (
          <View style={styles.field}>
            <Typo size={14} color={colors.NEUTRAL800}>
              Added Tip
            </Typo>
            <Typo fontFamily="Medium" size={16} color={colors.NEUTRAL800}>
              {data?.addedTip}
            </Typo>
          </View>
        )}

        {data?.discountedAmount && (
          <View style={styles.field}>
            <Typo size={14} color={colors.NEUTRAL800}>
              Discount {data?.promoCodeUsed && data?.promoCodeUsed}
            </Typo>
            <Typo fontFamily="Medium" size={16} color={colors.NEUTRAL800}>
              {data?.discountedAmount}
            </Typo>
          </View>
        )}

        <View style={styles.field}>
          <Typo size={14} color={colors.NEUTRAL800}>
            Taxes & Fees
          </Typo>
          <Typo fontFamily="Medium" size={16} color={colors.NEUTRAL800}>
            ₹ {data?.taxAmount?.toFixed(2)}
          </Typo>
        </View>

        <View
          style={{
            borderWidth: 0.6,
            borderColor: colors.NEUTRAL300,
            width: "100%",
            alignSelf: "center",
            marginVertical: verticalScale(5),
          }}
        />

        <View style={styles.field}>
          <Typo size={14} color={colors.NEUTRAL800}>
            Grand Total
          </Typo>
          <Typo fontFamily="Medium" size={16} color={colors.NEUTRAL800}>
            Will be updated soon
          </Typo>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            gap: spacingX._10,
            marginTop: verticalScale(15),
          }}
        >
          <Image
            source={require("@/assets/icons/hand-arrow.webp")}
            style={{
              width: scale(24),
              height: verticalScale(24),
              resizeMode: "cover",
            }}
          />
          <Typo size={12} style={{ flex: 1, textAlign: "justify" }}>
            Delivery charge is the fixed amount as per distance between delivery
            location and store. Store bill will be shared once the delivery
            rider confirms the the items with the store
          </Typo>
        </View>
      </View>
    </BottomSheetScrollView>
  );
};

export default CustomBillDetail;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(20),
    marginVertical: verticalScale(20),
  },
  field: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
