import { Image, Pressable, StyleSheet, View } from "react-native";
import { FC, useEffect, useState } from "react";
import { ProductProps } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import Typo from "../Typo";
import { colors, radius, spacingX } from "@/constants/theme";
import AddCartButton from "./AddCartButton";
import { Heart } from "phosphor-react-native";
import {
  addProductToCart,
  haveValidCart,
  toggleProductFavorite,
} from "@/service/universal";
import { useAuthStore } from "@/store/store";
import { router } from "expo-router";
import { useMutation } from "@tanstack/react-query";

const ProductCard: FC<{
  item: ProductProps;
  openVariant?: (product: ProductProps) => void;
  cartCount?: number | null;
  showAddCart: boolean;
}> = ({ item, openVariant, cartCount, showAddCart }) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(item.isFavorite);
  const [count, setCount] = useState<number | null>(cartCount || null);

  const { token } = useAuthStore.getState();

  useEffect(() => {
    if (count !== null && count >= 0 && !item.variantAvailable) {
      handleUpdateCartMutation.mutate();
    }
  }, [count]);

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
      router.push("/auth");
      return false;
    }
    return true;
  };

  const handleDecrement = () => {
    if (!isUserAuthenticated()) return;

    if (item.variantAvailable) {
      console.log(`Variant available`);
    } else {
      setCount((prev) => (prev && prev > 0 ? prev - 1 : 0));
    }
  };

  const handleIncrement = () => {
    if (!isUserAuthenticated()) return;
    console.log("Button Pressed");
    if (item.variantAvailable) {
      openVariant?.(item);
    } else {
      setCount((prev) => (prev ? prev + 1 : 1));
    }
  };

  const handleUpdateCartMutation = useMutation({
    mutationKey: ["update-cart"],
    mutationFn: () => {
      const quantity = count ?? 0;
      return addProductToCart(item.productId, quantity);
    },
    onSuccess: async () => {
      const floatingCartRes = await haveValidCart();

      useAuthStore.setState({
        cart: {
          showCart: floatingCartRes.haveCart,
          merchant: floatingCartRes.merchant,
          cartId: floatingCartRes.cartId,
        },
      });
    },
  });

  return (
    <View style={styles.container}>
      <View>
        <Image
          source={{ uri: item.productImageURL }}
          style={{
            width: scale(120),
            height: scale(120),
            position: "relative",
            borderRadius: radius._10,
          }}
          resizeMode="cover"
        />

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
          />
        )}
      </View>

      <View style={{ flex: 1, paddingTop: verticalScale(10) }}>
        <Typo
          size={14}
          color={colors.NEUTRAL800}
          fontFamily="Medium"
          textProps={{ numberOfLines: 2 }}
        >
          {item.productName}
        </Typo>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacingX._10,
          }}
        >
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

export default ProductCard;

const styles = StyleSheet.create({
  container: {
    marginBottom: verticalScale(40),
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacingX._15,
  },
});
