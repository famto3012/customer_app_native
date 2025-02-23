import {
  View,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import HomeHeader from "@/components/HomeHeader";
import ScreenWrapper from "@/components/ScreenWrapper";
import SearchView from "@/components/SearchView";
import { colors, radius } from "@/constants/theme";
import Typo from "@/components/Typo";
import {
  scale,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  verticalScale,
} from "@/utils/styling";
import TopService from "@/components/TopService";
import BusinessCategories from "@/components/universal/BusinessCategories";
import { useCallback, useEffect } from "react";
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

const Home = () => {
  const { token } = useAuthStore.getState();

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const queryClient = useQueryClient();

  const { data } = useQuery({
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

  // useEffect(() => {
  //   console.log("bannerData", bannerData);
  // }, [bannerData]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.WHITE }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: data?.length ? verticalScale(70) : 0,
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
            {/* <LinearGradient
              locations={[0, 0.1, 1]}
              colors={[
                "rgba(255, 255, 255, 0.5)",
                "rgba(110, 253, 255, 0.75)",
                "rgba(0, 206, 209, 0.8)",
              ]}
              style={styles.gradient}
            > */}

            {/* <View> */}
            <View style={styles.overlayContainer}>
              <HomeHeader />
              <SearchView
                placeholder="Search Business category"
                onPress={() => router.push("/screens/universal/home-search")}
                style={{ marginHorizontal: scale(20) }}
              />
            </View>
            {/* <View style={{ marginTop: verticalScale(24) }}>
                  <Typo
                    size={20}
                    fontFamily="SemiBold"
                    color={colors.WHITE}
                    style={{ textAlign: "center" }}
                  >
                    Grab Our Exclusive Food
                  </Typo>
                  <Typo
                    size={20}
                    fontFamily="SemiBold"
                    color={colors.WHITE}
                    style={{ textAlign: "center" }}
                  >
                    Discounts Now!
                  </Typo>
                </View>
                <Pressable onPress={() => {}} style={styles.pressable}>
                  <Typo size={14} fontFamily="Medium" color={colors.WHITE}>
                    Order Now
                  </Typo>
                </Pressable>
                <Image
                  source={require("@/assets/images/home-burger.webp")}
                  style={styles.image}
                  resizeMode="contain"
                /> */}
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
              scrollAnimationDuration={2000}
              width={Math.round(SCREEN_WIDTH)} // Ensuring whole number
              height={Math.round(SCREEN_HEIGHT * 0.48)} // Ensuring whole number
              data={bannerData || []}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item?.imageUrl }}
                  resizeMode="cover"
                  style={{
                    width: SCREEN_WIDTH, // Round to avoid floating-point errors
                    height: Math.round(SCREEN_HEIGHT * 0.48), // Round to avoid floating-point errors
                    borderBottomLeftRadius: radius._30,
                    borderBottomRightRadius: radius._30,
                  }}
                />
              )}
              customAnimation={animationStyle}
            />
            {/* </View> */}
            {/* </LinearGradient> */}
          </ImageBackground>
          <TopService />
          <BusinessCategories query="" />
        </ScreenWrapper>
      </ScrollView>

      <View style={styles.floatingContainer}>
        <FloatingPreparingOrder data={data} />
      </View>
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
    top: verticalScale(8), // Adjust as needed
    left: 0,
    right: 0,
    zIndex: 100, // High zIndex to stay on top
    elevation: 10, // For Android shadow effect
  },
});
