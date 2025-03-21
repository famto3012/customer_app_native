import React, { memo } from "react";
import { Pressable, View, StyleSheet } from "react-native";
import Typo from "@/components/Typo";
import Animated from "react-native-reanimated";
import { verticalScale, scale } from "@/utils/styling";
import { colors } from "@/constants/theme";
import ProductsList from "./ProductList";
import { CategoryProps, ProductProps } from "@/types";

const CategoryContainer = memo(
  ({
    category,
    products,
    openVariant,
    openDetail,
  }: {
    category: CategoryProps;
    products: ProductProps[];
    openVariant: (count?: number) => void;
    openDetail: () => void;
  }) => {
    return (
      <View style={styles.categoryContainer}>
        <Pressable style={styles.categoryBtn}>
          <Typo size={16} color={colors.NEUTRAL900} fontFamily="SemiBold">
            {category.categoryName}
          </Typo>

          <Animated.Image
            source={require("@/assets/icons/arrow-square-up.webp")}
            style={{
              height: verticalScale(24),
              width: scale(24),
              resizeMode: "cover",
              marginRight: scale(10),
              // transform: [{ rotate: isExpanded ? "180deg" : "0deg" }],
            }}
          />
        </Pressable>

        <View>
          <ProductsList
            products={products}
            openVariant={openVariant}
            openDetail={openDetail}
          />
        </View>
      </View>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison function to determine if component should update
    return (
      prevProps.category.categoryId === nextProps.category.categoryId &&
      prevProps.products.length === nextProps.products.length
    );
  }
);

export default CategoryContainer;

const styles = StyleSheet.create({
  categoryContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    marginHorizontal: scale(15),
  },
  categoryBtn: {
    paddingTop: verticalScale(15),
    paddingBottom: verticalScale(24),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  arrowIcon: {
    height: verticalScale(24),
    width: scale(24),
    resizeMode: "cover",
    marginRight: scale(10),
  },
});
