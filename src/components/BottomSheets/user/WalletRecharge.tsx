import { Pressable, StyleSheet, TextInput, View } from "react-native";
import React, { FC, useState } from "react";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Typo from "@/components/Typo";
import { scale, verticalScale } from "@/utils/styling";
import { colors, radius, spacingX } from "@/constants/theme";
import Button from "@/components/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  initiateWalletDeposit,
  verifyWalletPayment,
} from "@/service/userService";

const WalletRecharge: FC<{ onClose: () => void }> = ({ onClose }) => {
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const handleInitiatePaymentMutation = useMutation({
    mutationKey: ["initiate-wallet-recharge"],
    mutationFn: () => initiateWalletDeposit(Number(selectedAmount)),
    onSuccess: (data) => {
      if (data.orderId) {
        handleVerifyPaymentMutation.mutate({
          orderId: data.orderId,
          amount: data.amount,
        });
      }
    },
  });

  const handleVerifyPaymentMutation = useMutation({
    mutationKey: ["verify-wallet-payment"],
    mutationFn: ({ orderId, amount }: { orderId: string; amount: number }) =>
      verifyWalletPayment(orderId, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loyalty-and-famto-cash"] });
      onClose();
    },
  });

  return (
    <BottomSheetScrollView contentContainerStyle={styles.container}>
      <Typo size={15} color={colors.NEUTRAL900} fontFamily="SemiBold">
        Enter amount
      </Typo>

      <TextInput
        style={{
          borderBottomWidth: 0.6,
          height: verticalScale(55),
          borderBottomColor: colors.NEUTRAL400,
          fontSize: scale(16),
          fontFamily: "SemiBold",
          color: colors.PRIMARY,
        }}
        keyboardType="numeric"
        onChangeText={(value) => setSelectedAmount(value)}
        value={selectedAmount ?? ""}
      />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: spacingX._10,
          marginVertical: verticalScale(15),
          marginBottom: "auto",
        }}
      >
        {["100", "200", "500", "1000"].map((value) => (
          <Pressable
            key={value}
            onPress={() => setSelectedAmount(value)}
            style={{
              justifyContent: "center",
              alignItems: "center",
              backgroundColor:
                selectedAmount === value ? colors.PRIMARY : colors.NEUTRAL200,
              flex: 1,
              paddingVertical: verticalScale(10),
              borderRadius: radius._10,
            }}
          >
            <Typo
              size={16}
              color={
                selectedAmount === value ? colors.WHITE : colors.NEUTRAL900
              }
            >
              ₹ {value}
            </Typo>
          </Pressable>
        ))}
      </View>

      <Button
        title="Add balance"
        onPress={() => handleInitiatePaymentMutation.mutate()}
        isLoading={
          handleInitiatePaymentMutation.isPending ||
          handleVerifyPaymentMutation.isPending
        }
      />
    </BottomSheetScrollView>
  );
};

export default WalletRecharge;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(20),
    flex: 1,
  },
});
