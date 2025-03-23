import { Pressable, StyleSheet, View } from "react-native";
import React, { FC } from "react";
import Typo from "../Typo";
import { XCircle } from "phosphor-react-native";
import { colors, radius } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/store";
import { removeAppliedPromoCode } from "@/service/userService";

interface AppliedPromoCodeProps {
  promoCode: string;
  cartId: string;
  deliveryMode: string;
  onRemove: () => void;
}

const AppliedPromoCode: FC<AppliedPromoCodeProps> = ({
  promoCode,
  cartId,
  deliveryMode,
  onRemove,
}) => {
  const queryClient = useQueryClient();

  const removePromoCodeMutation = useMutation<
    void,
    unknown,
    { cartId: string; deliveryMode: string }
  >({
    mutationKey: ["remove-promo-code"],
    mutationFn: () => removeAppliedPromoCode(cartId, deliveryMode),
    onSuccess: () => {
      onRemove();
      useAuthStore.setState({
        promoCode: { customOrder: "", pickAndDrop: "", universal: "" },
      });
      queryClient.clear();
    },
  });

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <Typo size={13} color={colors.NEUTRAL900}>
          Code Used:{" "}
          <Typo size={14} fontFamily="SemiBold" color={colors.NEUTRAL900}>
            {promoCode}
          </Typo>
        </Typo>
      </View>

      <Pressable
        onPress={() => {
          if (cartId && deliveryMode) {
            removePromoCodeMutation.mutate({
              cartId: cartId.toString(),
              deliveryMode: deliveryMode.toString(),
            });
          }
        }}
      >
        <XCircle color={colors.RED} />
      </Pressable>
    </View>
  );
};

export default AppliedPromoCode;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: scale(20),
    marginTop: verticalScale(20),
    backgroundColor: colors.NEUTRAL200,
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(8),
    borderRadius: radius._6,
  },
});
