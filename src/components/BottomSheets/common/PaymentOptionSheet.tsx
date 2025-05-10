import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  ToastAndroid,
  View,
} from "react-native";
import Typo from "@/components/Typo";
import { scale, verticalScale } from "@/utils/styling";
import { colors } from "@/constants/theme";
import { FC, useEffect, useState } from "react";
import Button from "@/components/Button";
import { useQuery } from "@tanstack/react-query";
import { fetchLoyaltyAndFamtoCash } from "@/service/userService";
import { DeliveryOptionType, PaymentOptionType } from "@/types";
import { useShowAlert } from "@/hooks/useShowAlert";

const PaymentOptionSheet: FC<{
  onSelect: (data: string) => void;
  value: string;
  onConfirm: () => void;
  grandTotal: number;
  disabled?: string[];
  deliveryOption?: DeliveryOptionType;
}> = ({ onSelect, value, onConfirm, grandTotal, disabled, deliveryOption }) => {
  const [selected, setSelected] = useState<string>("");

  const { data } = useQuery({
    queryKey: ["loyalty-and-famto-cash"],
    queryFn: () => fetchLoyaltyAndFamtoCash(),
  });

  const { showAlert } = useShowAlert();

  useEffect(() => {
    setSelected(value);
  }, [value]);

  const handleSelect = (value: PaymentOptionType) => {
    if (value === "Cash-on-delivery" && deliveryOption === "Scheduled") {
      showAlert("Scheduled orders can't be paid through cash");
      return;
    }

    if (value === "Famto-cash" && data?.walletBalance < grandTotal) {
      console.log("Here");
      showAlert(
        "Your Famto Cash balance is insufficient to make the current payment",
        "Low Balance"
      );
      return;
    }

    setSelected(value);
    onSelect(value);
  };

  return (
    <View style={styles.container}>
      <Typo size={15} color={colors.PRIMARY} fontFamily="SemiBold">
        Pay using
      </Typo>

      <View style={styles.separator} />

      <Pressable
        onPress={() => {
          handleSelect("Famto-cash");
        }}
        style={styles.optionContainer}
      >
        <Typo size={14} fontFamily="Medium" color={colors.NEUTRAL900}>
          Famto Cash{" "}
          <Typo size={13} color={colors.NEUTRAL400}>
            (Balance: {data?.walletBalance})
          </Typo>
        </Typo>

        <View
          style={[
            styles.radio,
            selected === "Famto-cash" && styles.radioSelected,
          ]}
        >
          {selected === "Famto-cash" && <View style={styles.radioInner} />}
        </View>
      </Pressable>

      <Pressable
        onPress={() => handleSelect("Online-payment")}
        style={styles.optionContainer}
      >
        <Typo size={14} fontFamily="Medium" color={colors.NEUTRAL900}>
          Pay Online
        </Typo>

        <View
          style={[
            styles.radio,
            selected === "Online-payment" && styles.radioSelected,
          ]}
        >
          {selected === "Online-payment" && <View style={styles.radioInner} />}
        </View>
      </Pressable>

      {!disabled?.includes("Cash-on-delivery") && (
        <Pressable
          onPress={() => handleSelect("Cash-on-delivery")}
          style={styles.optionContainer}
        >
          <Typo size={14} fontFamily="Medium" color={colors.NEUTRAL900}>
            Cash on Delivery
          </Typo>

          <View
            style={[
              styles.radio,
              selected === "Cash-on-delivery" && styles.radioSelected,
            ]}
          >
            {selected === "Cash-on-delivery" && (
              <View style={styles.radioInner} />
            )}
          </View>
        </Pressable>
      )}

      <Button
        title="Confirm"
        onPress={onConfirm}
        style={{ marginTop: "auto" }}
      />
    </View>
  );
};

export default PaymentOptionSheet;

const styles = StyleSheet.create({
  container: {
    padding: scale(20),
    flex: 1,
  },
  separator: {
    borderWidth: 1,
    borderColor: colors.NEUTRAL200,
    marginTop: verticalScale(12),
    marginBottom: verticalScale(20),
  },
  radio: {
    width: scale(20),
    height: scale(20),
    borderWidth: 2,
    borderColor: colors.NEUTRAL500,
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    borderColor: colors.NEUTRAL900,
  },
  radioInner: {
    width: scale(10),
    height: scale(10),
    backgroundColor: colors.NEUTRAL900,
    borderRadius: 99,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: verticalScale(24),
  },
});
