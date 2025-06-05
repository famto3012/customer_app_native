import PaymentOptionSheet from "@/components/BottomSheets/common/PaymentOptionSheet";
import Header from "@/components/Header";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import AddTip from "@/components/common/AddTip";
import AppliedPromoCode from "@/components/common/AppliedPromoCode";
import BillDetail from "@/components/common/BillDetail";
import PromoCode from "@/components/common/Promocode";
import { commonStyles } from "@/constants/commonStyles";
import { colors, radius } from "@/constants/theme";
import { useData } from "@/context/DataContext";
import { useShowAlert } from "@/hooks/useShowAlert";
import { clearCart } from "@/localDB/controller/cartController";
import { addOrder } from "@/localDB/controller/orderController";
import {
  getCartBill,
  getMerchantAvailability,
  placeUniversalOrder,
  verifyPayment,
} from "@/service/universal";
import { updateTip } from "@/service/userService";
import { useAuthStore } from "@/store/store";
import { DeliveryOptionType, MerchantDataProps } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  SCREEN_WIDTH,
} from "@gorhom/bottom-sheet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { CaretUp } from "phosphor-react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const Bill = () => {
  const [selectedPaymentMode, setSelectedPaymentMode] =
    useState<string>("Online-payment");
  const [promoCodeUsed, setPromoCodeUsed] = useState<string>("");

  const paymentSheetRef = useRef<BottomSheet>(null);

  const paymentSheetSnapPoints = useMemo(() => ["40%"], []);

  const {
    cartId,
    merchantId,
    deliveryMode,
    deliveryOption,
  }: {
    cartId: string;
    merchantId: string;
    deliveryMode: string;
    deliveryOption: DeliveryOptionType;
  } = useLocalSearchParams();
  const promoCode = useAuthStore((state) => state.promoCode.universal);
  const { setProductCounts } = useData();

  // const [merchantId, setMerchantId] = useState("");

  const queryClient = useQueryClient();
  const { showAlert } = useShowAlert();

  useFocusEffect(
    useCallback(() => {
      if (promoCode || promoCodeUsed) {
        useAuthStore.setState({
          promoCode: { customOrder: "", pickAndDrop: "", universal: "" },
        });
        setPromoCodeUsed("");
      }

      if (data?.billdetail?.addedTip) {
        handleAddTipMutation.mutate(0);
      }

      return () => null;
    }, [])
  );

  useEffect(() => {
    if (promoCode?.toString()) {
      setPromoCodeUsed(promoCode || "");
    }
  }, [promoCode]);

  const handleAddTipMutation = useMutation({
    mutationKey: ["order-tip"],
    mutationFn: (tip: number) => updateTip(cartId, deliveryMode, tip),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["universal-bill"] });
    },
  });

  const { data, isLoading: billLoading } = useQuery({
    queryKey: ["universal-bill"],
    queryFn: () => getCartBill(cartId.toString()),
  });

  const { data: merchantAvailabilityData } = useQuery<MerchantDataProps>({
    queryKey: ["merchant-availability", merchantId],
    queryFn: () => getMerchantAvailability(merchantId),
  });

  // useEffect(() => {
  //   if (data?.merchantId) {
  //     setMerchantId(data?.merchantId);
  //   }
  // }, [data]);

  const placeOrderMutation = useMutation({
    mutationKey: ["place-universal-order"],
    mutationFn: () => placeUniversalOrder(selectedPaymentMode),
    onSuccess: async (data) => {
      if (selectedPaymentMode === "Online-payment") {
        const { orderId, amount } = data;

        if (orderId) {
          verifyPaymentMutation.mutate({
            orderId,
            amount: amount ?? 0,
          });
        }
      } else {
        if (data?.success && data?.orderId) {
          await addOrder(
            data?.orderId,
            new Date().toISOString(),
            "Universal",
            data?.merchantName as string
          );

          router.replace({ pathname: "/(tabs)" });

          clearCart();

          setProductCounts({});

          useAuthStore.setState({
            cart: {
              showCart: false,
              merchant: "",
              merchantId: "",
              cartId: "",
            },
            promoCode: {
              universal: null,
              pickAndDrop: null,
              customOrder: null,
            },
          });
        } else if (data?.success && !data?.createdAt) {
          router.replace({ pathname: "/(tabs)" });

          clearCart();

          setProductCounts({});

          useAuthStore.setState({
            cart: {
              showCart: false,
              merchant: "",
              merchantId: "",
              cartId: "",
            },
            promoCode: {
              universal: null,
              pickAndDrop: null,
              customOrder: null,
            },
          });
        }
      }
    },
  });

  const verifyPaymentMutation = useMutation({
    mutationKey: ["verify-universal-payment"],
    mutationFn: ({ orderId, amount }: { orderId: string; amount: number }) =>
      verifyPayment(orderId, amount),
    onSuccess: async (data) => {
      if (data?.success && data?.orderId && data?.createdAt) {
        await addOrder(
          data?.orderId,
          data?.createdAt,
          "Universal",
          data?.merchantName
        );

        router.replace({ pathname: "/(tabs)" });

        clearCart();

        setProductCounts({});

        useAuthStore.setState({
          cart: {
            showCart: false,
            merchant: "",
            merchantId: "",
            cartId: "",
          },
        });
      } else if (data?.success && !data?.createdAt) {
        router.replace({ pathname: "/(tabs)" });

        clearCart();

        setProductCounts({});

        useAuthStore.setState({
          cart: {
            showCart: false,
            merchant: "",
            merchantId: "",
            cartId: "",
          },
          promoCode: {
            universal: null,
            pickAndDrop: null,
            customOrder: null,
          },
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
    <ScreenWrapper>
      <ScrollView>
        <Header title="Checkout" />

        <AddTip
          previousTip={data?.billdetail?.addedTip ?? 0}
          onTipSelect={(data: number) => handleAddTipMutation.mutate(data)}
        />

        <View style={styles.promoContainer}>
          <PromoCode
            deliveryMode={deliveryMode?.toString()}
            merchantId={merchantId?.toString()}
            orderAmount={
              data?.billDetail?.discountedGrandTotal
                ? data?.billDetail?.discountedGrandTotal
                : data?.billDetail?.originalGrandTotal
            }
            cartId={cartId}
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

          <BillDetail data={data?.billDetail} isLoading={billLoading} />
        </View>
      </ScrollView>

      <View
        style={{
          backgroundColor: colors.WHITE,
          padding: verticalScale(15),
          marginBottom: Platform.OS === "ios" ? verticalScale(15) : 0,
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
            onPress={() => {
              // console.log("merchantAvailabilityData", merchantAvailabilityData);
              if (
                merchantAvailabilityData?.type === "Specific-time" &&
                merchantAvailabilityData?.todayAvailability
              ) {
                const now = new Date();
                const utc = now.getTime() + now.getTimezoneOffset() * 60000;
                const nowIST = new Date(utc + 5.5 * 60 * 60 * 1000);

                const [endHour, endMinute] =
                  merchantAvailabilityData.todayAvailability.endTime
                    .split(":")
                    .map(Number);

                const endTime = new Date(nowIST);
                endTime.setHours(endHour, endMinute, 0, 0);
                // console.log("TIme", nowIST, endTime);

                if (nowIST > endTime) {
                  const [startHour, startMinute] =
                    merchantAvailabilityData.todayAvailability.startTime
                      .split(":")
                      .map(Number);

                  const startFormatted = `${startHour
                    .toString()
                    .padStart(2, "0")}:${startMinute
                    .toString()
                    .padStart(2, "0")}`;

                  showAlert(
                    `The shop is closed for today. It will be open again tomorrow at ${merchantAvailabilityData?.nextDay?.startTime}.`,
                    "Error"
                  );
                  return;
                }
              }

              placeOrderMutation.mutate();
            }}
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
            data?.billDetail?.discountedGrandTotal
              ? data.billDetail?.discountedGrandTotal
              : data?.billDetail?.originalGrandTotal
          }
          deliveryOption={deliveryOption}
        />
      </BottomSheet>
    </ScreenWrapper>
  );
};

export default Bill;

const styles = StyleSheet.create({
  promoContainer: {
    backgroundColor: colors.WHITE,
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
