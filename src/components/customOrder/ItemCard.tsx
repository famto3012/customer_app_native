import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { FC } from "react";
import { CustomOrderItemsProps } from "@/types";
import Typo from "../Typo";
import { scale, verticalScale } from "@/utils/styling";
import { colors, radius, spacingX } from "@/constants/theme";

const ItemCard: FC<{
  item: CustomOrderItemsProps;
  onEditItem: (item: CustomOrderItemsProps) => void;
  onViewImage: (item: CustomOrderItemsProps) => void;
  onDeleteItem: (itemId: string) => void;
  isDeleting: boolean;
  deletingId: string | null;
}> = ({
  item,
  onEditItem,
  onViewImage,
  onDeleteItem,
  isDeleting,
  deletingId,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typo size={15} fontFamily="Medium" color={colors.NEUTRAL900}>
          {item.itemName}
        </Typo>

        <View style={styles.actionContainer}>
          <Pressable style={styles.actionBtn} onPress={() => onEditItem(item)}>
            <Image
              source={require("@/assets/icons/edit.webp")}
              style={{
                width: scale(24),
                height: verticalScale(24),
                resizeMode: "cover",
              }}
            />
          </Pressable>

          {isDeleting && deletingId === item.itemId ? (
            <View style={styles.actionBtn}>
              <ActivityIndicator size="small" color={colors.RED} />
            </View>
          ) : (
            <Pressable
              onPress={() => onDeleteItem(item?.itemId || "")}
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
          )}
        </View>
      </View>

      <View style={styles.detailContainer}>
        <View>
          <Typo size={13}>Quantity</Typo>
          <Typo size={14} color={colors.NEUTRAL900} fontFamily="Medium">
            {item.quantity} {item.unit}
          </Typo>
        </View>

        <View style={styles.separator} />

        <View>
          <Typo size={13}>No. of Units</Typo>
          <Typo size={14} color={colors.NEUTRAL900} fontFamily="Medium">
            {item.numOfUnits}
          </Typo>
        </View>
      </View>

      {item.itemImage && (
        <View style={styles.imageBtn}>
          <Pressable
            onPress={() => onViewImage(item)}
            style={styles.imageDetail}
          >
            <Image
              source={require("@/assets/icons/paperclip.webp")}
              style={styles.galleryImage}
              resizeMode="cover"
            />
            <Typo size={13} color={colors.NEUTRAL900}>
              {item.itemName} Image
            </Typo>
          </Pressable>
        </View>
      )}
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
  galleryImage: {
    height: verticalScale(24),
    width: scale(24),
    marginHorizontal: scale(10),
  },
  imageBtn: {
    marginTop: verticalScale(20),
    backgroundColor: colors.NEUTRAL200,
    marginHorizontal: scale(15),
    flexDirection: "row",
    borderRadius: radius._10,
    paddingVertical: verticalScale(15),
  },
  imageDetail: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
});
