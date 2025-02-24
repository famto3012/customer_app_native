import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { FC, useState } from "react";
import { Heart } from "phosphor-react-native";
import Typo from "@/components/Typo";
import { colors, radius, spacingX } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleProductFavorite } from "@/service/universal";
import { ProductProps } from "@/types";
import { router } from "expo-router";
import { Grayscale } from "react-native-color-matrix-image-filters";

const FavoriteProductCard: FC<{
  item: ProductProps;
}> = ({ item }) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(item.isFavorite);
  const queryClient = useQueryClient();

  const handleFavoriteMutation = useMutation({
    mutationKey: ["product-favorite", item.productId],
    mutationFn: () => toggleProductFavorite(item.productId),
    onSuccess: () => {
      setIsFavorite(!isFavorite);
      queryClient.invalidateQueries({ queryKey: ["favoriteProductList"] });
    },
  });

  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        if (!item.inventory) return;
        router.push({
          pathname: "/screens/universal/products",
          params: { merchantId: item.merchantId },
        });
      }}
    >
      <View>
        {!item.inventory ? (
          <Grayscale>
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
          </Grayscale>
        ) : (
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
          {item?.description}
        </Typo>
      </View>
    </Pressable>
  );
};

export default FavoriteProductCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacingX._15,
    marginHorizontal: spacingX._15,
    marginTop: verticalScale(20),
  },
});
