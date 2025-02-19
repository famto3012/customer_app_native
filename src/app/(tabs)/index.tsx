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

  useFocusEffect(
    useCallback(() => {
      queryClient.invalidateQueries({ queryKey: ["ongoingOrder"] });
    }, [queryClient])
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: data?.length ? verticalScale(70) : 0,
        }}
      >
        <ScreenWrapper>
          <ImageBackground
            source={require("@/assets/images/home-sketch.webp")}
            style={styles.imageBackground}
            resizeMode="cover"
          >
            <LinearGradient
              locations={[0, 0.1, 1]}
              colors={[
                "rgba(255, 255, 255, 0.5)",
                "rgba(110, 253, 255, 0.75)",
                "rgba(0, 206, 209, 0.8)",
              ]}
              style={styles.gradient}
            >
              <View>
                <HomeHeader />
                <SearchView
                  placeholder="Search Business category"
                  onPress={() => {}}
                  style={{ marginHorizontal: scale(20) }}
                />
                <View style={{ marginTop: verticalScale(24) }}>
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
                />
              </View>
            </LinearGradient>
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
});
