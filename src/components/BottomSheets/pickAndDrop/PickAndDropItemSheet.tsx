import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";
import { FC, useEffect, useState, useRef } from "react";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Typo from "@/components/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import { Dropdown } from "react-native-element-dropdown";
import Button from "@/components/Button";
import { pickAndDropItemTypes } from "@/utils/defaultData";
import Input from "@/components/Input";
import { PickAndDropItemProps } from "@/types";
import { commonStyles } from "@/constants/commonStyles";

interface PickAndDropItemSheetProps {
  heading: string;
  buttonLabel: string;
  onConfirm: (data: PickAndDropItemProps) => boolean;
  isLoading: boolean;
  itemData?: PickAndDropItemProps | null;
}

const PickAndDropItemSheet: FC<PickAndDropItemSheetProps> = ({
  heading,
  buttonLabel,
  onConfirm,
  isLoading,
  itemData,
}) => {
  const [item, setItem] = useState<PickAndDropItemProps>({
    itemName: "",
    length: "",
    width: "",
    height: "",
    unit: "",
    weight: "",
  });

  // Create refs for each input
  const widthRef = useRef<TextInput>(null);
  const heightRef = useRef<TextInput>(null);
  const weightRef = useRef<TextInput>(null);

  useEffect(() => {
    if (itemData?.itemName) {
      setItem(itemData);
    }
  }, [itemData]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <BottomSheetScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="none"
        keyboardShouldPersistTaps="handled"
      >
        <Typo
          size={15}
          color={colors.PRIMARY}
          fontFamily="SemiBold"
          style={styles.header}
        >
          {heading}
        </Typo>

        <View style={styles.contentContainer}>
          <Typo size={14} color={colors.NEUTRAL800}>
            Package Details
          </Typo>

          <Dropdown
            data={pickAndDropItemTypes}
            labelField="label"
            valueField="value"
            placeholder="Select item type"
            value={item?.itemName}
            onChange={(data: { label: string; value: string }) =>
              setItem({ ...item, itemName: data.value })
            }
            style={styles.dropdown}
            placeholderStyle={{ fontSize: 16, color: colors.NEUTRAL500 }}
          />

          <Typo size={14} color={colors.NEUTRAL800}>
            Package specifications
          </Typo>

          <View style={[commonStyles.flexRowGap, styles.rowContainer]}>
            <Input
              placeholder="Length"
              value={item.length.toString()}
              onChangeText={(value: string) =>
                setItem({ ...item, length: value })
              }
              keyboardType="number-pad"
              returnKeyType="next"
              onSubmitEditing={() => widthRef.current?.focus()}
            />

            <Input
              inputRef={widthRef}
              placeholder="Width"
              value={item.width.toString()}
              onChangeText={(value: string) =>
                setItem({ ...item, width: value })
              }
              keyboardType="number-pad"
              returnKeyType="next"
              onSubmitEditing={() => heightRef.current?.focus()}
            />

            <Input
              inputRef={heightRef}
              placeholder="Height"
              value={item.height.toString()}
              onChangeText={(value: string) =>
                setItem({ ...item, height: value })
              }
              keyboardType="number-pad"
              returnKeyType="next"
              onSubmitEditing={() => weightRef.current?.focus()}
            />

            <View style={[commonStyles.center, styles.cmContainer]}>
              <Typo size={12}>in cm</Typo>
            </View>
          </View>

          <View style={{ marginTop: verticalScale(10) }}>
            <Input
              inputRef={weightRef}
              placeholder="Weight (in kg)"
              keyboardType="numeric"
              value={item.weight.toString()}
              onChangeText={(value: string) =>
                setItem({ ...item, weight: value })
              }
              returnKeyType="done"
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={buttonLabel}
            onPress={() => {
              const added = onConfirm(item);
              if (added) {
                setItem({
                  itemName: "",
                  length: "",
                  width: "",
                  height: "",
                  unit: "",
                  weight: "",
                });
              }
            }}
            isLoading={isLoading}
          />
        </View>
      </BottomSheetScrollView>
    </KeyboardAvoidingView>
  );
};

export default PickAndDropItemSheet;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: scale(20),
    marginVertical: verticalScale(20),
  },
  header: {
    paddingBottom: verticalScale(10),
    borderBottomWidth: 1,
    borderBottomColor: colors.NEUTRAL350,
  },
  contentContainer: {
    gap: spacingY._10,
    marginTop: verticalScale(20),
  },
  dropdown: {
    height: verticalScale(45),
    borderColor: colors.NEUTRAL300,
    backgroundColor: colors.WHITE,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: scale(10),
    marginVertical: verticalScale(10),
  },
  rowContainer: {
    marginVertical: verticalScale(10),
  },
  cmContainer: {
    width: scale(50),
    borderColor: colors.NEUTRAL300,
    paddingVertical: verticalScale(12),
  },
  buttonContainer: {
    paddingVertical: verticalScale(20),
  },
});
