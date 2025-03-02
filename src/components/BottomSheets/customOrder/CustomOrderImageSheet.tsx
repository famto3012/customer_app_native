import { Image, StyleSheet, View } from "react-native";
import { FC } from "react";
import Typo from "@/components/Typo";
import { colors, radius, spacingX } from "@/constants/theme";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { scale, verticalScale } from "@/utils/styling";
import { CustomOrderItemsProps } from "@/types";

const CustomOrderImageSheet: FC<{ item: CustomOrderItemsProps | null }> = ({
  item,
}) => {
  return (
    <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerContainer}>
        <Typo
          size={15}
          fontFamily="SemiBold"
          color={colors.PRIMARY}
          style={{ flex: 1, marginEnd: scale(15) }}
          textProps={{ numberOfLines: 1 }}
        >
          {item?.itemName}
        </Typo>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacingX._15,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacingX._5,
            }}
          >
            <Typo size={13} color={colors.NEUTRAL400}>
              Quantity
            </Typo>
            <Typo size={14} fontFamily="SemiBold" color={colors.NEUTRAL900}>
              500gm
            </Typo>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacingX._5,
            }}
          >
            <Typo
              size={13}
              color={colors.NEUTRAL400}
              style={{ marginHorizontal: scale(5) }}
            >
              No of units
            </Typo>
            <Typo size={14} fontFamily="SemiBold" color={colors.NEUTRAL900}>
              2
            </Typo>
          </View>
        </View>
      </View>

      <View
        style={{
          marginVertical: verticalScale(20),
        }}
      >
        <Image source={{ uri: item?.itemImage }} style={styles.image} />
      </View>
    </BottomSheetScrollView>
  );
};

export default CustomOrderImageSheet;

const styles = StyleSheet.create({
  contentContainer: {
    padding: scale(20),
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: radius._10,
  },
});
