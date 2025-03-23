import { Image, Pressable, StyleSheet, View } from "react-native";
import { FC } from "react";
import { PickAndDropItemProps } from "@/types";
import Typo from "../Typo";
import { scale, verticalScale } from "@/utils/styling";
import { colors, radius, spacingX } from "@/constants/theme";

const ItemCard: FC<{
  item: PickAndDropItemProps;
  onEditItem: (item: PickAndDropItemProps, index: number) => void;
  onDeleteItem: (index: number) => void;
  index: number;
}> = ({ item, onEditItem, onDeleteItem, index }) => {
  return (
    <View key={index} style={styles.container}>
      <View style={styles.header}>
        <Typo size={15} fontFamily="Medium" color={colors.NEUTRAL900}>
          {item.itemName}
        </Typo>

        <View style={styles.actionContainer}>
          <Pressable
            style={styles.actionBtn}
            onPress={() => onEditItem(item, index)}
          >
            <Image
              source={require("@/assets/icons/edit.webp")}
              style={{
                width: scale(24),
                height: verticalScale(24),
                resizeMode: "cover",
              }}
            />
          </Pressable>

          <Pressable
            onPress={() => onDeleteItem(index)}
            style={styles.actionBtn}
          >
            <Image
              source={require("@/assets/icons/trash.webp")}
              style={{
                width: scale(24),
                height: verticalScale(24),
                resizeMode: "cover",
              }}
            />
          </Pressable>
        </View>
      </View>

      <View style={styles.detailContainer}>
        <View>
          <Typo size={13}>Weight</Typo>
          <Typo size={14} color={colors.NEUTRAL900} fontFamily="Medium">
            {item?.weight || "-"} kg
          </Typo>
        </View>

        <View style={styles.separator} />

        <View>
          <Typo size={13}>Package specification</Typo>
          <Typo size={14} color={colors.NEUTRAL900} fontFamily="Medium">
            {item?.length || "-"} * {item?.width || "-"} * {item?.height || "-"}{" "}
            cm
          </Typo>
        </View>
      </View>
    </View>
  );
};

export default ItemCard;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: radius._10,
    borderColor: colors.NEUTRAL200,
    paddingBottom: verticalScale(15),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.NEUTRAL200,
    borderTopLeftRadius: radius._10,
    borderTopRightRadius: radius._10,
    paddingStart: scale(10),
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._12,
    marginEnd: scale(15),
  },
  actionBtn: {
    paddingVertical: verticalScale(15),
    paddingHorizontal: scale(10),
  },
  detailContainer: {
    flexDirection: "row",
    paddingStart: scale(20),
    marginTop: verticalScale(15),
    gap: spacingX._15,
  },
  separator: {
    borderWidth: 0.6,
    borderColor: colors.NEUTRAL300,
  },
});
