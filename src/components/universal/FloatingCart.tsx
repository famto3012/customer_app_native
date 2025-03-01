import { Image, Pressable, StyleSheet, View } from "react-native";
import { colors, radius, spacingY } from "@/constants/theme";
import { scale, SCREEN_WIDTH, verticalScale } from "@/utils/styling";
import { useAuthStore } from "@/store/store";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";
import Typo from "../Typo";
import { XCircle } from "phosphor-react-native";
import { clearCart } from "@/service/universal";
import { FC } from "react";
import { router } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const FloatingCart: FC<{ onClearCart: () => void }> = ({ onClearCart }) => {
  const showCart = useAuthStore((state) => state.cart.showCart);
  const merchant = useAuthStore((state) => state.cart.merchant);
  const cartId = useAuthStore((state) => state.cart.cartId);

  const queryClient = useQueryClient();

  const handleClearCartMutation = useMutation({
    mutationKey: ["clear-cart"],
    mutationFn: () => clearCart(cartId),
    onSuccess: () => {
      queryClient.clear();
      useAuthStore.setState({
        cart: {
          showCart: false,
          merchant: "",
          cartId: "",
        },
        promoCode: null,
      });

      onClearCart();
    },
  });

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

      <Pressable
        onPress={() =>
          router.push({
            pathname: "/screens/universal/checkout",
            params: {
              cartId,
            },
          })
        }
        style={styles.checkoutBtn}
      >
        <Typo size={12} color={colors.WHITE}>
          Checkout
        </Typo>
      </Pressable>

      <Pressable
        onPress={() => handleClearCartMutation.mutate()}
        style={styles.clearBtn}
      >
        <XCircle size={20} color={colors.RED} />
      </Pressable>
    </Animated.View>
  ) : null;
};

export default FloatingCart;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    backgroundColor: colors.WHITE,
    width: SCREEN_WIDTH - 40,
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
