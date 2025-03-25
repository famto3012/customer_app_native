import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import SchedulePicker from "@/components/common/SchedulePicker";
import Typo from "@/components/Typo";
import { scale, verticalScale } from "@/utils/styling";
import { colors, radius } from "@/constants/theme";
import HomeDelivery from "@/components/universal/HomeDelivery";
import TakeAway from "@/components/universal/TakeAway";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  SCREEN_WIDTH,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ScheduleSheet from "@/components/BottomSheets/ScheduleSheet";
import { router } from "expo-router";
import {
  confirmOrder,
  getCustomerCart,
  getMerchantDeliveryOption,
} from "@/service/universal";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CartProps } from "@/types";
import { useAuthStore } from "@/store/store";
import Button from "@/components/Button";
import { commonStyles } from "@/constants/commonStyles";
import { forceAudioCleanup, playOrStopSound } from "@/utils/helpers";
import { useAudioCleanup } from "@/hooks/useAudio";
import { useShowAlert } from "@/hooks/useShowAlert";

const TAB_WIDTH = (SCREEN_WIDTH - scale(40)) / 2;

interface formDataProps {
  deliveryMode: string;
  businessCategoryId: string;
  deliveryAddressType: string;
  deliveryAddressOtherAddressId?: string;
  newDeliveryAddress?: {
    type: string;
    fullName: string;
    phoneNumber: string;
    flat: string;
    area: string;
    landmark?: string;
    coordinates: [latitude: number, longitude: number] | null;
  };
  instructionToMerchant?: string;
  instructionToDeliveryAgent?: string;
  voiceInstructionToMerchant: any;
  voiceInstructionToAgent: any;
  ifScheduled?: {
    startDate: string;
    endDate: string;
    time: string;
  } | null;
  isSuperMarketOrder: boolean;
}

