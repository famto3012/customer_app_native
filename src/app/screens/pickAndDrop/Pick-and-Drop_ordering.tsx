
import {
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import SchedulePicker from "@/components/common/SchedulePicker";
import { scale, verticalScale } from "@/utils/styling";
import HomeDelivery from "@/components/universal/HomeDelivery";
import TakeAway from "@/components/universal/TakeAway";
import Animated, {
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  SCREEN_WIDTH,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ScheduleSheet from "@/components/BottomSheets/ScheduleSheet";
import { getCustomerCart, getMerchantDeliveryOption } from "@/service/universal";
import { useQuery } from "@tanstack/react-query";
import { CartProps } from "@/types";
import { useAuthStore } from "@/store/store";
import Typo from "@/components/Typo";
import { colors } from "@/constants/theme";
import Address from "@/components/common/Address";
import Instructions from "@/components/common/Instructions";
import Button from "@/components/Button";

const TAB_WIDTH = SCREEN_WIDTH / 2 - 20;

interface FormDataProps {
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
  const selectedBusiness = useAuthStore((state) => state.selectedBusiness);
  const scheduleSheetRef = useRef<BottomSheet>(null);

  // Define handler functions
  const onAgentVoice = (data: string) => {
    console.log("Voice recorded:", data);
  };

  const onAgentInstruction = (data: string) => {
    console.log("Instruction:", data);
  };

  const onAddressSelect = (type: string, otherId?: string) => {
    setFormData((prev) => ({
      ...prev,
      deliveryAddressType: type,
    }));
  };

  const [formData, setFormData] = useState<FormDataProps>({
    deliveryMode,
    businessCategoryId: selectedBusiness?.toString() ?? "",
    deliveryAddressType: "home",
    ifScheduled: null,
    isSuperMarketOrder: false,
  });

  const indicatorPosition = useSharedValue(0);
  const variantSheetSnapPoints = useMemo(() => ["80%"], []);

  // Fetch cart data
  const { data: cartData } = useQuery({
    queryKey: ["customer-cart"],
    queryFn: getCustomerCart,
  });

  // Fetch merchant delivery options
  const { data: deliveryOption } = useQuery({
    queryKey: ["merchant-delivery-option", cart?.merchantId],
    queryFn: () => getMerchantDeliveryOption(cart?.merchantId?.toString() ?? ""),
    enabled: !!cart?.merchantId,
  });

  // Update cart state only when cartData changes
  useEffect(() => {
    if (cartData && cartData !== cart) {
      setCart(cartData);
    }
  }, [cartData, cart]);

  // Update business category ID if selectedBusiness changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      businessCategoryId: selectedBusiness?.toString() ?? "",
    }));
  }, [selectedBusiness]);

  // Sync deliveryMode with formData
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      deliveryMode,
    }));
  }, [deliveryMode]);

  // Animate tab indicator position
  useEffect(() => {
    indicatorPosition.value = withTiming(
      deliveryMode === "Home Delivery" ? 0 : TAB_WIDTH,
      { duration: 300 }
    );
  }, [deliveryMode]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
    ),
    []
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
            <SchedulePicker onPress={() => scheduleSheetRef.current?.expand()} />
          )}

          {/* Pickup and Address in One Row */}
          <View style={styles.pickupRow}>
            <Typo size={14} color={colors.BLACK} fontWeight={700}>
              Pickup
            </Typo>
          </View>

          <Address
            onSelect={(type, otherId) => {
              onAddressSelect(type, otherId);
            }}
          />

          <Instructions
            placeholder="Instructions (if any)"
            onRecordComplete={onAgentVoice}
            onChangeText={onAgentInstruction}
          />

          <View style={styles.pickupRow}>
            <Typo size={14} color={colors.BLACK} fontWeight={700}>
              Drop
            </Typo>
          </View>

          <Address
            onSelect={(type, otherId) => {
              onAddressSelect(type, otherId);
            }}
          />
        </ScrollView>
        <View style={styles.confirmContainer}>
          <Button
            title="Confirm Order detail"
            onPress={() => "Button Pressed"}
          />
        </View>
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
    marginBottom: 25,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 10,
  },
  pickupText: {
    marginLeft: 5,
    opacity: 0.5,
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
});
