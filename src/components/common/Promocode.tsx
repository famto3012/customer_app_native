import { Image, Pressable, StyleSheet, View } from "react-native";
import { scale, verticalScale } from "@/utils/styling";
import Typo from "../Typo";
import { colors, radius } from "@/constants/theme";
import { FC } from "react";
import { router } from "expo-router";

const PromoCode: FC<{
  deliveryMode: string;
  merchantId?: string;
  orderAmount: number;
  cartId: string;
}> = ({ deliveryMode, merchantId, orderAmount, cartId }) => {
  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/screens/common/promo-code",
          params: { deliveryMode, merchantId, orderAmount, cartId },
        })
      }
      style={styles.container}
    >
      <Image
        source={require("@/assets/icons/ticket-discount.webp")}
        style={styles.image}
      />
      <View style={{ flex: 1, marginLeft: scale(15) }}>
        <Typo fontFamily="Medium" size={12} color={colors.NEUTRAL900}>
          Apply a promo code
        </Typo>
        <Typo size={12}>Get discounts using promo codes</Typo>
      </View>

      <Image
        source={require("@/assets/icons/arrow-square.webp")}
        style={styles.image}
      />
    </Pressable>
  );
};

export default PromoCode;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.WHITE,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(15),
    borderBottomLeftRadius: radius._10,
    borderBottomRightRadius: radius._10,
  },
  image: {
    width: scale(24),
    height: verticalScale(24),
    resizeMode: "cover",
  },
});
