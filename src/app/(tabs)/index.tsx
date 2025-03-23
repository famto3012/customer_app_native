import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  ImageBackground,
  Modal,
} from "react-native";
import HomeHeader from "@/components/HomeHeader";
import ScreenWrapper from "@/components/ScreenWrapper";
import SearchView from "@/components/SearchView";
import { colors, radius } from "@/constants/theme";
import {
  scale,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  verticalScale,
} from "@/utils/styling";
import TopService from "@/components/TopService";
import BusinessCategories from "@/components/universal/BusinessCategories";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { requestLocationPermission } from "@/utils/helpers";
import FloatingPreparingOrder from "@/components/universal/FloatingPreparingOrder";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getOngoingOrder } from "@/service/orderService";
import { useFocusEffect } from "@react-navigation/native";
import { useAuthStore } from "@/store/store";
import { router } from "expo-router";
import { getAppBanner } from "@/service/userService";
import { interpolate } from "react-native-reanimated";
import Carousel, { TAnimationStyle } from "react-native-reanimated-carousel";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { commonStyles } from "@/constants/commonStyles";
import TemporaryOrderSheet from "@/components/BottomSheets/universal/TemporaryOrderSheet";
import FastImage from "react-native-fast-image";

const Home = () => {
  const temporaryOrderSheet = useRef<BottomSheet>(null);

  const temporarySnapPoints = useMemo(() => ["60%"], []);

  const { token, outsideGeofence } = useAuthStore.getState();

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    if (outsideGeofence) {
      router.push("/(modals)/SelectAddress");
    }
  }, [outsideGeofence]);

  const queryClient = useQueryClient();

  const { data: ongoingOrder, refetch: refetchOngoingOrder } = useQuery({
    queryKey: ["ongoingOrder"],
    queryFn: () => getOngoingOrder(),
    enabled: !!token,
  });

  const { data: bannerData } = useQuery({
    queryKey: ["app-banner"],
    queryFn: () => getAppBanner(),
  });

  useFocusEffect(
    useCallback(() => {
      queryClient.invalidateQueries({ queryKey: ["ongoingOrder"] });
    }, [queryClient])
  );

  const animationStyle: TAnimationStyle = useCallback((value: number) => {
    "worklet";

    const zIndex = Math.round(interpolate(value, [-1, 0, 1], [10, 20, 30])); // Ensure whole number
    const scale = interpolate(value, [-1, 0, 1], [1.25, 1, 0.25]); // No rounding needed
    const opacity = interpolate(value, [-0.75, 0, 1], [0, 1, 0]); // No rounding needed

    return {
      transform: [{ scale: Number(scale) }], // Ensuring it's a number
      zIndex: zIndex, // Already rounded
      opacity: Number(opacity), // Ensuring it's a number
    };
  }, []);

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
    <View style={{ flex: 1, backgroundColor: colors.WHITE }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: ongoingOrder?.length
            ? verticalScale(130)
            : verticalScale(50),
          marginTop: -20,
          backgroundColor: colors.WHITE,
        }}
      >
        <ScreenWrapper>
          <ImageBackground
            source={require("@/assets/images/home-sketch.webp")}
            style={styles.imageBackground}
            resizeMode="cover"
          >
            <View style={styles.overlayContainer}>
              <HomeHeader
                // onPress={() => addressSheet.current?.snapToIndex(0)}
                onPress={() => router.push("/(modal)/SelectAddress")}
              />
              <SearchView
                placeholder="Search for dishes, restaurants & groceries"
                onPress={() => router.push("/screens/universal/home-search")}
                style={{ marginHorizontal: scale(20) }}
              />
            </View>
            <Carousel
              loop
              style={{
                width: SCREEN_WIDTH,
                height: SCREEN_HEIGHT * 0.48,
                justifyContent: "center",
                alignItems: "center",
              }}
              autoPlay
              autoPlayInterval={4000}
              scrollAnimationDuration={2500}
              width={Math.round(SCREEN_WIDTH)} // Ensuring whole number
              height={Math.round(SCREEN_HEIGHT * 0.48)} // Ensuring whole number
              data={bannerData || []}
              renderItem={({ item }: any) => (
                <FastImage
                  source={{
                    uri: item?.imageUrl,
                    priority: FastImage.priority.high,
                  }}
                  resizeMode="cover"
                  style={{
                    width: SCREEN_WIDTH,
                    height: Math.round(SCREEN_HEIGHT * 0.48),
                    borderBottomLeftRadius: radius._30,
                    borderBottomRightRadius: radius._30,
                  }}
                />
              )}
              customAnimation={animationStyle}
            />
          </ImageBackground>
          <TopService />
          <BusinessCategories query="" />
        </ScreenWrapper>
      </ScrollView>

      <View style={styles.floatingContainer}>
        <FloatingPreparingOrder
          data={ongoingOrder}
          refetchOngoingOrder={refetchOngoingOrder}
          openTempOrderSheet={() => temporaryOrderSheet.current?.snapToIndex(0)}
        />
      </View>

      <BottomSheet
        ref={temporaryOrderSheet}
        index={-1}
        snapPoints={temporarySnapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <TemporaryOrderSheet />
      </BottomSheet>

      <BottomSheet
        ref={temporaryOrderSheet}
        index={-1}
        snapPoints={temporarySnapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <TemporaryOrderSheet />
      </BottomSheet>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  gradient: {
    borderBottomLeftRadius: radius._30,
    borderBottomRightRadius: radius._30,
  },
  imageBackground: {
    borderBottomLeftRadius: radius._30,
    borderBottomRightRadius: radius._30,
    overflow: "hidden",
    flex: 1,
  },
  pressable: {
    alignSelf: "center",
    marginTop: verticalScale(16),
    marginBottom: verticalScale(24),
    backgroundColor: colors.NEUTRAL900,
    paddingHorizontal: scale(32),
    paddingVertical: verticalScale(12),
    borderRadius: radius._30,
  },
  image: {
    width: scale(SCREEN_WIDTH * 0.7),
    height: verticalScale(SCREEN_HEIGHT * 0.15),
    alignSelf: "center",
  },
  floatingContainer: {
    position: "absolute",
    bottom: verticalScale(10),
    marginHorizontal: "auto",
  },
  overlayContainer: {
    position: "absolute",
    top: verticalScale(8),
    left: 0,
    right: 0,
    zIndex: 100,
    elevation: 10,
  },
});
