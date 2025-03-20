import { StyleSheet, View, Image, ScrollView } from "react-native";
import React, { FC } from "react";
import Button from "@/components/Button";
import { scale, verticalScale } from "@/utils/styling";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import Typo from "@/components/Typo";
import { ProductProps } from "@/types";
import { Heart } from "phosphor-react-native";
import { BottomSheetScrollView, SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import FastImage from "react-native-fast-image";

const ProductDetailSheet: FC<{
  product: ProductProps;
  onClose: () => void;
}> = ({ product, onClose }) => {
  return (
    <View style={styles.container}>
      <BottomSheetScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <FastImage
            source={{
              uri: product?.productImageURL,
              priority: FastImage.priority.high,
            }}
            style={styles.image}
            resizeMode="cover"
          />

          <View style={styles.favoriteButton}>
            <Heart
              color={product?.isFavorite ? colors.RED : colors.WHITE}
              weight={product?.isFavorite ? "fill" : "regular"}
              size={24}
            />
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <Typo size={18} color={colors.NEUTRAL900} fontFamily="SemiBold">
            {product?.productName}
          </Typo>

          <View style={styles.priceContainer}>
            {product?.discountPrice && (
              <Typo
                size={16}
                color={colors.NEUTRAL400}
                style={{
                  textDecorationLine: "line-through",
                }}
              >
                ₹ {product?.price}
              </Typo>
            )}
            <Typo size={16} color={colors.NEUTRAL900} fontFamily="SemiBold">
              ₹{" "}
              {product?.discountPrice ? product?.discountPrice : product?.price}
            </Typo>
          </View>

          {product?.inventory ? (
            <View style={styles.inStockBadge}>
              <Typo size={12} color={colors.GREEN} fontFamily="Medium">
                In Stock
              </Typo>
            </View>
          ) : (
            <View style={styles.outOfStockBadge}>
              <Typo size={12} color={colors.RED} fontFamily="Medium">
                Out of Stock
              </Typo>
            </View>
          )}

          <View style={styles.descriptionContainer}>
            <Typo
              size={16}
              color={colors.NEUTRAL900}
              fontFamily="SemiBold"
              style={styles.sectionTitle}
            >
              Description
            </Typo>
            <Typo
              size={13}
              color={colors.NEUTRAL500}
              style={styles.description}
            >
              {product?.longDescription ||
                product?.description ||
                "No description available for this product."}
            </Typo>
          </View>

          {product?.variantAvailable && (
            <View style={styles.variantBadge}>
              <Typo size={12} color={colors.NEUTRAL600} fontFamily="Medium">
                Variants Available
              </Typo>
            </View>
          )}
        </View>
      </BottomSheetScrollView>

      {/* <View style={styles.footer}>
        <Button onPress={onClose} title="Close" />
      </View> */}
    </View>
  );
};

export default ProductDetailSheet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
    borderTopLeftRadius: radius._20,
    borderTopRightRadius: radius._20,
  },
  imageContainer: {
    position: "relative",
    width: SCREEN_WIDTH,
  },
  image: {
    width: SCREEN_WIDTH,
    height: scale(180),
    borderTopLeftRadius: radius._20,
    borderTopRightRadius: radius._20,
  },
  favoriteButton: {
    position: "absolute",
    top: scale(15),
    right: scale(15),
    backgroundColor: "transparent",
  },
  detailsContainer: {
    paddingHorizontal: scale(20),
    marginTop: verticalScale(16),
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
    marginTop: verticalScale(5),
  },
  inStockBadge: {
    backgroundColor: colors.GREEN + "20",
    paddingHorizontal: scale(10),
    paddingVertical: scale(5),
    borderRadius: radius._15,
    alignSelf: "flex-start",
    marginTop: verticalScale(10),
  },
  outOfStockBadge: {
    backgroundColor: colors.RED + "20", // 20% opacity
    paddingHorizontal: scale(10),
    paddingVertical: scale(5),
    borderRadius: radius._15,
    alignSelf: "flex-start",
    marginTop: verticalScale(10),
  },
  variantBadge: {
    backgroundColor: colors.NEUTRAL300,
    paddingHorizontal: scale(10),
    paddingVertical: scale(5),
    borderRadius: radius._15,
    alignSelf: "flex-start",
    marginTop: verticalScale(10),
  },
  descriptionContainer: {
    marginVertical: verticalScale(10),
  },
  sectionTitle: {
    marginBottom: verticalScale(8),
  },
  description: {
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: scale(20),
    paddingVertical: scale(20),
  },
});
