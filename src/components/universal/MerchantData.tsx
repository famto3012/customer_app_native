import { colors, radius, spacingX } from "@/constants/theme";
import { MerchantDataProps } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { Clock, Star } from "phosphor-react-native";
import { FC } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import MerchantDataLoader from "../Loader/MerchantDataLoader";
import Typo from "../Typo";

const MerchantData: FC<{
  merchantData: MerchantDataProps;
  openRating: () => void;
  merchantDataLoading: boolean;
}> = ({ merchantData, openRating, merchantDataLoading }) => {
  return (
    <>
      {merchantDataLoading ? (
        <View style={[styles.merchantData]}>
          <MerchantDataLoader />
        </View>
      ) : (
        <View style={[styles.merchantData, {}]}>
          <View style={{ gap: scale(10), flex: 1, maxWidth: "80%" }}>
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

          <View style={{ flexShrink: 1 }}>
            <Pressable style={styles.rating} onPress={openRating}>
              <Star size={scale(15)} color={colors.WHITE} weight="fill" />
              <Typo size={14} color={colors.WHITE}>
                {merchantData?.rating}
              </Typo>
            </Pressable>
          </View>
        </View>
      )}
    </>
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
