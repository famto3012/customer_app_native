// import { StyleSheet, Text, View, Image } from "react-native";
// import React, { useEffect, useState } from "react";
// import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from "react-native-reanimated";
// import ScreenWrapper from "@/components/ScreenWrapper";
// import Header from "@/components/Header";
// import Typo from "@/components/Typo";
// import { colors } from "@/constants/theme";
// import Button from "@/components/Button";

// const images = [
//   { source: require("@/assets/images/location-permission.webp"), text: "Forgot something at home?"},
//   { source: require("@/assets/images/location-permission.webp"), text: "Delivery boys available anytime"},
//   { source: require("@/assets/images/location-permission.webp"), text: "Fast and safe delivery"},
// ];

// const subtexts = [
//   "Give us a pickup address",
//   "Our delivery agents are at your service",
//   "We ensure safe and fast delivery everytime",
// ];

// const PickAndDropHome = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const imageOffset = useSharedValue(-300);
//   const textOffset = useSharedValue(300);

//   useEffect(() => {
//     const cycleImages = () => {
//       const nextIndex = (currentIndex + 1) % images.length;

//       const isLeftToRight = currentIndex % 2 === 0;

//       imageOffset.value = withTiming(isLeftToRight ? -300 : 300, { duration: 500 }, () => {
//         runOnJS(setCurrentIndex)(nextIndex);
//         imageOffset.value = isLeftToRight ? 300 : -300;
//         imageOffset.value = withTiming(0, { duration: 500 });
//       });

//       textOffset.value = withTiming(isLeftToRight ? 300 : -300, { duration: 500 }, () => {
//         textOffset.value = isLeftToRight ? -300 : 300;
//         textOffset.value = withTiming(0, { duration: 500 });
//       });
//     };

//     const interval = setInterval(cycleImages, 3000);
//     return () => clearInterval(interval);
//   }, [currentIndex]);

//   const animatedImageStyle = useAnimatedStyle(() => ({
//     transform: [{ translateX: imageOffset.value }],
//   }));

//   const animatedTextStyle = useAnimatedStyle(() => ({
//     transform: [{ translateX: textOffset.value }],
//   }));

//   return (
//     <ScreenWrapper>
//       <Header title={"Pick & Drop"} />

//       <Animated.Image
//         source={images[currentIndex].source}
//         style={[styles.image, animatedImageStyle]}
//         resizeMode="contain"
//       />

//       <Animated.View style={[styles.textContainer, animatedTextStyle]}>
//         <Typo size={14} fontWeight={800} color={colors.BLACK}>
//           {images[currentIndex].text}
//         </Typo>
//         <Typo size={14} color={colors.BLACK}>
//           {subtexts[currentIndex]}
//         </Typo>
//       </Animated.View>

//       <View style={styles.reminderContainer}>
// <Typo size={14} fontWeight={700} color={colors.BLACK}>
//   Things to remember
// </Typo>

//         <View style={styles.bulletContainer}>
//           <View style={styles.bulletPoint}>
//             <Text style={styles.bullet}>•</Text>
//             <Typo size={14} color={colors.BLACK}>
//               Sending high-value or fragile products should {"\n"} be avoided.
//             </Typo>
//           </View>
//           <View style={styles.bulletPoint}>
//             <Text style={styles.bullet}>•</Text>
//             <Typo size={14} color={colors.BLACK}>
//               Items should fit inside the backpack.
//             </Typo>
//           </View>
//           <View style={styles.bulletPoint}>
//             <Text style={styles.bullet}>•</Text>
// <Typo size={14} color={colors.BLACK}>
//   Transporting illegal goods is prohibited.
// </Typo>
//           </View>
//         </View>
//       </View>

// <Button
//   title="Place your order"
//   onPress={() => console.log("Button pressed")}
//   style={styles.button}
// />
//     </ScreenWrapper>
//   );
// };

// export default PickAndDropHome;

// const styles = StyleSheet.create({
//   image: {
//     marginTop: 30,
//     width: "90%",
//     height: "45%",
//     borderRadius: 10,
//     alignSelf: "center",
//   },
// textContainer: {
//   alignItems: "center",
//   marginTop: 20,
// },
//   reminderContainer: {
//     marginTop: 50,
//     padding: 20,
//     backgroundColor: "#f8f8f8",
//     borderRadius: 20,
//     width: "90%",
//     alignSelf: "center",
//   },
//   bulletContainer: {
//     marginTop: 20,
//   },
//   bulletPoint: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 5,
//   },
//   bullet: {
//     fontSize: 14,
//     marginRight: 8,
//     color: colors.BLACK,
//   },
// button: {
//   marginTop: 40,
//   alignSelf: "center",
//   width: "90%",
// },
// });



import {
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
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
import { getCustomerCart, getMerchantDeliveryOption } from "@/service/universal";
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
    queryFn: () => getMerchantDeliveryOption(cart?.merchantId?.toString() ?? ""),
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
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
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
            <SchedulePicker onPress={() => scheduleSheetRef.current?.expand()} />
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
