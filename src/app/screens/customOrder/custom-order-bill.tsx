import { ScrollView, StyleSheet, View } from "react-native";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import ItemSpecification from "@/components/customOrder/ItemSpecification";
import AddTip from "@/components/common/AddTip";
import Typo from "@/components/Typo";
import { router, useLocalSearchParams } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  applyCustomOrderTipAndPromoCode,
  confirmCustomOrder,
  fetchCustomCartBill,
} from "@/service/customOrderService";
import { colors, radius } from "@/constants/theme";
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

const CustomOrderBill = () => {
  const [promoCodeUsed, setPromoCodeUsed] = useState<string>("");

  const { cartId } = useLocalSearchParams();

  const { promoCode } = useAuthStore.getState();

  const customBillSheetRef = useRef<BottomSheet>(null);

  const customBillSnapPoints = useMemo(() => ["60%"], []);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (promoCode?.customOrder?.toString()) {
      setPromoCodeUsed(promoCode?.customOrder?.toString() || "");
    }
  }, [promoCode?.customOrder]);

  const { data: cartBill } = useQuery<CustomCartBill>({
    queryKey: ["custom-order-bill", cartId],
    queryFn: () => fetchCustomCartBill(cartId.toString()),
    enabled: !!cartId,
  });

  const handleAddTipMutation = useMutation({
    mutationKey: ["custom-order-tip"],
    mutationFn: (addedTip: number) => applyCustomOrderTipAndPromoCode(addedTip),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["custom-order-bill", cartId],
      });
    },
  });

  const handleConfirmOrder = useMutation({
    mutationKey: ["confirm-custom-order"],
    mutationFn: () => confirmCustomOrder(cartId.toString()),
    onSuccess: (data) => {
      if (data.orderId) {
        useAuthStore.setState({
          promoCode: {
            ...useAuthStore.getState().promoCode,
            customOrder: null,
          },
        });

        router.push({
          pathname: "/(tabs)",
          params: { orderId: data.orderId },
        });
      }
    },
  });

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
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: verticalScale(40) }}
        >
          <Header title="Checkout" />

          <ItemSpecification cartId={cartId.toString()} />

          <AddTip
            previousTip={cartBill?.addedTip ?? 0}
            onTipSelect={(data: number) => handleAddTipMutation.mutate(data)}
          />

          <View
            style={{
              paddingHorizontal: scale(20),
              marginTop: verticalScale(20),
            }}
          >
            <Typo size={14} color={colors.NEUTRAL900} fontFamily="Medium">
              Bill Summary
            </Typo>

            <View style={styles.promoContainer}>
              <BillUpdate
                onPress={() => customBillSheetRef.current?.snapToIndex(0)}
              />

              <View style={styles.separator} />

              <PromoCode deliveryMode="Custom Order" orderAmount={200} />
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

        <View style={styles.btnContainer}>
          <Button
            title="Confirm Order"
            onPress={() => handleConfirmOrder.mutate()}
            isLoading={handleConfirmOrder.isPending}
          />
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

export default CustomOrderBill;

const styles = StyleSheet.create({
  btnContainer: {
    paddingHorizontal: scale(20),
    marginVertical: verticalScale(20),
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
