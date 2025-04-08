import { Image, StyleSheet, View } from "react-native";
import { FC } from "react";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { PromoCodeProps } from "@/types";
import { scale, SCREEN_WIDTH, verticalScale } from "@/utils/styling";
import Typo from "@/components/Typo";
import { colors, radius, spacingX } from "@/constants/theme";

const PromoDetail: FC<{ data: PromoCodeProps }> = ({ data }) => {
  return (
    <BottomSheetScrollView
      contentContainerStyle={{
        paddingHorizontal: scale(20),
        paddingVertical: verticalScale(20),
      }}
    >
      <View
        style={{
          flexDirection: "row",
          gap: spacingX._15,
          alignItems: "center",
        }}
      >
        <Image
          source={{ uri: data?.imageURL }}
          style={{
            height: verticalScale(50),
            width: scale(50),
            resizeMode: "cover",
            borderRadius: radius._6,
          }}
        />

        <View>
          <Typo size={16} fontFamily="SemiBold" color={colors.NEUTRAL900}>
            {data?.promoCode}
          </Typo>
          <Typo size={13} color={colors.NEUTRAL400}>
            Valid upto {data?.validUpTo}
          </Typo>
        </View>
      </View>

      <View
        style={{
          marginTop: verticalScale(20),
          flexDirection: "row",
          alignItems: "center",
          gap: spacingX._40,
        }}
      >
        <View style={{ width: SCREEN_WIDTH * 0.3 }}>
          <Typo size={13}>Value</Typo>
          <Typo size={14} fontFamily="Medium" color={colors.NEUTRAL900}>
            {data?.promoType === "Percentage"
              ? `${data?.discount}%`
              : `₹${data?.discount}`}
          </Typo>
        </View>
        <View>
          <Typo size={13}>Type</Typo>
          <Typo size={14} fontFamily="Medium" color={colors.NEUTRAL900}>
            {data?.promoType}
          </Typo>
        </View>
      </View>

      <View
        style={{
          marginTop: verticalScale(20),
          flexDirection: "row",
          alignItems: "center",
          gap: spacingX._40,
        }}
      >
        <View style={{ width: SCREEN_WIDTH * 0.3 }}>
          <Typo size={13}>Max discount</Typo>
          <Typo size={14} fontFamily="Medium" color={colors.NEUTRAL900}>
            ₹{data?.maxDiscountValue}
          </Typo>
        </View>
        <View>
          <Typo size={13}>Min Order Amount</Typo>
          <Typo size={14} fontFamily="Medium" color={colors.NEUTRAL900}>
            {data?.minOrderAmount}
          </Typo>
        </View>
      </View>

      <Typo size={12} style={{ paddingTop: verticalScale(15) }}>
        {data?.description}
      </Typo>
    </BottomSheetScrollView>
  );
};

export default PromoDetail;

const styles = StyleSheet.create({});
