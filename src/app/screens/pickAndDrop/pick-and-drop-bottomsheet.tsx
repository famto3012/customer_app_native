import React, { useCallback, useMemo, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import BottomSheet, {
  BottomSheetScrollView,
  SCREEN_WIDTH,
} from "@gorhom/bottom-sheet";
import Typo from "@/components/Typo";
import { colors } from "@/constants/theme";
import Button from "@/components/Button";
import { scale } from "@/utils/styling";

const PickAndDropBottomSheet = ({
  bottomSheetRef,
}: {
  bottomSheetRef: any;
}) => {
  const handleClose = () => {
    bottomSheetRef.current?.close();
  };

  return (
    <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerContainer}>
        <Typo size={15} fontFamily="SemiBold" color={colors.NEUTRAL900}>
          Pick and Drop?
        </Typo>
        <TouchableOpacity>
          <Image
            source={require("@/assets/icons/volume-high.webp")}
            style={styles.volumeIcon}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />
      <Typo size={13} color={colors.NEUTRAL400} style={styles.text}>
        Hire a delivery boy that will do your errand jobs of {"\n"}Pickup & Drop
        in your nearby area.{"\n"}
        Eg: You ordered a cake from a nearby bakery and want someone to pick it
        up for you as you are busy in arrangements of party. The delivery boy
        will do the task for you. He will go to the Bakery as per the
        instructions you listed in App and pickup the cake that you already paid
        for earlier. And deliver at your home.{"\n"}
        You as a user will be able to see the location of the delivery Boy on
        map in real time so you know where he is all the time while working on
        your tasks.
      </Typo>
      <Button title="Ok, got it!" onPress={handleClose} style={styles.button} />
    </BottomSheetScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: scale(20),
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: scale(8),
  },
  volumeIcon: {
    width: scale(24),
    height: scale(24),
    marginLeft: scale(10),
  },
  divider: {
    marginTop: scale(10),
    marginBottom: scale(15),
    height: 1,
    backgroundColor: colors.NEUTRAL600,
    opacity: 0.5,
  },
  text: {
    lineHeight: 28,
  },
  button: {
    marginTop: scale(20),
    alignSelf: "center",
    width: SCREEN_WIDTH * 0.9,
  },
});

export default PickAndDropBottomSheet;
