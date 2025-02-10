import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { FC, useEffect, useState } from "react";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { AddVariantProps, ProductProps, Variant } from "@/types";
import Typo from "../Typo";
import { scale, verticalScale } from "@/utils/styling";
import { colors, radius, spacingX } from "@/constants/theme";
import { addProductToCart, getVariants } from "@/service/universal";

const VariantSheet: FC<{
  product: ProductProps | null;
  onAddItem: (data: AddVariantProps) => void; // ✅ Fixed function signature
}> = ({ product, onAddItem }) => {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [count, setCount] = useState<number>(1);

  useEffect(() => {
    fetchVariants();
  }, [product?.productId]);

  useEffect(() => {
    if (variants.length > 0 && !selected) {
      setSelected(variants[0]?.variantTypes[0]?._id || ""); // ✅ Ensure fallback
    }
  }, [variants]);

  const fetchVariants = async () => {
    if (!product?.productId) return;
    try {
      const res = await getVariants(product.productId);
      setVariants(res);
    } catch (error) {
      console.error("Error fetching variants:", error);
    }
  };

  const handleSelectVariant = (typeId: string) => {
    setSelected(typeId);
  };

  const handleDecrement = () => {
    if (count > 1) setCount(count - 1);
  };

  const handleIncrement = () => {
    setCount(count + 1);
  };

  const handleAddItem = async () => {
    if (selected && count > 0 && product?.productId) {
      const itemData: AddVariantProps = {
        productId: product.productId,
        quantity: count,
        variantTypeId: selected,
      };

      const res = await addProductToCart(
        itemData.productId,
        itemData.quantity,
        itemData.variantTypeId
      );

      if (res) {
        onAddItem(itemData);
      }
    }
  };

  return (
    <View style={styles.wrapper}>
      <BottomSheetScrollView style={styles.container}>
        <View style={styles.productData}>
          <View>
            <Typo size={15} color={colors.PRIMARY} fontFamily="SemiBold">
              {product?.productName}
            </Typo>
            <Typo size={12} color={colors.NEUTRAL400}>
              {product?.longDescription}
            </Typo>
          </View>

          {product?.productImageURL && (
            <Image
              source={{ uri: product.productImageURL }}
              style={styles.productImage}
            />
          )}
        </View>

        <FlatList
          data={variants}
          renderItem={({ item }) => (
            <View style={{ marginTop: verticalScale(20) }}>
              <Typo
                size={14}
                color={colors.NEUTRAL800}
                fontFamily="Medium"
                style={{ paddingBottom: verticalScale(15) }}
              >
                {item.variantName}
              </Typo>

              <FlatList
                data={item.variantTypes}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => handleSelectVariant(item._id)}
                    style={styles.variantRow}
                  >
                    <Typo
                      size={13}
                      fontFamily="Medium"
                      color={colors.NEUTRAL800}
                      style={{ flex: 1 }}
                    >
                      {item.typeName}
                    </Typo>

                    <View style={styles.priceContainer}>
                      <Typo
                        size={14}
                        color={colors.NEUTRAL400}
                        style={{ textDecorationLine: "line-through" }}
                      >
                        ₹ {item.price}
                      </Typo>
                      <Typo
                        size={16}
                        color={colors.NEUTRAL800}
                        fontFamily="Medium"
                      >
                        ₹ {item.discountPrice}
                      </Typo>

                      <View
                        style={[
                          styles.radio,
                          selected === item._id && styles.radioSelected,
                        ]}
                      >
                        {selected === item._id && (
                          <View style={styles.radioInner} />
                        )}
                      </View>
                    </View>
                  </Pressable>
                )}
                scrollEnabled={false}
              />
            </View>
          )}
          scrollEnabled={false}
        />
      </BottomSheetScrollView>

      {/* ✅ Button Stays Fixed at Bottom */}
      <View style={styles.buttonContainer}>
        <View style={styles.secondaryBtn}>
          <TouchableOpacity
            onPress={handleDecrement}
            hitSlop={10}
            style={styles.touchableBtn}
          >
            <Typo size={20} color={colors.PRIMARY} fontFamily="Bold">
              -
            </Typo>
          </TouchableOpacity>

          <Typo size={16} style={{ flex: 1 }}>
            {count}
          </Typo>

          <TouchableOpacity
            onPress={handleIncrement}
            hitSlop={10}
            style={styles.touchableBtn}
          >
            <Typo size={20} color={colors.PRIMARY} fontFamily="Bold">
              +
            </Typo>
          </TouchableOpacity>
        </View>

        <Pressable style={styles.primaryBtn} onPress={handleAddItem}>
          <Typo size={14} color={colors.WHITE}>
            Add Item
          </Typo>
        </Pressable>
      </View>
    </View>
  );
};

export default VariantSheet;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    padding: scale(20),
    paddingBottom: verticalScale(100),
  },
  productData: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    paddingBottom: verticalScale(20),
    borderBottomColor: colors.NEUTRAL300,
  },
  productImage: {
    width: scale(80),
    height: scale(80),
    resizeMode: "cover",
    borderRadius: radius._6,
  },
  variantRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: verticalScale(20),
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
  },
  radio: {
    width: scale(20),
    height: scale(20),
    borderWidth: 2,
    borderColor: colors.NEUTRAL500,
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    borderColor: colors.NEUTRAL900,
  },
  radioInner: {
    width: scale(10),
    height: scale(10),
    backgroundColor: colors.NEUTRAL900,
    borderRadius: 99,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.WHITE,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacingX._30,
    paddingVertical: verticalScale(15),
    paddingHorizontal: scale(20),
    borderTopWidth: 1,
    borderTopColor: colors.NEUTRAL300,
  },
  secondaryBtn: {
    flexDirection: "row",
    flex: 1,
    backgroundColor: colors.PRIMARY_LIGHT,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: verticalScale(4),
    paddingHorizontal: scale(10),
    borderRadius: radius._30,
  },
  primaryBtn: {
    flex: 2,
    backgroundColor: colors.PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(10),
    borderRadius: radius._30,
  },
  touchableBtn: {
    paddingHorizontal: scale(15),
    paddingVertical: scale(5),
  },
});
