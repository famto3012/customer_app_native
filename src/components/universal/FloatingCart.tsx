import { colors, radius, spacingY } from "@/constants/theme";
import { getCartItems } from "@/localDB/controller/cartController";
import { addItemsToCart } from "@/service/universal";
import { useAuthStore } from "@/store/store";
import { scale, SCREEN_WIDTH, verticalScale } from "@/utils/styling";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { XCircle } from "phosphor-react-native";
import { FC } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";
import Typo from "../Typo";

const FloatingCart: FC<{ onClearCart: () => void }> = ({ onClearCart }) => {
  const showCart = useAuthStore((state) => state.cart.showCart);
  const merchant = useAuthStore((state) => state.cart.merchant);
  const merchantId = useAuthStore((state) => state.cart.merchantId);

  const { selectedMerchant } = useAuthStore.getState();

  const handleAddItemsToCartMutation = useMutation({
    mutationKey: ["add-items"],
    mutationFn: ({ merchantId, items }: { merchantId: any; items: any }) =>
      addItemsToCart(merchantId, items),
    onSuccess: (data) => {
      if (data) {
        router.push({
          pathname: "/screens/universal/checkout",
          params: {
            cartId: data,
          },
        });
      }
    },
  });

  const handlePrepare = async () => {
    const items = await getCartItems();

    handleAddItemsToCartMutation.mutate({
      merchantId: merchantId || "",
      items,
    });
  };

  return showCart ? (
    <Animated.View
      entering={FadeInUp.springify().damping(12).stiffness(100)}
      exiting={FadeOutDown.springify().damping(10).stiffness(80)}
      style={styles.container}
    >
      <Image
        source={require("@/assets/images/shopping-cart.webp")}
        style={{ width: scale(40), height: scale(40) }}
        resizeMode="cover"
      />

      <View style={{ width: "30%", flexDirection: "column", gap: spacingY._5 }}>
        <Typo
          size={13}
          fontFamily="SemiBold"
          textProps={{ numberOfLines: 1 }}
          color={colors.NEUTRAL800}
        >
          {merchant}
        </Typo>
        <Typo size={12} color={colors.NEUTRAL800}>
          Checkout
        </Typo>
      </View>

      <Pressable onPress={handlePrepare} style={styles.checkoutBtn}>
        {handleAddItemsToCartMutation.isPending ? (
          <ActivityIndicator
            size="small"
            color={colors.WHITE}
            style={{ paddingHorizontal: scale(20) }}
          />
        ) : (
          <Typo size={12} color={colors.WHITE}>
            Checkout
          </Typo>
        )}
      </Pressable>

      <Pressable onPress={onClearCart} style={styles.clearBtn}>
        <XCircle size={scale(24)} color={colors.RED} />
      </Pressable>
    </Animated.View>
  ) : null;
};

export default FloatingCart;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? verticalScale(30) : verticalScale(20),
    backgroundColor: colors.WHITE,
    width: SCREEN_WIDTH - scale(40),
    marginHorizontal: scale(20),
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(10),
    borderRadius: radius._10,
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: "row",
  },
  text: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: "bold",
  },
  checkoutBtn: {
    backgroundColor: colors.PRIMARY,
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(10),
    borderRadius: radius._10,
  },
  clearBtn: {
    padding: scale(10),
  },
});
