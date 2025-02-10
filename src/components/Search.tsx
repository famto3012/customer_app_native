import { StyleSheet, TextInput, View } from "react-native";
import React from "react";
import { MagnifyingGlass } from "phosphor-react-native";
import { scale, verticalScale } from "@/utils/styling";
import { colors, radius } from "@/constants/theme";
import { SearchProps } from "@/types";

const Search = ({ placeHolder, onChangeText }: SearchProps) => {
  return (
    <View style={styles.container}>
      <MagnifyingGlass size={24} color={colors.PRIMARY} />
      <TextInput
        style={styles.input}
        placeholder={placeHolder}
        placeholderTextColor={colors.NEUTRAL400}
        onChangeText={onChangeText}
      />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: scale(20),
    marginTop: verticalScale(24),
    borderWidth: 1,
    padding: scale(10),
    borderRadius: radius._10,
    borderColor: colors.NEUTRAL300,
    flexDirection: "row",
    alignItems: "center",
    height: verticalScale(45),
  },
  input: {
    flex: 1,
    marginLeft: scale(5),
    fontSize: scale(14),
    color: colors.NEUTRAL600,
    height: verticalScale(45),
  },
});
