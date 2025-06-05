import { colors, radius } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import { router } from "expo-router";
import { FC } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import Typo from "../Typo";

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
        <Typo color={colors.NEUTRAL700} size={12}>
          Get discounts using promo codes
        </Typo>
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
    backgroundColor: colors.PRIMARY_SECOND,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(15),
    borderBottomLeftRadius: radius._10,
    borderBottomRightRadius: radius._10,
    // borderTopLeftRadius: radius._10,
    // borderTopRightRadius: radius._10,
    elevation: 5,
  },
  image: {
    width: scale(24),
    height: verticalScale(24),
    resizeMode: "cover",
  },
});
