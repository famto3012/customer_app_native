import { StyleSheet, TouchableOpacity, View } from "react-native";
import { scale, verticalScale } from "@/utils/styling";
import Typo from "../Typo";
import { colors, radius } from "@/constants/theme";
import { router } from "expo-router";
import { FC, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { addProductToCart } from "@/service/universal";
import { CartProps } from "@/types";
import { useAuthStore } from "@/store/store";

const ItemList: FC<{ items: CartProps["items"] }> = ({ items }) => {
  const [cartItems, setCartItems] = useState<CartProps["items"]>([]);

  useEffect(() => {
    setCartItems(items);
  }, [items]);

  const handleUpdateCartMutation = useMutation({
    mutationKey: ["update-cart"],
    mutationFn: async ({
      productId,
      quantity,
      variantTypeId,
    }: {
      productId: string;
      quantity: number;
      variantTypeId: string;
    }): Promise<boolean> =>
      addProductToCart(productId, quantity, variantTypeId),

    onSuccess: async (_, { productId, quantity }) => {
      setCartItems((prev) => {
        const updatedItems = prev
          .map((item) =>
            item.productId.id === productId ? { ...item, quantity } : item
          )
          .filter((item) => item.quantity > 0);

        // If cart is empty, navigate back and reset cart
        if (updatedItems.length === 0) {
          useAuthStore.setState({
            cart: {
              showCart: false,
              merchant: "",
              cartId: "",
            },
          });
          router.back();
        }

        return updatedItems;
      });
    },
  });

  return (
    <View style={styles.container}>
      <Typo size={14} fontFamily="SemiBold" color={colors.NEUTRAL800}>
        Added Items
      </Typo>

      {cartItems?.map((product, index) => (
        <View style={styles.itemContainer} key={index + 1}>
          <View>
            <Typo size={13} color={colors.NEUTRAL900}>
              {product?.productId?.productName}
            </Typo>
            <Typo size={14} color={colors.NEUTRAL900} fontFamily="SemiBold">
              ₹ {product?.price}
            </Typo>
          </View>

          <View style={[styles.actionBtn]}>
            <TouchableOpacity
              onPress={() =>
                handleUpdateCartMutation.mutate({
                  productId: product.productId.id,
                  quantity: product.quantity - 1,
                  variantTypeId: product?.variantTypeId || "",
                })
              }
              style={styles.btn}
            >
              <Typo size={14} color={colors.PRIMARY}>
                -
              </Typo>
            </TouchableOpacity>
            <Typo size={16} color={colors.PRIMARY} fontFamily="Medium">
              {product?.quantity}
            </Typo>
            <TouchableOpacity
              onPress={() =>
                handleUpdateCartMutation.mutate({
                  productId: product.productId.id,
                  quantity: product.quantity + 1,
                  variantTypeId: product?.variantTypeId || "",
                })
              }
              style={styles.btn}
            >
              <Typo size={14} color={colors.PRIMARY}>
                +
              </Typo>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <TouchableOpacity onPress={() => router.back()} style={styles.addBtn}>
        <Typo size={14} color={colors.PRIMARY}>
          Add More
        </Typo>
      </TouchableOpacity>
    </View>
  );
};

export default ItemList;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(20),
    marginVertical: verticalScale(10),
  },
  itemContainer: {
    marginVertical: verticalScale(10),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actionBtn: {
    backgroundColor: colors.WHITE,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    height: verticalScale(34),
    borderRadius: radius._6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  btn: {
    paddingHorizontal: scale(18),
  },
  addBtn: {
    backgroundColor: colors.PRIMARY_LIGHT,
    justifyContent: "center",
    alignItems: "center",
    height: verticalScale(45),
    marginVertical: verticalScale(15),
    borderRadius: radius._10,
  },
});
