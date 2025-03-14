import { View, TextInput, StyleSheet } from "react-native";
import React from "react";
import { verticalScale } from "@/utils/styling";
import { colors, radius, spacingX } from "@/constants/theme";
import { InputProps } from "@/types";

const Input = ({ inputRef, ...props }: InputProps) => {
  return (
    <View style={styles.container}>
      <TextInput
        ref={inputRef} // Set the ref here
        style={styles.input}
        placeholderTextColor={colors.NEUTRAL400}
        {...props}
      />
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: verticalScale(45),
    alignSelf: "center",
    borderWidth: 1,
    borderColor: colors.NEUTRAL300,
    borderRadius: radius._10,
    paddingHorizontal: spacingX._15,
    flex: 1,
  },
  input: {
    color: colors.NEUTRAL600,
    fontSize: verticalScale(15),
    flex: 1,
  },
});
