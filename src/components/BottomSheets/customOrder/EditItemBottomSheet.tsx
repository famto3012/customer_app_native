import { StyleSheet } from "react-native";
import React, { FC } from "react";
import { CustomOrderItemsProps } from "@/types";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { scale, verticalScale } from "@/utils/styling";
import Typo from "@/components/Typo";
import { colors } from "@/constants/theme";
import EditItem from "@/components/customOrder/EditItem";

const EditItemBottomSheet: FC<{
  item: CustomOrderItemsProps | null;
  onEditItem: (data: CustomOrderItemsProps[]) => void;
  onViewImage: (data: CustomOrderItemsProps) => void;
}> = ({ item, onEditItem, onViewImage }) => {
  return (
    <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
      <Typo
        size={15}
        fontFamily="SemiBold"
        color={colors.PRIMARY}
        style={styles.header}
      >
        Edit Item
      </Typo>

      <EditItem item={item} onEditItem={onEditItem} onViewImage={onViewImage} />
    </BottomSheetScrollView>
  );
};

export default EditItemBottomSheet;

const styles = StyleSheet.create({
  contentContainer: {
    padding: scale(20),
    flex: 1,
  },
  header: {
    borderBottomWidth: 0.6,
    paddingBottom: verticalScale(10),
    borderBottomColor: colors.NEUTRAL400,
  },
});
