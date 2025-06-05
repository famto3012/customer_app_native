import TemporaryOrderSheet from "@/components/BottomSheets/universal/TemporaryOrderSheet";
import HomeHeader from "@/components/HomeHeader";
import ScreenWrapper from "@/components/ScreenWrapper";
import SearchView from "@/components/SearchView";
import TopService from "@/components/TopService";
import BusinessCategories from "@/components/universal/BusinessCategories";
import FloatingPreparingOrder from "@/components/universal/FloatingPreparingOrder";
import { commonStyles } from "@/constants/commonStyles";
import { colors, radius } from "@/constants/theme";
import { getAllOrder } from "@/localDB/controller/orderController";
import { getOngoingOrder } from "@/service/orderService";
import { getAppBanner } from "@/service/userService";
import { useAuthStore } from "@/store/store";
import { AppBannerType } from "@/types";
import { requestLocationPermission } from "@/utils/helpers";
import {
  scale,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  verticalScale,
} from "@/utils/styling";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { useFocusEffect } from "@react-navigation/native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import FastImage from "react-native-fast-image";
import { interpolate } from "react-native-reanimated";
import Carousel, { TAnimationStyle } from "react-native-reanimated-carousel";

const Home = () => {
  const temporaryOrderSheet = useRef<BottomSheet>(null);
  const [showCount, setShowCount] = useState(0);
  const [hasTemporaryOrders, setHasTemporaryOrders] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const temporarySnapPoints = useMemo(() => ["60%"], []);

  const { token, outsideGeofence, location } = useAuthStore.getState();

  useEffect(() => {
    if (!location || !location.latitude || !location.longitude) {
      requestLocationPermission();
    }
  }, []);

  useEffect(() => {
    if (outsideGeofence) {
      router.push({
        pathname: "/(modals)/SelectAddress",
        params: {
          showActionButton: "false",
          setAsUserAddress: "true",
          mustSelectAddress: "true",
        },
      });
    }
  }, [outsideGeofence]);

  const checkTemporaryOrders = useCallback(async () => {
    const orders = await getAllOrder();
    setHasTemporaryOrders(orders.length > 0);
    return orders.length > 0;
  }, []);

  useEffect(() => {
    checkTemporaryOrders();
  }, []);

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

  const handleOrderCancel = useCallback(async () => {
    // First set to false to trigger state change
    setShowCount((prev) => prev + 1);

    // Add timeout to ensure state updates properly
    const hasOrders = await checkTemporaryOrders();
    if (!hasOrders) {
      temporaryOrderSheet.current?.close();
    }
  }, [checkTemporaryOrders]);

  const handleBannerPress = (item: AppBannerType) => {
    if (item.businessCategoryId && item.merchantId) {
      useAuthStore.setState({
        selectedBusiness: item.businessCategoryId,
        selectedMerchant: {
          merchantId: item.merchantId as string,
          merchantName: item.merchantName as string,
        },
      });

      router.push({
        pathname: "/screens/universal/products",
        params: { merchantId: item.merchantId },
      });
    }
  };

  const handleBannerPressWithIndex = () => {
    if (bannerData && bannerData.length > 0) {
      const currentItem = bannerData[currentIndex];
      console.log("Banner pressed with correct index:", currentItem);
      handleBannerPress(currentItem);
    }
  };

  return (
    // <SafeAreaView style={{ flex: 1, backgroundColor: colors.WHITE }}>
    <ScreenWrapper>
      <View style={{ flex: 1, backgroundColor: colors.WHITE }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: ongoingOrder?.length
              ? Platform.OS === "ios"
                ? verticalScale(160)
                : verticalScale(130)
              : Platform.OS === "ios"
              ? verticalScale(80)
              : verticalScale(50),
            marginTop: Platform.OS === "ios" ? 0 : -20,
            backgroundColor: colors.WHITE,
          }}
        >
          <View style={styles.imageBackground}>
            <View style={styles.overlayContainer}>
              <HomeHeader
                onPress={() =>
                  router.push({
                    pathname: "/(modals)/SelectAddress",
                    params: {
                      setAsUserAddress: "true",
                      showActionButton: "false",
                    },
                  })
                }
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
              onProgressChange={(_, absoluteProgress) => {
                // Track the current visible index
                if (absoluteProgress !== undefined) {
                  const newIndex = Math.round(absoluteProgress);
                  if (
                    newIndex !== currentIndex &&
                    newIndex < (bannerData?.length || 0)
                  ) {
                    setCurrentIndex(newIndex);
                  }
                }
              }}
              renderItem={({
                item,
                index,
              }: {
                item: AppBannerType;
                index: number;
              }) => {
                // console.log(`Rendering banner at index ${index}:`, item._id);

                return (
                  <Pressable onPress={handleBannerPressWithIndex}>
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
                  </Pressable>
                );
              }}
              customAnimation={animationStyle}
            />
          </View>
          <TopService />
          <BusinessCategories query="" />
        </ScrollView>

        <View style={styles.floatingContainer}>
          <FloatingPreparingOrder
            data={ongoingOrder}
            refetchOngoingOrder={refetchOngoingOrder}
            openTempOrderSheet={() => {
              checkTemporaryOrders().then((hasOrders) => {
                if (hasOrders) {
                  temporaryOrderSheet.current?.snapToIndex(0);
                }
              });
            }}
            countUpdate={showCount}
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
          <TemporaryOrderSheet
            onClose={() => temporaryOrderSheet.current?.close}
            onCancel={handleOrderCancel}
          />
        </BottomSheet>
      </View>
    </ScreenWrapper>
    // </SafeAreaView>
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
    bottom: Platform.OS === "android" ? verticalScale(10) : verticalScale(20),
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
