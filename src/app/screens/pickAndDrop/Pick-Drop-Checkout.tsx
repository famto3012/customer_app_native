import { ScrollView, StyleSheet, View } from "react-native";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import ItemSpecification from "@/components/pickandDrop/ItemSpecification";
import AddTip from "@/components/common/AddTip";
import Typo from "@/components/Typo";
import { router, useLocalSearchParams } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  applyCustomOrderTipAndPromoCode,
  confirmCustomOrder,
  fetchCustomCartBill,
} from "@/service/customOrderService";
import { colors, radius, spacingX } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import Button from "@/components/Button";
import PromoCode from "@/components/common/Promocode";
import BillUpdate from "@/components/common/BillUpdate";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { commonStyles } from "@/constants/commonStyles";
import CustomBillDetail from "@/components/customOrder/CustomBillDetail";
import { CustomCartBill } from "@/types";
import { useAuthStore } from "@/store/store";
import AppliedPromoCode from "@/components/common/AppliedPromoCode";
import { addPickAndDropTipAndPromoCode } from "@/service/pickandDropService";

const PickAndDropCheckout = () => {
  const { cartId, items } = useLocalSearchParams();

  const [promoCodeUsed, setPromoCodeUsed] = useState<string>("");

  const { promoCode } = useAuthStore.getState();
  const customBillSheetRef = useRef<BottomSheet>(null);
  const customBillSnapPoints = useMemo(() => ["60%"], []);

  const queryClient = useQueryClient();

  useEffect(() => {
    setPromoCodeUsed(promoCode?.toString() ?? "");
  }, [promoCode]);

  // Memoized query key for performance optimization
  const queryKey = useMemo(() => ["custom-order-bill", cartId], [cartId]);

  const { data: cartBill } = useQuery<CustomCartBill>({
    queryKey,
    queryFn: () => fetchCustomCartBill(cartId.toString()),
    enabled: !!cartId,
  });

  // Mutation to apply tip
  const handleAddTipMutation = useMutation({
    mutationKey: ["pick-and-drop-tip"],
    mutationFn: (addedTip: number) => addPickAndDropTipAndPromoCode(addedTip),
    onSuccess: () => {
      queryClient.invalidateQueries({});
    },
  });

  // Mutation to confirm order
  const handleConfirmOrder = useMutation({
    mutationKey: ["confirm-custom-order"],
    mutationFn: () => confirmCustomOrder(cartId.toString()),
    onSuccess: (data) => {
      if (data?.orderId) {
        useAuthStore.setState({ promoCode: null });
        router.push({
          pathname: "/(tabs)",
          params: { orderId: data.orderId },
        });
      }
    },
    onError: (error) => {
      console.error("Order confirmation failed:", error);
    },
  });

  const confirmOrder = () => {
    if (!cartId) return;
    handleConfirmOrder.mutate();
  };

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        style={[props.style, commonStyles.backdrop]}
      />
    ),
    []
  );

  return (
    <>
      <ScreenWrapper>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <Header title="Checkout" />

          <ItemSpecification items={items.toString()} />

          <AddTip
            previousTip={cartBill?.addedTip ?? 0}
            onTipSelect={(data: number) => handleAddTipMutation.mutate(data)}
          />

          <View style={styles.billContainer}>
            <Typo size={14} color={colors.NEUTRAL900} fontFamily="Medium">
              Bill Summary
            </Typo>

            <View style={styles.promoContainer}>
              <BillUpdate
                onPress={() => customBillSheetRef.current?.snapToIndex(0)}
              />

              <View style={styles.separator} />

              <PromoCode deliveryMode="Pick and Drop" orderAmount={200} />
            </View>
          </View>

          {promoCodeUsed && (
            <AppliedPromoCode
              cartId={cartId.toString()}
              deliveryMode="Custom Order"
              onRemove={() => setPromoCodeUsed("")}
              promoCode={promoCodeUsed}
            />
          )}
        </ScrollView>

        <View style={[commonStyles.flexRowBetween, styles.btnContainer]}>
          <View>
            <Typo size={13} color={colors.NEUTRAL400}>
              Pay
            </Typo>
            <Typo size={14} color={colors.NEUTRAL900} fontFamily="Medium">
              Pay Online
            </Typo>
          </View>

          <View style={{ flex: 1 }}>
            <Button
              title="Confirm Order"
              onPress={confirmOrder}
              isLoading={handleConfirmOrder.isPending}
            />
          </View>
        </View>
      </ScreenWrapper>

      <BottomSheet
        ref={customBillSheetRef}
        index={-1}
        snapPoints={customBillSnapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <CustomBillDetail data={cartBill ?? null} />
      </BottomSheet>
    </>
  );
};

export default PickAndDropCheckout;

const styles = StyleSheet.create({
  btnContainer: {
    paddingHorizontal: scale(20),
    marginVertical: verticalScale(20),
    gap: spacingX._40,
  },
  billContainer: {
    paddingHorizontal: scale(20),
    marginTop: verticalScale(20),
  },
  promoContainer: {
    marginTop: verticalScale(30),
    borderRadius: radius._10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,
    elevation: 15,
    backgroundColor: colors.WHITE,
  },
  separator: {
    width: "80%",
    borderWidth: 0.6,
    alignSelf: "center",
    marginVertical: verticalScale(10),
    borderColor: colors.NEUTRAL300,
  },
});
