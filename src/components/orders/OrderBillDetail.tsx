import { FC } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import Typo from "../Typo";
import { colors } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";

interface UniversalBillProps {
  deliveryChargePerDay: number;
  deliveryCharge?: number;
  taxAmount: number;
  merchantDiscount?: number;
  promoCodeUsed?: string;
  discountedAmount?: number;
  grandTotal: number;
  itemTotal: number;
  addedTip?: number;
  subTotal: number;
  surgePrice?: number;
}

const OrderBillDetail: FC<{ data: UniversalBillProps; isLoading: boolean }> = ({
  data,
  isLoading,
}) => {
  const discountLabel = data?.promoCodeUsed
    ? `Discount (${data.promoCodeUsed})`
    : `Discount`;

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
          {field}
        </Typo>
        <Typo fontFamily="Medium" size={16} color={colors.NEUTRAL800}>
          {`₹ ${String(value)}`}
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
      <RenderBillField
        field="Item Total"
        value={data?.itemTotal === null ? 0 : data?.itemTotal}
      />
      {typeof data?.deliveryCharge === "number" && data.deliveryCharge > 0 && (
        <RenderBillField field="Delivery Charges" value={data.deliveryCharge} />
      )}

      {data?.addedTip && <RenderBillField field="Tip" value={data?.addedTip} />}

      {data?.discountedAmount && (
        <RenderBillField field={discountLabel} value={data?.discountedAmount} />
      )}

      <RenderBillField field="Sub Total" value={data?.subTotal} />

      <View
        style={{
          borderWidth: 0.5,
          borderColor: colors.NEUTRAL300,
          marginTop: verticalScale(15),
        }}
      />

      <RenderBillField
        field="Taxes & Fees"
        value={data?.taxAmount == null ? 0 : data?.taxAmount}
      />
      <View
        style={{
          borderWidth: 0.5,
          borderColor: colors.NEUTRAL300,
          marginTop: verticalScale(15),
        }}
      />
      <RenderBillField field="Grand Total" value={data?.grandTotal} />
    </View>
  );
};

export default OrderBillDetail;

const styles = StyleSheet.create({
  field: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  container: {
    marginHorizontal: scale(20),
  },
});
