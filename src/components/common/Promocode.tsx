import { Image, Pressable, StyleSheet, View } from "react-native";
import { scale, verticalScale } from "@/utils/styling";
import Typo from "../Typo";
import { CaretRight } from "phosphor-react-native";
import { colors } from "@/constants/theme";

const PromoCode = () => {
  return (
    <Pressable
      style={{
        paddingVertical: 15,
        paddingHorizontal: 10,
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        backgroundColor: "white",
        borderRadius: 8,
      }}
    >
      <Image
        source={require("@/assets/icons/ticket-discount.webp")}
        style={{ height: scale(24), width: scale(24), marginRight: 15 }}
      />
      <View style={{ flex: 1 }}>
        <Typo fontFamily="Medium" size={12} color={colors.NEUTRAL900}>
          Apply a promo code
        </Typo>
        <Typo size={12}>Get discounts using promo codes</Typo>
      </View>

      <View
        style={{
          borderWidth: 0.8,
          paddingVertical: verticalScale(2),
          paddingHorizontal: scale(2),
          borderRadius: 5,
        }}
      >
        <CaretRight size={20} />
      </View>
    </Pressable>
  );
};

export default PromoCode;

const styles = StyleSheet.create({});
