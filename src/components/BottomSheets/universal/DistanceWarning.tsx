import { Image, StyleSheet, View } from "react-native";
import { FC } from "react";
import Typo from "@/components/Typo";
import { scale, verticalScale } from "@/utils/styling";
import { colors, spacingX } from "@/constants/theme";
import Button from "@/components/Button";

const DistanceWarning: FC<{ closeDistanceWarningSheet: () => void }> = ({
  closeDistanceWarningSheet,
}) => {
  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/distance-warning.webp")}
        style={{
          width: scale(200),
          height: verticalScale(200),
        }}
        resizeMode="contain"
      />
      <Typo size={15} fontFamily="SemiBold" color={colors.NEUTRAL900}>
        You are ordering from far away
      </Typo>
      <Typo size={13}>Might take longer delivery time</Typo>
      <View style={styles.buttonContainer}>
        <Button
          title="Continue to Order"
          onPress={closeDistanceWarningSheet}
          style={{ flex: 1, marginVertical: verticalScale(20) }}
        />
      </View>
    </View>
  );
};

export default DistanceWarning;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(20),
    marginVertical: verticalScale(20),
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    borderBottomWidth: 0.6,
    paddingBottom: verticalScale(10),
    borderBottomColor: colors.NEUTRAL350,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: spacingX._10,
    marginTop: "auto",
  },
});
