import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import ItemSpecification from "@/components/pickandDrop/ItemSpecification";
import AddTip from "@/components/common/AddTip";
import Typo from "@/components/Typo";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { colors, radius, spacingX } from "@/constants/theme";
import { scale, SCREEN_WIDTH, verticalScale } from "@/utils/styling";
import Button from "@/components/Button";
import PromoCode from "@/components/common/Promocode";
import BillUpdate from "@/components/common/BillUpdate";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { commonStyles } from "@/constants/commonStyles";
import { PickAndDropCartBill } from "@/types";
import { useAuthStore } from "@/store/store";
import AppliedPromoCode from "@/components/common/AppliedPromoCode";
import {
  confirmPickAndDropOrder,
  getPickAndDropBill,
  verifyPickAndDropPayment,
} from "@/service/pickandDropService";
import BillSheet from "@/components/pickandDrop/BillSheet";
import { CaretUp } from "phosphor-react-native";
import PaymentOptionSheet from "@/components/BottomSheets/common/PaymentOptionSheet";
import { addOrder } from "@/localDB/controller/orderController";
import { updateTip } from "@/service/userService";

const PickAndDropCheckout = () => {
  const [promoCodeUsed, setPromoCodeUsed] = useState<string>("");
  const [selectedPaymentMode, setSelectedPaymentMode] =
    useState<string>("Online-payment");

  const { cartId, items }: { cartId: string; items: string } =
    useLocalSearchParams();

  const promoCode = useAuthStore((state) => state.promoCode.pickAndDrop);

  const billSheetRef = useRef<BottomSheet>(null);
  const paymentSheetRef = useRef<BottomSheet>(null);

  const paymentSheetSnapPoints = useMemo(() => ["35%"], []);
  const billSnapPoints = useMemo(() => ["45%"], []);

  const queryClient = useQueryClient();

  useEffect(() => {
    setPromoCodeUsed(promoCode?.toString() ?? "");
  }, [promoCode]);

  useFocusEffect(
    useCallback(() => {
      if (promoCode || promoCodeUsed) {
        useAuthStore.setState({
          promoCode: { customOrder: "", pickAndDrop: "", universal: "" },
        });
        setPromoCodeUsed("");
      }

      if (cartBill?.addedTip) {
        handleAddTipMutation.mutate(0);
      }

      return () => null;
    }, [])
  );

  const { data: cartBill } = useQuery<PickAndDropCartBill>({
    queryKey: ["pick-and-drop-bill", cartId],
    queryFn: () => getPickAndDropBill(cartId.toString()),
    enabled: !!cartId,
  });

  const handleAddTipMutation = useMutation({
    mutationKey: ["order-tip"],
    mutationFn: (tip: number) => updateTip(cartId, "Pick and Drop", tip),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pick-and-drop-bill"] });
    },
  });

  // Mutation to confirm order
  const handleConfirmOrder = useMutation({
    mutationKey: ["confirm-pick-and-drop-order"],
    mutationFn: () => confirmPickAndDropOrder(selectedPaymentMode),
    onSuccess: (data) => {
      if (selectedPaymentMode === "Online-payment") {
        handleVerifyPaymentMutation.mutate({
          orderId: data.orderId,
          amount: data?.amount as number,
        });
      } else if (selectedPaymentMode === "Famto-cash") {
        if (data?.success && data?.orderId && data?.createdAt) {
          addOrder(data.orderId, data.createdAt, "Pick-and-drop");

          useAuthStore.setState({
            promoCode: {
              universal: null,
              pickAndDrop: null,
              customOrder: null,
            },
          });

          router.replace({
            pathname: "/(tabs)",
          });
        } else if (data?.success && !data?.orderId && !data?.createdAt) {
          useAuthStore.setState({
            promoCode: {
              universal: null,
              pickAndDrop: null,
              customOrder: null,
            },
          });

          router.replace({
            pathname: "/(tabs)",
          });
        }
      }
    },
  });

  const handleVerifyPaymentMutation = useMutation({
    mutationKey: ["verify-pick-and-drop-payment"],
    mutationFn: ({ orderId, amount }: { orderId: string; amount: number }) =>
      verifyPickAndDropPayment(orderId, amount),
    onSuccess: (data) => {
      console.log("Payment verification response: ", data);

      if (data?.success && data?.orderId && data?.createdAt) {
        addOrder(data.orderId, data.createdAt, "Pick-and-drop");

        useAuthStore.setState({
          promoCode: {
            ...useAuthStore.getState().promoCode,
            pickAndDrop: null,
          },
        });

        router.replace({
          pathname: "/(tabs)",
        });
      } else if (data?.success && data?.orderId && !data?.createdAt) {
        useAuthStore.setState({
          promoCode: {
            universal: null,
            pickAndDrop: null,
            customOrder: null,
          },
        });

        router.replace({
          pathname: "/(tabs)",
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
                total={cartBill?.grandTotal}
                onPress={() => billSheetRef.current?.expand()}
              />

              <View style={styles.separator} />

              <PromoCode
                deliveryMode="Pick and Drop"
                orderAmount={cartBill?.grandTotal as number}
                cartId={cartId}
              />
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

        <View
          style={{
            backgroundColor: "white",
            padding: 15,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              width: "98%",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 30,
            }}
          >
            <View>
              <Typo size={13} color={colors.NEUTRAL400}>
                Pay
              </Typo>

              <Pressable
                onPress={() => paymentSheetRef.current?.expand()}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: verticalScale(5),
                  position: "relative",
                }}
              >
                <Typo
                  fontFamily="Medium"
                  size={14}
                  color={colors.NEUTRAL900}
                  style={{
                    marginRight: 10,
                    minWidth: SCREEN_WIDTH * 0.3,
                  }}
                >
                  {selectedPaymentMode}
                </Typo>

                <View
                  style={{
                    borderWidth: 1,
                    borderRadius: radius._6,
                    paddingVertical: verticalScale(2),
                    paddingHorizontal: scale(1.5),
                  }}
                >
                  <CaretUp size={scale(15)} />
                </View>
              </Pressable>
            </View>

            <View style={{ flex: 1 }}>
              <Button
                title="Place Order"
                onPress={() => handleConfirmOrder.mutate()}
                isLoading={
                  handleConfirmOrder.isPending ||
                  handleVerifyPaymentMutation.isPending
                }
              />
            </View>
          </View>
        </View>
      </ScreenWrapper>

      <BottomSheet
        ref={billSheetRef}
        index={-1}
        snapPoints={billSnapPoints}
        enableDynamicSizing={true}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <BillSheet data={cartBill ?? null} />
      </BottomSheet>

      <BottomSheet
        ref={paymentSheetRef}
        index={-1}
        snapPoints={paymentSheetSnapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <PaymentOptionSheet
          onSelect={(value) => {
            setSelectedPaymentMode(value);
          }}
          value={selectedPaymentMode}
          onConfirm={() => paymentSheetRef.current?.close()}
          grandTotal={cartBill?.grandTotal || 0}
          disabled={["Cash-on-delivery"]}
        />
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
