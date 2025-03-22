import React, { FC, memo, useEffect, useMemo, useState } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import FastImage from "react-native-fast-image";
import { Heart } from "phosphor-react-native";
import { Grayscale } from "react-native-color-matrix-image-filters";
import { colors, radius, spacingX } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import Typo from "@/components/Typo";
import AddCartButton from "@/components/universal/AddCartButton";
import { ProductProps } from "@/types";
import { router } from "expo-router";
import { useAuthStore } from "@/store/store";
import { updateCart } from "@/localDB/controller/cartController";
import { useData } from "@/context/DataContext";

interface ProductItemProps {
  product: ProductProps;
  showAddCart?: boolean;
  openVariant?: (count?: number) => void;
  openDetail?: () => void;
}

const ProductItem: FC<ProductItemProps> = memo(
  ({ product, showAddCart, openVariant, openDetail }) => {
    const [isFavorite, setIsFavorite] = useState<boolean>(product.isFavorite);

    // Remove local count state and use productCounts instead
    const { token, selectedMerchant } = useAuthStore.getState();
    const { productCounts, setProduct, setProductCounts } = useData();

    // For example, in ProductItem.tsx
    const count = useMemo(() => {
      if (product?.variantAvailable) {
        return Object.entries(productCounts)
          .filter(([id]) => id.split("-")[0] === product.productId)
          .reduce((sum, [, { count }]) => sum + (count || 0), 0);
      }
      return productCounts[product.productId]?.count || 0;
    }, [product.productId, productCounts]);

    const isUserAuthenticated = () => {
      if (!token) {
        router.push({ pathname: "/auth", params: { showSkip: 0 } });
        return false;
      }
      return true;
    };

    const handleDecrement = () => {
      if (!isUserAuthenticated() || !product.inventory) return;

      if (product.variantAvailable) {
        setProduct(product);
        openVariant?.(productCounts[product.productId]?.count);
      } else {
        const newQuantity = (productCounts[product.productId]?.count || 0) - 1;
        const updatedQuantity = newQuantity < 1 ? 0 : newQuantity;

        // Update global state
        setProductCounts((prev) => ({
          ...prev,
          [product.productId]: {
            count: updatedQuantity,
          },
        }));

        updateCart(
          selectedMerchant?.merchantId || "",
          product.productId,
          product.productName,
          product.price,
          updatedQuantity
        );
      }
    };

    const handleIncrement = () => {
      if (!isUserAuthenticated() || !product.inventory) return;

      if (product.variantAvailable) {
        setProduct(product);
        openVariant?.(productCounts[product.productId]?.count);
      } else {
        const newQuantity = (productCounts[product.productId]?.count || 0) + 1;

        // Update global state
        setProductCounts((prev) => ({
          ...prev,
          [product.productId]: {
            count: newQuantity,
          },
        }));

        updateCart(
          selectedMerchant?.merchantId || "",
          product.productId,
          product.productName,
          product.price,
          newQuantity
        );
      }
    };

    return (
      <View style={styles.productContainer}>
        <View>
          <Pressable
            onPress={() => {
              setProduct(product);
              openDetail?.();
            }}
          >
            {!product.inventory ? (
              <Grayscale>
                <FastImage
                  source={{
                    uri: product.productImageURL,
                    priority: FastImage.priority.high,
                  }}
                  style={styles.productImage}
                  resizeMode="cover"
                />
              </Grayscale>
            ) : (
              <FastImage
                source={{
                  uri: product.productImageURL,
                  priority: FastImage.priority.high,
                }}
                style={styles.productImage}
                resizeMode="cover"
              />
            )}
          </Pressable>

          <Pressable
            onPress={() => {}}
            style={{ position: "absolute", right: 0, padding: scale(7) }}
          >
            <Heart
              color={isFavorite ? colors.RED : colors.WHITE}
              weight={isFavorite ? "fill" : "regular"}
            />
          </Pressable>

          {showAddCart && (
            <AddCartButton
              onDecrement={handleDecrement}
              onIncrement={handleIncrement}
              onPress={handleIncrement}
              count={count}
              inventory={product?.inventory}
            />
          )}
        </View>

        <View style={styles.contentContainer}>
          <Typo
            size={14}
            color={colors.NEUTRAL800}
            fontFamily="Medium"
            textProps={{ numberOfLines: 2 }}
          >
            {product.productName}
          </Typo>

          <View style={styles.priceContainer}>
            {product.discountPrice && (
              <Typo
                size={14}
                color={colors.NEUTRAL400}
                textProps={{ numberOfLines: 3 }}
                style={styles.discountedPrice}
              >
                ₹ {product.price}
              </Typo>
            )}
            <Typo
              size={16}
              color={colors.NEUTRAL800}
              textProps={{ numberOfLines: 3 }}
            >
              ₹ {product.discountPrice || product.price}
            </Typo>
          </View>

          <Typo
            size={12}
            color={colors.NEUTRAL400}
            textProps={{ numberOfLines: 3 }}
          >
            {product.longDescription || product.description}
          </Typo>
        </View>
      </View>
    );
  },
  (prevProps, nextProps) => {
    // Compare only essential props that would affect rendering
    return (
      prevProps.product.productId === nextProps.product.productId &&
      prevProps.product.isFavorite === nextProps.product.isFavorite &&
      prevProps.product.inventory === nextProps.product.inventory
    );
  }
);

export default ProductItem;

const styles = StyleSheet.create({
  productContainer: {
    marginBottom: verticalScale(40),
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacingX._15,
  },
  productImage: {
    width: scale(120),
    height: scale(120),
    borderRadius: radius._10,
  },
  heartIcon: {
    position: "absolute",
    right: 0,
    padding: scale(7),
  },
  contentContainer: {
    flex: 1,
    paddingTop: verticalScale(10),
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
  },
  discountedPrice: {
    textDecorationLine: "line-through",
  },
});