const Checkout = () => {
  const [deliveryMode, setDeliveryMode] = useState<string>("Home Delivery");
  const [cart, setCart] = useState<CartProps | null>(null);
  const [showScheduleOption, setShowScheduleOption] = useState<boolean>(false);
  const [schedule, setSchedule] = useState({
    startDate: "",
    endDate: "",
    time: "",
  });

  const [isPlaying, setIsPlaying] = useState(false);

  const { selectedBusiness, userAddress } = useAuthStore.getState();

  const [formData, setFormData] = useState<formDataProps>({
    deliveryMode,
    businessCategoryId: selectedBusiness?.toString() ?? "",
    deliveryAddressType: "",
    deliveryAddressOtherAddressId: "",
    newDeliveryAddress: {
      type: "",
      fullName: "",
      phoneNumber: "",
      flat: "",
      area: "",
      landmark: "",
      coordinates: null,
    },
    instructionToMerchant: "",
    instructionToDeliveryAgent: "",
    voiceInstructionToMerchant: null,
    voiceInstructionToAgent: null,
    ifScheduled: {
      startDate: "",
      endDate: "",
      time: "",
    },
    isSuperMarketOrder: false,
  });

  const indicatorPosition = useSharedValue(0);

  const scheduleSheetRef = useRef<BottomSheet>(null);

  const scheduleSheetSnapPoints = useMemo(() => ["85%"], []);

  useAudioCleanup();

  const { showAlert } = useShowAlert();

  const { data: cartData } = useQuery({
    queryKey: ["customer-cart"],
    queryFn: () => getCustomerCart(),
  });

  const { data: deliveryOption } = useQuery({
    queryKey: ["merchant-delivery-option", cart?.merchantId],
    queryFn: () =>
      getMerchantDeliveryOption(cart?.merchantId?.toString() ?? ""),
    enabled: !!cart?.merchantId,
  });

  useEffect(() => {
    setFormData({
      ...formData,
      businessCategoryId: selectedBusiness?.toString() ?? "",
    });
  }, [selectedBusiness]);

  useEffect(() => {
    setFormData({
      ...formData,
      deliveryAddressType: userAddress.type,
      deliveryAddressOtherAddressId: userAddress.otherId,
    });
  }, [userAddress]);

  useEffect(() => {
    cartData && setCart(cartData);
  }, [cartData]);

  useEffect(() => {
    setShowScheduleOption(!!deliveryOption);
  }, [deliveryOption]);

  useEffect(() => {
    indicatorPosition.value = withTiming(
      deliveryMode === "Home Delivery" ? 0 : TAB_WIDTH,
      {
        duration: 300,
      }
    );
  }, [deliveryMode]);

  const toggleDeliveryMode = (value: string) => {
    setDeliveryMode(value);
    setFormData({ ...formData, deliveryMode: value });
  };

  const animatedIndicator = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorPosition.value }],
  }));

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

  const handleSchedule = (startDate: string, endDate: string, time: string) => {
    setFormData({
      ...formData,
      ifScheduled: {
        startDate,
        endDate,
        time,
      },
    });

    setSchedule({
      startDate,
      endDate,
      time,
    });

    scheduleSheetRef.current?.close();
  };

  const clearSchedule = () => {
    setFormData({
      ...formData,
      ifScheduled: {
        startDate: "",
        endDate: "",
        time: "",
      },
    });

    setSchedule({
      startDate: "",
      endDate: "",
      time: "",
    });
  };

  const handleConfirmOrderMutation = useMutation({
    mutationKey: ["confirm-order"],
    mutationFn: (data: FormData) => confirmOrder(data),
    onSuccess: (data) => {
      router.push({
        pathname: "/screens/universal/bill",
        params: {
          cartId: data.cartId,
          merchantId: data.merchantId,
          deliveryMode,
        },
      });
    },
  });

  const handleConfirm = (data: formDataProps) => {
    if (!data.deliveryAddressType) {
      showAlert("Please select a delivery address");
      return;
    }

    const formDataObject = new FormData();

    function appendFormData(value: any, key: string) {
      if (value instanceof File) {
        formDataObject.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          appendFormData(item, `${key}[${index}]`);
        });
      } else if (typeof value === "object" && value !== null) {
        Object.entries(value).forEach(([nestedKey, nestedValue]) => {
          appendFormData(nestedValue, key ? `${key}[${nestedKey}]` : nestedKey);
        });
      } else if (value !== undefined && value !== null) {
        formDataObject.append(key, value);
      }
    }

    Object.entries(data).forEach(([key, value]) => {
      appendFormData(value, key);
    });

    handleConfirmOrderMutation.mutate(formDataObject);
  };

  return (
    <GestureHandlerRootView>
      <ScreenWrapper>
        <Header title="Checkout" />
        <ScrollView
          contentContainerStyle={{
            paddingBottom: verticalScale(120),
            paddingTop: verticalScale(20),
          }}
          showsVerticalScrollIndicator={false}
        >
          {showScheduleOption && (
            <SchedulePicker
              onPress={() => scheduleSheetRef.current?.expand()}
              value={schedule}
              onClearSchedule={clearSchedule}
            />
          )}

          {/* Delivery Mode Tabs */}
          <View style={styles.tabContainer}>
            <View style={styles.tab}>
              {/* Home Delivery Tab */}
              <Pressable
                onPress={() => toggleDeliveryMode("Home Delivery")}
                style={styles.tabOption}
              >
                <Typo
                  size={14}
                  color={
                    deliveryMode === "Home Delivery"
                      ? colors.NEUTRAL900
                      : colors.NEUTRAL400
                  }
                  fontFamily="SemiBold"
                >
                  Delivery
                </Typo>
              </Pressable>

              {/* Take Away Tab */}
              <Pressable
                onPress={() => toggleDeliveryMode("Take Away")}
                style={styles.tabOption}
              >
                <Typo
                  size={14}
                  color={
                    deliveryMode === "Take Away"
                      ? colors.NEUTRAL900
                      : colors.NEUTRAL400
                  }
                  fontFamily="SemiBold"
                >
                  Take Away
                </Typo>
              </Pressable>

              {/* Sliding Bottom Border */}
              <Animated.View style={[styles.indicator, animatedIndicator]} />
            </View>
          </View>

          {/* Content Based on Selection */}
          {deliveryMode === "Home Delivery" ? (
            <HomeDelivery
              items={cart?.items ? cart.items : []}
              onAgentVoice={(data) =>
                setFormData({ ...formData, voiceInstructionToAgent: data })
              }
              onAgentInstruction={(data) => {
                setFormData({ ...formData, instructionToDeliveryAgent: data });
              }}
              onMerchantVoice={(data) =>
                setFormData({ ...formData, voiceInstructionToMerchant: data })
              }
              onMerchantInstruction={(data) =>
                setFormData({ ...formData, instructionToMerchant: data })
              }
              onAddressSelect={(type, otherId) => {
                setFormData({
                  ...formData,
                  deliveryAddressType: type,
                  deliveryAddressOtherAddressId: otherId,
                });
              }}
            />
          ) : (
            <TakeAway
              items={cart?.items ? cart.items : []}
              merchantId={cart?.merchantId || ""}
              onMerchantVoice={(data) =>
                setFormData({ ...formData, voiceInstructionToMerchant: data })
              }
              onMerchantInstruction={(data) =>
                setFormData({ ...formData, instructionToMerchant: data })
              }
            />
          )}
        </ScrollView>

        <View style={styles.confirmContainer}>
          <Button
            title="Confirm Order detail"
            onPress={() => handleConfirm(formData)}
            isLoading={handleConfirmOrderMutation.isPending}
          />
        </View>
      </ScreenWrapper>

      <BottomSheet
        ref={scheduleSheetRef}
        index={-1}
        snapPoints={scheduleSheetSnapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        onClose={() => forceAudioCleanup(setIsPlaying)}
      >
        <ScheduleSheet
          onPress={(startDate: string, endDate: string, time: string) => {
            forceAudioCleanup(setIsPlaying);
            scheduleSheetRef?.current?.close();
            handleSchedule(startDate, endDate, time);
          }}
          playSound={() =>
            playOrStopSound(
              "https://firebasestorage.googleapis.com/v0/b/famto-aa73e.appspot.com/o/voices%2FScheduled%20Order.mp3?alt=media&token=da59e122-08f8-4964-8b6f-bfebc8c32fbe",
              isPlaying,
              setIsPlaying
            )
          }
          isPlaying={isPlaying}
        />
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default Checkout;

const styles = StyleSheet.create({
  tabContainer: {
    marginHorizontal: scale(20),
    marginTop: verticalScale(10),
  },
  tab: {
    flexDirection: "row",
    position: "relative",
    overflow: "hidden",
  },
  tabOption: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: verticalScale(10),
    width: TAB_WIDTH,
  },
  indicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: TAB_WIDTH,
    height: verticalScale(2),
    backgroundColor: colors.NEUTRAL900,
  },
  confirmContainer: {
    position: "absolute",
    bottom: 0,
    width: SCREEN_WIDTH,
    backgroundColor: colors.WHITE,
    paddingVertical: verticalScale(24),
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: scale(20),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
  confirmBtn: {
    backgroundColor: colors.PRIMARY,
    width: "100%",
    height: verticalScale(45),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radius._10,
  },
});
