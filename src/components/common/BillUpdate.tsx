import { Image, Pressable, StyleSheet, View } from "react-native";
import { scale, verticalScale } from "@/utils/styling";
import { colors, radius } from "@/constants/theme";
import Typo from "../Typo";
import { FC } from "react";

const BillUpdate: FC<{ onPress: () => void }> = ({ onPress }) => {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Image
        source={require("@/assets/icons/bill.webp")}
        style={styles.image}
      />

      <View style={{ flex: 1, marginLeft: scale(15) }}>
        <Typo size={13} color={colors.NEUTRAL900}>
          Your total bill{" "}
          <Typo size={13} fontFamily="SemiBold" color={colors.NEUTRAL900}>
            will be updated soon
          </Typo>
        </Typo>
        <Typo size={12}>Including all charges and tax</Typo>
      </View>

      <Image
        source={require("@/assets/icons/arrow-square.webp")}
        style={styles.image}
      />
    </Pressable>
  );
};

export default BillUpdate;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.WHITE,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(15),
    borderTopLeftRadius: radius._10,
    borderTopRightRadius: radius._10,
  },
  image: {
    width: scale(24),
    height: verticalScale(24),
    resizeMode: "cover",
  },
});
