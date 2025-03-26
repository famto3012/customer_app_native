import { Image, StyleSheet, View } from "react-native";
import { FC } from "react";
import { BottomSheetScrollView, SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import Typo from "@/components/Typo";
import { colors } from "@/constants/theme";
import { TouchableOpacity } from "react-native";
import Button from "@/components/Button";
import { scale } from "@/utils/styling";

const CustomOrderBottomSheet: FC<{
  closeSheet: () => void;
  playSound: () => void;
  isPlaying: boolean;
}> = ({ closeSheet, playSound, isPlaying }) => {
  return (
    <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerContainer}>
        <Typo size={15} fontFamily="SemiBold" color={colors.NEUTRAL900}>
          Custom Order?
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

      <View style={styles.divider} />

      <Typo size={13} color={colors.NEUTRAL400} style={styles.text}>
        Order anything from any nearby Store. The delivery boy will shop for you
        and deliver to your door steps.
      </Typo>

      <Typo
        size={13}
        color={colors.NEUTRAL400}
        style={{ marginTop: scale(20), textAlign: "justify", lineHeight: 20 }}
      >
        Eg : You may want to order Water Bottle, Cold Drink, snacks for a quick
        party you may have arranged. You can select a Store from your nearby
        area on the App and put all order detail. The service provider will
        receive order and will go to your selected store and handpick all items.
        He will confirm price and detail with you and then purchase the items
        and deliver to your home instantly. You will be able to see his location
        in real time on map while he is bringing items to your home.
      </Typo>

      <View style={{ marginTop: scale(8) }}>
        <Button
          title="Ok, got it!"
          onPress={closeSheet}
          style={styles.button}
        />
      </View>
    </BottomSheetScrollView>
  );
};

export default CustomOrderBottomSheet;

const styles = StyleSheet.create({
  contentContainer: {
    padding: scale(20),
    flex: 1,
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
    lineHeight: 20,
  },
  button: {
    marginTop: scale(20),
    width: SCREEN_WIDTH * 0.9,
  },
});
