import React, { FC, memo, useState } from "react";
import { Pressable, View, StyleSheet } from "react-native";
import Typo from "@/components/Typo";
import Animated, {
  FadeInUp,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import { verticalScale, scale } from "@/utils/styling";
import { colors, radius } from "@/constants/theme";
import ProductsList from "./ProductList";
import { CategoryProps, ProductProps } from "@/types";

interface CategoryContainerProps {
  category: CategoryProps;
  products: ProductProps[];
  openVariant: (count?: number) => void;
  openDetail: () => void;
}

const CategoryContainer: FC<CategoryContainerProps> = memo(
  ({ category, products, openVariant, openDetail }) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(category.status);

    return (
      <Animated.View
        style={[
          styles.categoryContainer,
          { paddingBottom: isExpanded ? verticalScale(10) : verticalScale(0) },
        ]}
        layout={LinearTransition.damping(10)}
      >
        <Pressable
          onPress={() => setIsExpanded((prev) => !prev)}
          style={styles.categoryBtn}
        >
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
              transform: [{ rotate: isExpanded ? "180deg" : "0deg" }],
            }}
          />
        </Pressable>

        {isExpanded && (
          <Animated.View
            entering={FadeInUp.springify().damping(12).stiffness(100)}
            exiting={FadeOut.springify().damping(10).stiffness(80)}
          >
            <ProductsList
              products={products}
              openVariant={openVariant}
              openDetail={openDetail}
            />
          </Animated.View>
        )}
      </Animated.View>
    );
  },
  (prevProps, nextProps) => {
    // First check if categories are the same
    if (prevProps.category.categoryId !== nextProps.category.categoryId)
      return false;

    // Fast length check
    if (prevProps.products.length !== nextProps.products.length) return false;

    // Check if product IDs are the same (avoid comparing entire objects)
    return prevProps.products.every(
      (product, index) =>
        product.productId === nextProps.products[index].productId
    );
  }
);

export default CategoryContainer;

const styles = StyleSheet.create({
  categoryContainer: {
    marginVertical: verticalScale(10),
    paddingHorizontal: scale(7),
    backgroundColor: colors.WHITE,
    borderRadius: radius._10,
    marginHorizontal: scale(10),
  },
  categoryBtn: {
    paddingVertical: verticalScale(15),
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
