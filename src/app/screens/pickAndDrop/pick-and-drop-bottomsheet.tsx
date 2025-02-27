
import React, { useCallback, useMemo, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Typo from "@/components/Typo";
import { colors } from "@/constants/theme";
import Button from "@/components/Button";
import { scale } from "@/utils/styling";

const PickAndDropBottomSheet = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);

  const handleSheetChange = useCallback((index: number) => {
    console.log("BottomSheet index:", index);
  }, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={2}
      snapPoints={snapPoints}
      onChange={handleSheetChange}
    >
      <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Typo size={14} fontWeight={700} color={colors.BLACK}>
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
        <Typo size={15} color={colors.BLACK} style={styles.text}>
          Hire a delivery boy that will do your errand jobs of {"\n"}Pickup & Drop in your nearby area.{"\n"}
          Eg: You ordered a cake from a nearby bakery and want someone to pick it up for you as you are busy in arrangements of party.
          The delivery boy will do the task for you. He will go to the Bakery as per the instructions you listed in App and pickup the cake that you already paid for earlier.
          And deliver at your home.{"\n"}
          You as a user will be able to see the location of the delivery Boy on map in real time so you know where he is all the time while working on your tasks.
        </Typo>
        <Button
          title="Ok, got it!"
          onPress={() => console.log("Button pressed")}
          style={styles.button}
        />
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  volumeIcon: {
    width: scale(24),
    height: scale(24),
    marginLeft: 10,
  },
  divider: {
    marginTop: 20,
    marginBottom: 20,
    height: 1,
    backgroundColor: colors.BLACK,
    opacity: 0.5,
  },
  text: {
    lineHeight: 28,
  },
  button: {
    marginTop: 20,
    alignSelf: "center",
    width: "90%",
  },
});

export default PickAndDropBottomSheet;
