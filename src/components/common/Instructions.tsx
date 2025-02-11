import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { scale, verticalScale } from "@/utils/styling";
import { Microphone } from "phosphor-react-native";
import { colors, radius, spacingX } from "@/constants/theme";
import Input from "../Input";

const Instructions = () => {
  return (
    <View style={styles.container}>
      <Input placeholder="Instructions (if any)" />
      <TouchableOpacity style={styles.micContainer}>
        <Microphone color={colors.WHITE} />
      </TouchableOpacity>
    </View>
  );
};

export default Instructions;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(20),
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
  },
  micContainer: {
    height: verticalScale(45),
    backgroundColor: colors.PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: scale(10),
    borderRadius: radius._10,
  },
});
