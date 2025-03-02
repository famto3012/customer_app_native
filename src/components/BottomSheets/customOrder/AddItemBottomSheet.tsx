import { StyleSheet } from "react-native";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Typo from "@/components/Typo";
import { colors } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import AddItem from "@/components/customOrder/AddItem";
import { FC } from "react";
import { CustomOrderItemsProps } from "@/types";

const AddItemBottomSheet: FC<{
  onAddingItem: (data: CustomOrderItemsProps[]) => void;
  closeAddSheet: () => void;
}> = ({ onAddingItem, closeAddSheet }) => {
  return (
    <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
      <Typo
        size={15}
        fontFamily="SemiBold"
        color={colors.PRIMARY}
        style={styles.header}
      >
        Add Item
      </Typo>

      <AddItem onAddingItem={onAddingItem} closeAddSheet={closeAddSheet} />
    </BottomSheetScrollView>
  );
};

export default AddItemBottomSheet;

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
