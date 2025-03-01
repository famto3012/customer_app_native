import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import Typo from "@/components/Typo";
import { colors } from "@/constants/theme";
import {
  BottomSheetScrollView,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from "@gorhom/bottom-sheet";
import { scale, verticalScale } from "@/utils/styling";
import { ItemsProps } from "@/types";

const ViewImageBottomSheet = ({ data }: { data: ItemsProps }) => {
  return (
    <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerContainer}>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          <Typo size={15} fontFamily="SemiBold" color={colors.PRIMARY}>
            {data?.itemName}
          </Typo>
        </View>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          <Typo
            size={13}
            color={colors.NEUTRAL400}
            style={{ marginHorizontal: scale(5) }}
          >
            Quantity
          </Typo>
          <Typo size={14} fontFamily="SemiBold" color={colors.NEUTRAL900}>
            {data?.quantity.toString()}
            {data?.unit}
          </Typo>
        </View>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          <Typo
            size={13}
            color={colors.NEUTRAL400}
            style={{ marginHorizontal: scale(5) }}
          >
            No of units
          </Typo>
          <Typo size={14} fontFamily="SemiBold" color={colors.NEUTRAL900}>
            {data?.numOfUnits}
          </Typo>
        </View>
      </View>
      <View
        style={{
          marginVertical: verticalScale(10),
          backgroundColor: colors.NEUTRAL100,
        }}
      >
        <Image
          source={
            data?.imageURL
              ? {
                  uri: data?.imageURL,
                }
              : require("@/assets/icons/gallery.webp")
          }
          style={data?.imageURL ? styles.image : styles.default}
        />
      </View>
    </BottomSheetScrollView>
  );
};

export default ViewImageBottomSheet;

const styles = StyleSheet.create({
  contentContainer: {
    padding: scale(20),
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: scale(5),
  },
  image: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.4,
    borderRadius: scale(10),
    resizeMode: "contain",
    marginVertical: scale(5),
    backgroundColor: colors.NEUTRAL100,
  },
  default: {
    width: scale(40),
    height: scale(40),
    justifyContent: "center",
    alignItems: "center",
  },
});
