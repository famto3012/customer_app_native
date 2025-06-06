import Typo from "@/components/Typo";
import { colors, radius, spacingX } from "@/constants/theme";
import { useData } from "@/context/DataContext";
import { getImageDisplayType } from "@/service/universal";
import { useAuthStore } from "@/store/store";
import { scale, verticalScale } from "@/utils/styling";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useQuery } from "@tanstack/react-query";
import { Pressable, StyleSheet, View } from "react-native";
import FastImage from "react-native-fast-image";

interface ProductDetailSheetProps {
  onViewImage: () => void;
}

const ProductDetailSheet = ({ onViewImage }: ProductDetailSheetProps) => {
  const { product } = useData();
  const { selectedBusiness } = useAuthStore.getState();

  const { data, isPending } = useQuery({
    queryKey: ["image-display-type", selectedBusiness],
    queryFn: () => getImageDisplayType(selectedBusiness as string),
    enabled: !!product,
  });

  if (isPending) return null;

  return (
    <View style={styles.container}>
      <BottomSheetScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Pressable onPress={onViewImage}>
            <FastImage
              source={{
                uri: product?.productImageURL,
                priority: FastImage.priority.high,
              }}
              style={styles.image}
              resizeMode={data ?? "cover"}
            />
          </Pressable>

          {/* <View style={styles.favoriteButton}>
            <Heart
              color={product?.isFavorite ? colors.RED : colors.WHITE}
              weight={product?.isFavorite ? "fill" : "regular"}
              size={24}
            />
          </View> */}
        </View>

        <View style={styles.detailsContainer}>
          {product?.type === "Veg" ? (
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
          ) : product?.type === "Non-veg" ? (
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
          <Typo size={18} color={colors.NEUTRAL900} fontFamily="SemiBold">
            {product?.productName}
          </Typo>
          {product?.inventory && (
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
                {product?.discountPrice
                  ? product?.discountPrice
                  : product?.price}
              </Typo>
            </View>
          )}

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
    marginHorizontal: scale(15),
  },
  image: {
    height: verticalScale(180),
    borderRadius: radius._20,
    resizeMode: "cover",
  },
  favoriteButton: {
    position: "absolute",
    top: scale(15),
    right: scale(15),
    backgroundColor: "transparent",
  },
  detailsContainer: {
    paddingHorizontal: scale(20),
    marginVertical: verticalScale(16),
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
    backgroundColor: colors.RED + "20",
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
