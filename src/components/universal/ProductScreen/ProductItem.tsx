import Typo from "@/components/Typo";
import AddCartButton from "@/components/universal/AddCartButton";
import { colors, radius, spacingX } from "@/constants/theme";
import { useData } from "@/context/DataContext";
import { updateCart } from "@/localDB/controller/cartController";
import { toggleProductFavorite } from "@/service/universal";
import { useAuthStore } from "@/store/store";
import { ProductProps } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { Heart } from "phosphor-react-native";
import { FC, memo, useMemo, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  ToastAndroid,
  View,
} from "react-native";
import { Grayscale } from "react-native-color-matrix-image-filters";
import FastImage from "react-native-fast-image";

interface ProductItemProps {
  product: ProductProps;
  showAddCart?: boolean;
  openVariant?: (count?: number) => void;
  openDetail?: () => void;
  navigateToMerchant?: boolean;
}

const ProductItem: FC<ProductItemProps> = memo(
  ({ product, showAddCart, openVariant, openDetail, navigateToMerchant }) => {
    const [isFavorite, setIsFavorite] = useState<boolean>(product.isFavorite);

    // Remove local count state and use productCounts instead
    const { token, selectedMerchant, setSelectedBusiness } =
      useAuthStore.getState();
    const { productCounts, setProduct, setProductCounts } = useData();
    const queryClient = useQueryClient();

    const count = useMemo(() => {
      if (!showAddCart) return 0;

      return Object.entries(productCounts)
        .filter(([id]) => id.startsWith(product.productId))
        .reduce((sum, [, { count }]) => sum + (count || 0), 0);
    }, [product.productId, productCounts]);

    const handleFavoriteMutation = useMutation({
      mutationKey: ["product-favorite", product.productId],
      mutationFn: () => toggleProductFavorite(product.productId),
      onSuccess: (data) => {
        if (data.success) {
          setIsFavorite(!isFavorite);

          queryClient.invalidateQueries({
            queryKey: ["favorite-product-list"],
          });
        }
      },
    });

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
        const totalCount = Object.entries(productCounts)
          .filter(([id]) => id.startsWith(product.productId)) // Get all variants
          .reduce((sum, [, { count }]) => sum + (count || 0), 0);

        setProduct(product);

        openVariant?.(totalCount);
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

        const price = product.discountPrice
          ? product.discountPrice
          : product.price;

        updateCart(
          selectedMerchant?.merchantId || "",
          product.productId,
          product.productName,
          price,
          newQuantity
        );
      }
    };

    const handleIncrement = () => {
      if (!isUserAuthenticated() || !product.inventory) return;

      if (product.variantAvailable) {
        const totalCount = Object.entries(productCounts)
          .filter(([id]) => id.startsWith(product.productId)) // Get all variants
          .reduce((sum, [, { count }]) => sum + (count || 0), 0);

        openVariant?.(totalCount);

        setProduct(product);
        openVariant?.(totalCount);
      } else {
        const newQuantity = (productCounts[product.productId]?.count || 0) + 1;

        // Update global state
        setProductCounts((prev) => ({
          ...prev,
          [product.productId]: {
            count: newQuantity,
          },
        }));

        const price = product.discountPrice
          ? product.discountPrice
          : product.price;

        updateCart(
          selectedMerchant?.merchantId || "",
          product.productId,
          product.productName,
          price,
          newQuantity
        );
      }
    };

    return (
      <Pressable
        onPress={() => {
          if (product?.redirectable === false) {
            if (Platform.OS === "android") {
              ToastAndroid.showWithGravity(
                "Merchant currently unavailable",
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
              );
              return;
            } else {
              Alert.alert("Error", "Merchant currently unavailable");
              return;
            }
          }

          if (navigateToMerchant) {
            setSelectedBusiness(product?.businessCategoryId as string);
            router.push({
              pathname: "/screens/universal/products",
              params: { merchantId: product.merchantId },
            });
          }
        }}
        style={styles.productContainer}
        // disabled={!product?.redirectable}
      >
        <View>
          <Pressable
            onPress={() => {
              setProduct(product);
              openDetail?.();
            }}
            disabled={navigateToMerchant}
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
            onPress={() => handleFavoriteMutation.mutate()}
            style={{
              position: "absolute",
              right: 0,
              zIndex: 10,
              padding: scale(7),
            }}
          >
            <Heart
              color={isFavorite ? colors.RED : colors.WHITE}
              weight={isFavorite ? "fill" : "regular"}
            />
          </Pressable>

          {showAddCart && (
            <AddCartButton
              customizable={product.variantAvailable}
              onDecrement={handleDecrement}
              onIncrement={handleIncrement}
              onPress={handleIncrement}
              count={count}
              inventory={product?.inventory}
            />
          )}
        </View>

        <View style={styles.contentContainer}>
          {/* <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          > */}
          {product.type === "Veg" ? (
            <View
              style={{
                width: scale(15),
                height: scale(15),
                borderWidth: 1.5,
                borderRadius: radius._3,
                borderColor: colors.GREEN,
                marginBottom: scale(3),
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: scale(9),
                  height: scale(9),
                  backgroundColor: colors.GREEN,
                  borderRadius: radius._10,
                }}
              ></View>
            </View>
          ) : product.type === "Non-veg" ? (
            <View
              style={{
                width: scale(15),
                height: scale(15),
                borderWidth: 1.5,
                borderRadius: radius._3,
                borderColor: colors.RED,
                marginBottom: scale(3),
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: scale(9),
                  height: scale(9),
                  backgroundColor: colors.RED,
                  borderRadius: radius._10,
                }}
              ></View>
            </View>
          ) : null}
          <Typo
            size={14}
            color={colors.NEUTRAL800}
            fontFamily="Medium"
            textProps={{ numberOfLines: 2 }}
          >
            {product.productName}
          </Typo>
          {/* </View> */}
          <View
            style={[
              styles.priceContainer,
              { display: product.inventory ? "flex" : "none" },
            ]}
          >
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
      </Pressable>
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
    paddingTop: verticalScale(5),
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
