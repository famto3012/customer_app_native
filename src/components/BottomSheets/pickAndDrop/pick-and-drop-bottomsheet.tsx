import { FC } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { BottomSheetScrollView, SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import Typo from "@/components/Typo";
import { colors } from "@/constants/theme";
import Button from "@/components/Button";
import { scale, verticalScale } from "@/utils/styling";

const PickAndDropBottomSheet: FC<{
  closeSheet: () => void;
  playSound: () => void;
  isPlaying: boolean;
}> = ({ closeSheet, playSound, isPlaying }) => {
  return (
    <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerContainer}>
        <Typo size={15} fontFamily="SemiBold" color={colors.NEUTRAL900}>
          Pick and Drop?
        </Typo>

        <TouchableOpacity onPress={playSound}>
          <Image
            source={
              isPlaying
                ? require("@/assets/icons/volume-slash.webp")
                : require("@/assets/icons/volume-high.webp")
            }
            style={styles.volumeIcon}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>

      <Typo size={13} color={colors.NEUTRAL400} style={styles.text}>
        Hire a delivery boy that will do your errand jobs of Pickup & Drop in
        your nearby area. Eg: You ordered a cake from a nearby bakery and want
        someone to pick it up for you as you are busy in arrangements of party.
        The delivery boy will do the task for you. He will go to the Bakery as
        per the instructions you listed in App and pickup the cake that you
        already paid for earlier. And deliver at your home. You as a user will
        be able to see the location of the delivery Boy on map in real time so
        you know where he is all the time while working on your tasks.
      </Typo>

      <Button title="Ok, got it!" onPress={closeSheet} style={styles.button} />
    </BottomSheetScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: scale(20),
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: verticalScale(10),
    borderBottomWidth: 0.6,
    paddingBottom: verticalScale(15),
    borderBottomColor: colors.NEUTRAL400,
  },
  volumeIcon: {
    width: scale(24),
    height: scale(24),
    marginLeft: scale(10),
  },
  text: {
    lineHeight: 24,
    flex: 2,
    textAlign: "justify",
  },
  button: {
    marginTop: scale(20),
    alignSelf: "center",
    width: SCREEN_WIDTH * 0.9,
  },
});

export default PickAndDropBottomSheet;
