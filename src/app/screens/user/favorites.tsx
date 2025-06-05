import Header from "@/components/Header";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import FavoriteMerchantList from "@/components/user/FavoriteMerchantList";
import FavoriteProductList from "@/components/user/FavoriteProductList";
import { colors } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const TAB_WIDTH = (SCREEN_WIDTH - scale(40)) / 2;

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
      <Header title="Favourites" />

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
