import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import AddTip from "@/components/common/AddTip";
import { scale, verticalScale } from "@/utils/styling";
import Typo from "@/components/Typo";
import { colors, radius } from "@/constants/theme";
import PromoCode from "@/components/common/Promocode";
import BillDetail from "@/components/common/BillDetail";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  SCREEN_WIDTH,
} from "@gorhom/bottom-sheet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addUniversalTip,
  getCartBill,
  placeUniversalOrder,
  verifyPayment,
} from "@/service/universal";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CaretUp } from "phosphor-react-native";
import PaymentOptionSheet from "@/components/BottomSheets/common/PaymentOptionSheet";
import { useAuthStore } from "@/store/store";
import { commonStyles } from "@/constants/commonStyles";
import AppliedPromoCode from "@/components/common/AppliedPromoCode";
import { addOrder } from "@/localDB/controller/orderController";

const Bill = () => {
  const [selectedPaymentMode, setSelectedPaymentMode] =
    useState<string>("Online-payment");
  const [promoCodeUsed, setPromoCodeUsed] = useState<string>("");

  const paymentSheetRef = useRef<BottomSheet>(null);

  const paymentSheetSnapPoints = useMemo(() => ["40%"], []);

  const { cartId, merchantId, deliveryMode } = useLocalSearchParams();
  const { promoCode } = useAuthStore.getState();

  const queryClient = useQueryClient();

  useEffect(() => {
    if (promoCode?.universal?.toString()) {
      setPromoCodeUsed(promoCode?.universal?.toString() || "");
    }
  }, [promoCode?.universal]);

  const handleAddTipMutation = useMutation({
    mutationKey: ["universal-tip"],
    mutationFn: (tip: number) => addUniversalTip(tip),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["universal-bill"] });
    },
  });

  const { data, isLoading: billLoading } = useQuery({
    queryKey: ["universal-bill"],
    queryFn: () => getCartBill(cartId.toString()),
  });

  const placeOrderMutation = useMutation({
    mutationKey: ["place-universal-order"],
    mutationFn: () => placeUniversalOrder(selectedPaymentMode),
    onSuccess: (data) => {
      if (selectedPaymentMode === "Online-payment") {
        const { orderId, amount } = data;

        if (orderId) {
          verifyPaymentMutation.mutate({
            orderId,
            amount,
          });
        }
      } else {
        if (data?.success && data?.orderId) {
          addOrder(data?.orderId, data?.createdAt, data?.merchantName);

          useAuthStore.setState({
            cart: {
              showCart: false,
              merchant: "",
              cartId: "",
            },
          });

          router.replace({ pathname: "/(tabs)" });
        }
      }
    },
  });

  const verifyPaymentMutation = useMutation({
    mutationKey: ["verify-universal-payment"],
    mutationFn: ({ orderId, amount }: { orderId: string; amount: number }) =>
      verifyPayment(orderId, amount),
    onSuccess: (data) => {
      if (data) {
        addOrder(data?.orderId, data?.createdAt, data?.merchantName);

        useAuthStore.setState({
          cart: {
            showCart: false,
            merchant: "",
            cartId: "",
          },
        });
        router.replace({ pathname: "/(tabs)" });
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
    <ScreenWrapper>
      <ScrollView>
        <Header title="Checkout" />

        <AddTip
          previousTip={data?.addedTip ?? 0}
          onTipSelect={(data: number) => handleAddTipMutation.mutate(data)}
        />

        <View style={styles.promoContainer}>
          <PromoCode
            deliveryMode={deliveryMode?.toString()}
            merchantId={merchantId?.toString()}
            orderAmount={
              data?.discountedGrandTotal
                ? data.discountedGrandTotal
                : data?.originalGrandTotal
            }
          />
        </View>

        {promoCodeUsed && (
          <AppliedPromoCode
            cartId={cartId.toString()}
            deliveryMode={deliveryMode.toString()}
            onRemove={() => setPromoCodeUsed("")}
            promoCode={promoCodeUsed}
          />
        )}

        <View style={styles.billContainer}>
          <Typo fontFamily="Medium" size={14} color={colors.NEUTRAL900}>
            Bill Summary
          </Typo>

          <BillDetail data={data} isLoading={billLoading} />
        </View>
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

          <TouchableOpacity
            onPress={() => placeOrderMutation.mutate()}
            style={{
              backgroundColor: colors.PRIMARY,
              flex: 1,
              paddingVertical: verticalScale(10),
              borderRadius: radius._30,
            }}
          >
            {placeOrderMutation.isPending ? (
              <ActivityIndicator size="small" color={colors.WHITE} />
            ) : (
              <Typo size={14} style={{ textAlign: "center", color: "white" }}>
                Place Order
              </Typo>
            )}
          </TouchableOpacity>
        </View>
      </View>

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
          grandTotal={
            data?.discountedGrandTotal
              ? data.discountedGrandTotal
              : data?.originalGrandTotal
          }
        />
      </BottomSheet>
    </ScreenWrapper>
  );
};

export default Bill;

const styles = StyleSheet.create({
  promoContainer: {
    marginTop: verticalScale(30),
    borderRadius: radius._10,
    marginHorizontal: scale(20),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,
    elevation: 15,
  },
  billContainer: {
    marginHorizontal: scale(20),
    marginTop: verticalScale(20),
  },
});
