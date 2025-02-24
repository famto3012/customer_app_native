import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import Typo from "@/components/Typo";
import { scale, verticalScale } from "@/utils/styling";
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { colors } from "@/constants/theme";
import FavoriteProductList from "@/components/BottomSheets/user/FavoriteProductList";
import FavoriteMerchantList from "@/components/BottomSheets/user/FavoriteMerchantList";

const TAB_WIDTH = scale((SCREEN_WIDTH - 40) / 2);

const Favorites = () => {
  const [favoriteType, setFavoriteType] = useState("Product");
  const indicatorPosition = useSharedValue(0);

  useEffect(() => {
    indicatorPosition.value = withTiming(
      favoriteType === "Product" ? 0 : TAB_WIDTH,
      {
        duration: 300,
      }
    );
  }, [favoriteType]);

  const animatedIndicator = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorPosition.value }],
  }));

  return (
    <ScreenWrapper>
      <Header title="Favorites" />

      <View style={styles.tabContainer}>
        <View style={styles.tab}>
          {/* Home Delivery Tab */}
          <Pressable
            onPress={() => setFavoriteType("Product")}
            style={styles.tabOption}
          >
            <Typo
              size={14}
              color={
                favoriteType === "Product"
                  ? colors.NEUTRAL900
                  : colors.NEUTRAL400
              }
              fontFamily="SemiBold"
            >
              Products
            </Typo>
          </Pressable>

          {/* Take Away Tab */}
          <Pressable
            onPress={() => setFavoriteType("Merchant")}
            style={styles.tabOption}
          >
            <Typo
              size={14}
              color={
                favoriteType === "Merchant"
                  ? colors.NEUTRAL900
                  : colors.NEUTRAL400
              }
              fontFamily="SemiBold"
            >
              Merchants
            </Typo>
          </Pressable>

          {/* Sliding Bottom Border */}
          <Animated.View style={[styles.indicator, animatedIndicator]} />
        </View>
      </View>
      {favoriteType === "Product" ? (
        <FavoriteProductList />
      ) : (
        <FavoriteMerchantList />
      )}
    </ScreenWrapper>
  );
};

export default Favorites;

const styles = StyleSheet.create({
  tabContainer: {
    marginHorizontal: scale(20),
    marginTop: verticalScale(15),
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
});
