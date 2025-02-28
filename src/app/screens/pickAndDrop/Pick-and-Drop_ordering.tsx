import { ScrollView, StyleSheet, View } from "react-native";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import SchedulePicker from "@/components/common/SchedulePicker";
import { verticalScale } from "@/utils/styling";
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
import {
  getCustomerCart,
  getMerchantDeliveryOption,
} from "@/service/universal";
import { useQuery } from "@tanstack/react-query";
import { CartProps } from "@/types";
import { useAuthStore } from "@/store/store";
import Typo from "@/components/Typo";
import { colors } from "@/constants/theme";

const TAB_WIDTH = SCREEN_WIDTH / 2 - 20;

interface formDataProps {
  deliveryMode: string;
  businessCategoryId: string;
  deliveryAddressType: string;
  ifScheduled?: {
    startDate: string;
    endDate: string;
    time: string;
  } | null;
  isSuperMarketOrder: boolean;
}

const PickDropScreen = () => {
  const [deliveryMode, setDeliveryMode] = useState<string>("Home Delivery");
  const [cart, setCart] = useState<CartProps | null>(null);
  const { selectedBusiness } = useAuthStore.getState();
  const scheduleSheetRef = useRef<BottomSheet>(null);

  const [formData, setFormData] = useState<formDataProps>({
    deliveryMode,
    businessCategoryId: selectedBusiness?.toString() ?? "",
    deliveryAddressType: "home",
    ifScheduled: null,
    isSuperMarketOrder: false,
  });

  const indicatorPosition = useSharedValue(0);
  const variantSheetSnapPoints = useMemo(() => ["80%"], []);

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
    setCart(cartData ?? null);
  }, [cartData]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      businessCategoryId: selectedBusiness?.toString() ?? "",
    }));
  }, [selectedBusiness]);

  useEffect(() => {
    indicatorPosition.value = withTiming(
      deliveryMode === "Home Delivery" ? 0 : TAB_WIDTH,
      { duration: 300 }
    );
  }, [deliveryMode]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  return (
    <GestureHandlerRootView>
      <ScreenWrapper>
        <Header title="Pick & Drop" />
        <ScrollView
          contentContainerStyle={{
            paddingBottom: verticalScale(120),
            paddingTop: verticalScale(20),
          }}
          showsVerticalScrollIndicator={false}
        >
          {deliveryOption && (
            <SchedulePicker
              onPress={() => scheduleSheetRef.current?.expand()}
            />
          )}

          {/* Pickup and Address in One Row */}
          <View style={styles.pickupRow}>
            <Typo size={14} color={colors.BLACK} fontWeight={700}>
              Pickup
            </Typo>
            <Typo size={14} color={colors.BLACK} style={styles.pickupText}>
              (Select a pickup address first)
            </Typo>
          </View>
        </ScrollView>
      </ScreenWrapper>

      <BottomSheet
        ref={scheduleSheetRef}
        index={-1}
        snapPoints={variantSheetSnapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <ScheduleSheet />
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default PickDropScreen;

const styles = StyleSheet.create({
  pickupRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 10,
  },
  pickupText: {
    marginLeft: 5, // Adjust spacing between "Pickup" and the text
    opacity: 0.5,
  },
});
