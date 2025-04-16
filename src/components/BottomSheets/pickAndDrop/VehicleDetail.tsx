import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { FC } from "react";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { scale, verticalScale } from "@/utils/styling";
import Typo from "@/components/Typo";
import { colors, radius, spacingX } from "@/constants/theme";
import { commonStyles } from "@/constants/commonStyles";

interface VehicleDetailProps {
  data: {
    image: ImageSourcePropType;
    name: string;
    capacity: string;
    size: string;
  };
}

const VehicleDetail: FC<VehicleDetailProps> = ({ data }) => {
  return (
    <BottomSheetScrollView
      contentContainerStyle={{ paddingHorizontal: scale(20) }}
    >
      <View
        style={[
          commonStyles.flexRowGap,
          { marginTop: verticalScale(20), gap: spacingX._20 },
        ]}
      >
        <Image
          source={data.image}
          style={{
            width: scale(40),
            height: verticalScale(40),
            resizeMode: "cover",
          }}
        />

        <Typo size={16} color={colors.NEUTRAL900} fontFamily="Medium">
          {data.name}
        </Typo>
      </View>

      <View
        style={[
          commonStyles.flexRowGap,
          { gap: spacingX._20, marginTop: verticalScale(15) },
        ]}
      >
        <View>
          <Typo size={13} color={colors.NEUTRAL400}>
            Capacity
          </Typo>
          <Typo size={14} color={colors.NEUTRAL900} fontFamily="Medium">
            {data.capacity}
          </Typo>
        </View>

        <View
          style={{
            borderWidth: 0.6,
            borderColor: colors.NEUTRAL400,
            height: verticalScale(30),
          }}
        />

        <View>
          <Typo size={13} color={colors.NEUTRAL400}>
            Size
          </Typo>
          <Typo size={14} color={colors.NEUTRAL900} fontFamily="Medium">
            {data.size}
          </Typo>
        </View>
      </View>

      <View style={[commonStyles.flexRowGap, styles.textContainer]}>
        <Image
          source={require("@/assets/icons/hand-arrow.webp")}
          style={{
            width: scale(16),
            height: verticalScale(16),
            resizeMode: "cover",
          }}
        />

        <Typo size={13}>We don’t allow overloading.</Typo>
      </View>
    </BottomSheetScrollView>
  );
};

export default VehicleDetail;

const styles = StyleSheet.create({
  textContainer: {
    backgroundColor: colors.NEUTRAL200,
    marginTop: verticalScale(20),
    marginBottom: verticalScale(15),
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(10),
    borderRadius: radius._10,
  },
});
