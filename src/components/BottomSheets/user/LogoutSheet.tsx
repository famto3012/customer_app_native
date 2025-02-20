import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { FC } from "react";
import { scale, verticalScale } from "@/utils/styling";
import Typo from "@/components/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";

interface LogoutProps {
  onCancel: () => void;
  onConfirm: () => void;
}

const LogoutSheet: FC<LogoutProps> = ({ onCancel, onConfirm }) => {
  return (
    <View style={styles.container}>
      <View style={{ gap: spacingY._12 }}>
        <Typo size={15} fontFamily="SemiBold" color={colors.NEUTRAL900}>
          Logout?
        </Typo>
        <Typo size={13} color={colors.NEUTRAL400}>
          ok bye! Are you sure you want to leave
        </Typo>
      </View>

      <View style={styles.btnContainer}>
        <TouchableOpacity
          onPress={onCancel}
          style={[styles.btn, { backgroundColor: colors.PRIMARY }]}
        >
          <Typo size={14} color={colors.WHITE}>
            Cancel
          </Typo>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onConfirm}
          style={[styles.btn, { backgroundColor: colors.LIGHT_RED }]}
        >
          <Typo size={14} color={colors.RED}>
            Confirm
          </Typo>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LogoutSheet;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(20),
    flex: 1,
  },
  btnContainer: {
    marginTop: "auto",
    marginBottom: verticalScale(40),
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._12,
  },
  btn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: verticalScale(13),
    borderRadius: radius._30,
  },
});
