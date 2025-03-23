import { Image, StyleSheet, View } from "react-native";
import { FC } from "react";
import { Phone } from "phosphor-react-native";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import { MerchantDataProps } from "@/types";
import Typo from "@/components/Typo";

const CategoryFooter: FC<{ merchantData: MerchantDataProps }> = ({
  merchantData,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.itemContainer}>
        <Image
          source={require("@/assets/images/fssai.webp")}
          style={styles.fssaiImage}
        />
        <Typo size={13} color={colors.NEUTRAL900}>
          {merchantData?.fssaiNumber}
        </Typo>
      </View>
      <View style={styles.itemContainer}>
        <Phone size={scale(16)} />
        <Typo size={13} color={colors.NEUTRAL900}>
          {merchantData?.phoneNumber}
        </Typo>
      </View>
    </View>
  );
};

export default CategoryFooter;

const styles = StyleSheet.create({
  container: {
    paddingBottom: verticalScale(50),
    paddingHorizontal: scale(20),
    gap: spacingY._15,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._15,
  },
  fssaiImage: {
    width: scale(30),
    height: verticalScale(15),
    resizeMode: "cover",
  },
});
