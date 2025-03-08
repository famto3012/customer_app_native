import { Image, Pressable, StyleSheet, View } from "react-native";
import { FC, memo, useCallback, useEffect, useState } from "react";
import { ProductProps } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import Typo from "../Typo";
import { colors, radius, spacingX } from "@/constants/theme";
import AddCartButton from "./AddCartButton";
import { Heart } from "phosphor-react-native";
import { toggleProductFavorite } from "@/service/universal";
import { useAuthStore } from "@/store/store";
import { router, useFocusEffect } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { Grayscale } from "react-native-color-matrix-image-filters";
import { updateCart } from "@/localDB/controller/cartController";
import { database } from "@/localDB/database";
import Cart from "@/localDB/models/Cart";

const ProductCard: FC<{
  item: ProductProps;
  openVariant?: (product: ProductProps) => void;
  cartCount?: number | null;
  showAddCart: boolean;
  trigger?: string;
}> = ({ item, openVariant, cartCount, showAddCart, trigger }) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(item.isFavorite);
  const [count, setCount] = useState<number | null>(cartCount || null);

  const { token, selectedMerchant } = useAuthStore.getState();

  useFocusEffect(
    useCallback(() => {
      const fetchCartQuantity = async () => {
        if (!selectedMerchant?.merchantId) return;
        const cartCollection = database.get<Cart>("cart");
        const cartItems = await cartCollection
          .query()
          .fetch()
          .then((items) =>
            items.filter(
              (cartItem) =>
                cartItem.merchantId === selectedMerchant.merchantId &&
                cartItem.productId === item.productId &&
                cartItem.quantity > 0
            )
          );

        const totalQuantity = cartItems.reduce(
          (sum, cartItem) => sum + cartItem.quantity,
          0
        );
        setCount(totalQuantity);
      };

      fetchCartQuantity();
    }, [item, selectedMerchant, trigger])
  );

  useEffect(() => {
    cartCount ? setCount(cartCount) : setCount(null);
  }, [cartCount]);

  const handleFavoriteMutation = useMutation({
    mutationKey: ["product-favorite", item.productId],
    mutationFn: () => toggleProductFavorite(item.productId),
    onSuccess: () => setIsFavorite(!isFavorite),
  });

  const isUserAuthenticated = () => {
    if (!token) {
      router.push({ pathname: "/auth", params: { showSkip: 0 } });
      return false;
    }
    return true;
  };

  const handleDecrement = () => {
    if (!isUserAuthenticated()) return;
    if (!item.inventory) return;

    if (item.variantAvailable) {
      openVariant?.({ ...item, cartCount: count ? count : 0 });
    } else {
      const newQuantity = count ? count - 1 : 1;
      newQuantity === 0 ? setCount(null) : setCount(newQuantity);
      updateCart(
        selectedMerchant?.merchantId || "",
        item.productId,
        item.productName,
        item.price,
        newQuantity
      );
    }
  };

  const handleIncrement = () => {
    if (!isUserAuthenticated()) return;
    if (!item.inventory) return;

    if (item.variantAvailable) {
      openVariant?.({ ...item, cartCount: count ? count : 0 });
    } else {
      const newQuantity = count ? count + 1 : 1;
      setCount(newQuantity);
      updateCart(
        selectedMerchant?.merchantId || "",
        item.productId,
        item.productName,
        item.price,
        newQuantity
      );
    }
  };

  return (
    <View style={styles.container}>
      <View>
        {!item.inventory ? (
          <Grayscale>
            <Image
              source={{ uri: item.productImageURL }}
              style={styles.image}
              resizeMode="cover"
            />
          </Grayscale>
        ) : (
          <Image
            source={{ uri: item.productImageURL }}
            style={styles.image}
            resizeMode="cover"
          />
        )}

        <Pressable
          onPress={() => handleFavoriteMutation.mutate()}
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
            count={count ? count : 0}
            inventory={item?.inventory}
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
          {item.productName}
        </Typo>

        <View style={styles.priceContainer}>
          <Typo
            size={14}
            color={colors.NEUTRAL400}
            textProps={{ numberOfLines: 3 }}
            style={{
              display: item?.discountPrice ? "flex" : "none",
              textDecorationLine: "line-through",
            }}
          >
            ₹ {item?.price}
          </Typo>
          <Typo
            size={16}
            color={colors.NEUTRAL800}
            textProps={{ numberOfLines: 3 }}
          >
            ₹ {item?.discountPrice ? item.discountPrice : item.price}
          </Typo>
        </View>

        <Typo
          size={12}
          color={colors.NEUTRAL400}
          textProps={{ numberOfLines: 3 }}
        >
          {item.description}
        </Typo>
      </View>
    </View>
  );
};

export default memo(ProductCard);

const styles = StyleSheet.create({
  container: {
    marginBottom: verticalScale(40),
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacingX._15,
  },
  image: {
    width: scale(120),
    height: scale(120),
    position: "relative",
    borderRadius: radius._10,
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
});
