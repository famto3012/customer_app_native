import {
  KeyboardAvoidingView,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
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

const TAB_WIDTH = scale((SCREEN_WIDTH - 40) / 2);

const Checkout = () => {
  const [deliveryMode, setDeliveryMode] = useState<string>("Home Delivery");

  const indicatorPosition = useSharedValue(0);

  const scheduleSheetRef = useRef<BottomSheet>(null);

  const variantSheetSnapPoints = useMemo(() => ["80%"], []);

  useEffect(() => {
    indicatorPosition.value = withTiming(
      deliveryMode === "Home Delivery" ? 0 : TAB_WIDTH,
      {
        duration: 300,
      }
    );
  }, [deliveryMode]);

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
        style={[props.style, styles.backdrop]}
        // onPress={handleClosePress}
      />
    ),
    []
  );

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
          <SchedulePicker
            visible={true}
            onPress={() => scheduleSheetRef.current?.expand()}
          />

          {/* Delivery Mode Tabs */}
          <View style={styles.tabContainer}>
            <View style={styles.tab}>
              {/* Home Delivery Tab */}
              <Pressable
                onPress={() => setDeliveryMode("Home Delivery")}
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
                onPress={() => setDeliveryMode("Take Away")}
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
          {deliveryMode === "Home Delivery" ? <HomeDelivery /> : <TakeAway />}
        </ScrollView>

        <View style={styles.confirmContainer}>
          <TouchableOpacity
            onPress={() => router.push("/screens/universal/bill")}
            style={styles.confirmBtn}
          >
            <Typo size={14} color={colors.WHITE}>
              Confirm Order detail
            </Typo>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>

      <BottomSheet
        ref={scheduleSheetRef}
        index={-1}
        snapPoints={variantSheetSnapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <ScheduleSheet />
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
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 1)",
  },
});
