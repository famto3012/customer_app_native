import { StyleSheet, View } from "react-native";
import { FC } from "react";
import { PickAndDropCartBill } from "@/types";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Typo from "../Typo";
import { colors, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";

const BillSheet: FC<{ data: PickAndDropCartBill }> = ({ data }) => {
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
            ₹ {data?.deliveryCharge?.toFixed(2)}
          </Typo>
        </View>

        <View style={styles.field}>
          <Typo size={14} color={colors.NEUTRAL800}>
            Surge charges
          </Typo>
          <Typo fontFamily="Medium" size={16} color={colors.NEUTRAL800}>
            ₹ {data?.surgePrice?.toFixed(2) || "0.00"}
          </Typo>
        </View>

        {/* {data?.addedTip && ( */}
        <View style={styles.field}>
          <Typo size={14} color={colors.NEUTRAL800}>
            Added Tip
          </Typo>
          <Typo fontFamily="Medium" size={16} color={colors.NEUTRAL800}>
            ₹ {data?.addedTip?.toFixed(2) || "0.00"}
          </Typo>
        </View>
        {/* )} */}

        {/* {data?.discountedAmount && ( */}
        <View style={styles.field}>
          <Typo size={14} color={colors.NEUTRAL800}>
            Discount {data?.promoCodeUsed && `(${data?.promoCodeUsed})`}
          </Typo>
          <Typo fontFamily="Medium" size={16} color={colors.NEUTRAL800}>
            ₹ {data?.discountedAmount?.toFixed(2) || "0.00"}
          </Typo>
        </View>
        {/* )} */}

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
            ₹ {data?.grandTotal?.toFixed(2)}
          </Typo>
        </View>
      </View>
    </BottomSheetScrollView>
  );
};

export default BillSheet;

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
