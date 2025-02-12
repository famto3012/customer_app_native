import { StyleSheet, View } from "react-native";
import Typo from "../Typo";
import { colors } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";

const BillDetail = () => {
  const RenderBillField = ({ field, value }: any) => {
    return (
      <View style={styles.field}>
        <Typo fontFamily="Medium" size={14} color={colors.NEUTRAL800}>
          {field}
        </Typo>
        <Typo fontFamily="Medium" size={16} color={colors.NEUTRAL800}>
          ₹ {value}
        </Typo>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <RenderBillField field="Item Total" value={250} />
      <RenderBillField field="Delivery Charges" value={75} />
      <RenderBillField field="Tip" value={20} />
      <RenderBillField field="Discount" value={30} />
      <RenderBillField field="Taxes & Fees" value={20} />
      <View
        style={{
          borderWidth: 0.5,
          borderColor: colors.NEUTRAL300,
          marginTop: verticalScale(15),
        }}
      />
      <RenderBillField field="Grand Total" value={639} />
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
