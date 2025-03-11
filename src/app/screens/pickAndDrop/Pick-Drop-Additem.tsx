
import { StyleSheet, View, TextInput, TouchableOpacity } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { colors, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import { FC, useRef, useState } from "react";
import { CustomCartBill } from "@/types";
import Typo from "@/components/Typo";
import { Dropdown } from "react-native-element-dropdown";
import Button from "@/components/Button";

const Pickdropadditem: FC<{ data: CustomCartBill }> = ({ data }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [value, setValue] = useState<string | null>(null);
  const [weight, setWeight] = useState<string>("");

  const choices = ["Length", "Width", "Height", "in cm"];

  const items = [
    { label: "Select item type", value: null },
    { label: "Fragile", value: "fragile" },
    { label: "Documents", value: "documents" },
    { label: "Electronics", value: "electronics" },
    { label: "Clothing", value: "clothing" },
  ];

  const handleConfirm = () => {
    console.log({
      itemType: value, 
      packageSpec: selectedChoice, 
      weight,
    });
  };

  return (
    <BottomSheet ref={bottomSheetRef} index={1} snapPoints={["50%", "80%"]}>
      <BottomSheetScrollView style={styles.container}>
        <Typo size={15} fontFamily="SemiBold" color={colors.PRIMARY} style={styles.header}>
          Add item
        </Typo>

        <View style={styles.contentContainer}>
          <View style={styles.field}>
            <Typo size={14} color={colors.NEUTRAL800}>Package Details</Typo>
          </View>
          <Dropdown
            data={items}
            labelField="label"
            valueField="value"
            placeholder="Select item type"
            value={value}
            onChange={(data) => setValue(data.value)}
            style={styles.dropdown}
            placeholderStyle={{ fontSize: 16, color: colors.NEUTRAL500 }}
          />

          <View style={styles.field}>
            <Typo size={14} color={colors.NEUTRAL800}>Package specifications</Typo>
          </View>
          <View style={styles.rowContainer}>
            {choices.map((choice, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.choiceChip, selectedChoice === choice && styles.choiceChipSelected]}
                onPress={() => setSelectedChoice(choice)}
              >
                <Typo size={14} color={selectedChoice === choice ? colors.PRIMARY : colors.NEUTRAL800}>
                  {choice}
                </Typo>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.input} 
              placeholder="Weight (in kg)" 
              keyboardType="numeric" 
              placeholderTextColor={colors.NEUTRAL500} 
              value={weight}
              onChangeText={setWeight} 
            />
          </View>
          <Button title="Confirm" onPress={handleConfirm} />
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

export default Pickdropadditem;

const styles = StyleSheet.create({
  container: {
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
  field: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: verticalScale(10),
  },
  choiceChip: {
    paddingHorizontal: scale(15),
    paddingVertical: verticalScale(10),
    borderWidth: 1,
    borderColor: colors.NEUTRAL300,
    borderRadius: 10,
    backgroundColor: colors.NEUTRAL100,
    alignItems: "center",
    justifyContent: "center",
  },
  choiceChipSelected: {
    backgroundColor: colors.PRIMARY_LIGHT,
    borderColor: colors.PRIMARY,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: colors.NEUTRAL300,
    borderRadius: 8,
    paddingHorizontal: scale(10),
    height: verticalScale(40),
    justifyContent: "center",
  },
  input: {
    fontSize: 14,
    color: colors.NEUTRAL800,
  },
});