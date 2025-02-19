import { StyleSheet, View, TextInput } from "react-native";
import React, { FC } from "react";
import { colors, radius } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import Typo from "../Typo";

interface UserEditInputProps {
  label: string;
  value: string;
  onChangeText: (data: string) => void;
  disabled?: boolean;
}

const Input: FC<UserEditInputProps> = ({
  label,
  value,
  onChangeText,
  disabled = false,
}) => {
  return (
    <View style={[styles.container]}>
      <Typo size={13} style={styles.label} color={colors.NEUTRAL600}>
        {label}
      </Typo>
      <TextInput
        onChangeText={disabled ? undefined : onChangeText}
        value={value}
        style={[styles.input, disabled && styles.disabledText]}
        editable={!disabled}
        selectTextOnFocus={!disabled}
      />
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: radius._10,
    borderColor: colors.NEUTRAL300,
    height: verticalScale(50),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(10),
    position: "relative",
    backgroundColor: colors.WHITE,
  },
  disabledContainer: {
    backgroundColor: colors.NEUTRAL200,
    borderColor: colors.NEUTRAL400,
  },
  label: {
    position: "absolute",
    top: -11,
    left: 15,
    backgroundColor: colors.WHITE,
    paddingHorizontal: scale(3),
  },
  input: {
    flex: 1,
    fontSize: scale(14),
    fontFamily: "Medium",
    marginBottom: scale(-3),
    color: colors.BLACK,
  },
  disabledText: {
    color: colors.NEUTRAL500,
  },
});
