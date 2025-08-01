import { colors } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { FC } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import Typo from "../Typo";

interface UniversalBillProps {
  deliveryChargePerDay: number;
  originalDeliveryCharge: number;
  discountedDeliveryCharge?: number;
  taxAmount: number;
  merchantDiscount?: number;
  promoCodeUsed?: string;
  discountedAmount?: number;
  originalGrandTotal: number;
  discountedGrandTotal?: number;
  itemTotal: number;
  addedTip?: number;
  subTotal: number;
  surgePrice?: number;
  loyaltyDiscount?: number;
}

const BillDetail: FC<{ data: UniversalBillProps; isLoading: boolean }> = ({
  data,
  isLoading,
}) => {
  const discountLabel = data?.promoCodeUsed
    ? `Discount (${data.promoCodeUsed})`
    : `Discount`;

  const discountWithoutLoyalty = data?.loyaltyDiscount
    ? (data?.discountedAmount as number) - data?.loyaltyDiscount
    : data?.discountedAmount;

  const RenderBillField = ({
    field,
    value,
  }: {
    field: string;
    value: number;
  }) => {
    return (
      <View style={styles.field}>
        <Typo fontFamily="Medium" size={14} color={colors.NEUTRAL800}>
          {field.toString()}
        </Typo>
        <Typo fontFamily="Medium" size={16} color={colors.NEUTRAL800}>
          {`₹ ${value?.toFixed(2)}`}
        </Typo>
      </View>
    );
  };

  if (isLoading)
    return (
      <View
        style={{
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={colors.PRIMARY} />
      </View>
    );

  return (
    <View style={styles.container}>
      <RenderBillField field="Item Totals" value={data?.itemTotal} />
      <RenderBillField
        field="Delivery Charges"
        value={
          data?.discountedDeliveryCharge
            ? data.discountedDeliveryCharge
            : data?.originalDeliveryCharge
        }
      />

      {typeof data?.surgePrice === "number" && data.surgePrice > 0 && (
        <RenderBillField field="Surge Charge" value={data.surgePrice} />
      )}

      {typeof data?.addedTip === "number" && data.addedTip > 0 && (
        <RenderBillField field="Tip" value={data.addedTip} />
      )}

      {typeof data?.discountedAmount === "number" &&
        discountWithoutLoyalty !== 0 &&
        data?.discountedAmount > 0 && (
          <RenderBillField
            field={discountLabel}
            value={discountWithoutLoyalty as number}
          />
        )}

      {typeof data?.loyaltyDiscount === "number" &&
        data?.loyaltyDiscount > 0 && (
          <RenderBillField
            field="Loyalty discount"
            value={data?.loyaltyDiscount}
          />
        )}

      <RenderBillField field="Sub Total" value={data?.subTotal} />

      <View
        style={{
          borderWidth: 0.5,
          borderColor: colors.NEUTRAL300,
          marginTop: verticalScale(15),
        }}
      />

      <RenderBillField field="Taxes & Fees" value={data?.taxAmount} />
      <View
        style={{
          borderWidth: 0.5,
          borderColor: colors.NEUTRAL300,
          marginTop: verticalScale(15),
        }}
      />
      <RenderBillField
        field="Grand Total"
        value={
          data?.discountedGrandTotal
            ? data.discountedGrandTotal
            : data?.originalGrandTotal
        }
      />
    </View>
  );
};

export default BillDetail;

const styles = StyleSheet.create({
  field: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 15,
  },
  container: {
    marginTop: verticalScale(15),
  },
});
