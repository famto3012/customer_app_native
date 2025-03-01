import { Pressable, StyleSheet, View } from "react-native";
import { FC } from "react";
import { scale, verticalScale } from "@/utils/styling";
import { colors, radius, spacingX } from "@/constants/theme";
import { MerchantDataProps } from "@/types";
import Typo from "../Typo";
import { Clock, Star } from "phosphor-react-native";

const MerchantData: FC<{ merchantData: MerchantDataProps }> = ({
  merchantData,
}) => {
  return (
    <View style={styles.merchantData}>
      <View style={{ gap: scale(10) }}>
        <Typo size={20} color={colors.NEUTRAL900} fontWeight="bold">
          {merchantData?.merchantName}
        </Typo>
        <Typo size={12} color={colors.NEUTRAL600} fontFamily="Medium">
          {merchantData?.displayAddress}
        </Typo>

        <View style={styles.labels}>
          <Clock size={scale(15)} />
          <Typo size={12} color={colors.NEUTRAL600} fontFamily="Medium">
            {merchantData?.deliveryTime} min •
          </Typo>
          <Typo size={12} color={colors.NEUTRAL600} fontFamily="Medium">
            {merchantData?.distanceInKM} km
          </Typo>
        </View>

        <Typo size={12} color={colors.NEUTRAL600}>
          {merchantData?.description}
        </Typo>
      </View>

      <View>
        <Pressable style={styles.rating}>
          <Star size={scale(15)} color={colors.WHITE} weight="fill" />
          <Typo size={14} color={colors.WHITE}>
            {merchantData?.rating}
          </Typo>
        </Pressable>
      </View>
    </View>
  );
};

export default MerchantData;

const styles = StyleSheet.create({
  merchantData: {
    marginHorizontal: scale(20),
    marginTop: verticalScale(30),
    backgroundColor: colors.WHITE,
    padding: scale(15),
    borderRadius: radius._10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  labels: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._3,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._7,
    backgroundColor: colors.PRIMARY,
    paddingHorizontal: scale(8),
    paddingVertical: scale(2),
    borderRadius: radius._3,
  },
});
