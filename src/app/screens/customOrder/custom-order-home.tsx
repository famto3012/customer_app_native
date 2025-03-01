import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useMemo, useRef } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from "@gorhom/bottom-sheet";
import { scale } from "@/utils/styling";
import { colors } from "@/constants/theme";
import Button from "@/components/Button";
import { router } from "expo-router";
import Typo from "@/components/Typo";
import { Info } from "phosphor-react-native";
import CustomOrderBottomSheet from "../../../components/BottomSheets/customOrder/CustomOrderBottomSheet";
import CustomOrderLocationBottomSheet from "@/components/BottomSheets/customOrder/CustomOrderLocationBottomSheet";
const CustomOrderHome = () => {
  const bottomSheetInfoRef = useRef<BottomSheet>(null);
  const variantSheetInfoSnapPoints = useMemo(() => {
    const percentageHeight = SCREEN_HEIGHT * 0.55; // 50% of screen height
    return [percentageHeight];
  }, []);
  const bottomSheetLocationRef = useRef<BottomSheet>(null);
  const variantSheetLocationSnapPoints = useMemo(() => {
    const percentageHeight = SCREEN_HEIGHT * 0.2; // 50% of screen height
    return [percentageHeight];
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        style={[props.style, styles.backdrop]}
        // onPress={handleClosePress}
      />
    ),
    []
  );
  return (
    <>
      <ScreenWrapper>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Header title={"Custom Order"} />
          <Pressable onPress={() => bottomSheetInfoRef.current?.expand()}>
            <Info
              size={26}
              style={{ marginLeft: scale(-60), paddingRight: scale(60) }}
            />
          </Pressable>
        </View>

        <View style={styles.animationWrapper}>
          <Image
            source={require("@/assets/images/custom-order-banner.webp")}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <View style={styles.animationWrapperText}>
          <View style={styles.textContainer}>
            <Typo size={15} fontFamily="SemiBold" color={colors.NEUTRAL900}>
              Shop not found on our list
            </Typo>
            <Typo
              size={13}
              color={colors.NEUTRAL400}
              style={{ textAlign: "center" }}
            >
              Pinpoint the location on map
            </Typo>
          </View>
        </View>
        <View style={styles.reminderContainer}>
          <Typo size={14} fontFamily="Medium" color={colors.NEUTRAL900}>
            Things to remember
          </Typo>

          <View style={styles.bulletContainer}>
            <View style={styles.bulletPoint}>
              <Typo size={12} color={colors.NEUTRAL400}>
                • Sending high-value or fragile products should
              </Typo>
              <Typo
                size={12}
                color={colors.NEUTRAL400}
                style={{ marginLeft: scale(9) }}
              >
                be avoided.
              </Typo>
            </View>
            <View style={styles.bulletPoint}>
              <Typo size={12} color={colors.NEUTRAL400}>
                • Items should fit inside the backpack.
              </Typo>
            </View>
            <View style={styles.bulletPoint}>
              <Typo size={12} color={colors.NEUTRAL400}>
                • Transporting illegal goods is prohibited.
              </Typo>
            </View>
          </View>
        </View>

        <Button
          title="Place your order"
          onPress={() => bottomSheetLocationRef.current?.expand()}
          style={styles.button}
        />
      </ScreenWrapper>
      <BottomSheet
        ref={bottomSheetInfoRef}
        index={-1}
        snapPoints={variantSheetInfoSnapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <CustomOrderBottomSheet bottomSheetRef={bottomSheetInfoRef} />
      </BottomSheet>
      <BottomSheet
        ref={bottomSheetLocationRef}
        index={-1}
        snapPoints={variantSheetLocationSnapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <CustomOrderLocationBottomSheet />
      </BottomSheet>
    </>
  );
};

export default CustomOrderHome;

const styles = StyleSheet.create({
  image: {
    marginTop: scale(30),
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_HEIGHT * 0.45,
    borderRadius: 10,
    alignSelf: "center",
  },
  textContainer: {
    alignItems: "center",
    marginTop: scale(5),
  },
  reminderContainer: {
    marginTop: scale(40),
    padding: 20,
    backgroundColor: colors.NEUTRAL100,
    borderRadius: 20,
    width: SCREEN_WIDTH * 0.9,
    alignSelf: "center",
  },
  bulletContainer: {
    marginTop: scale(15),
  },
  bulletPoint: {
    alignItems: "flex-start",
    marginBottom: 5,
  },
  button: {
    marginTop: scale(30),
    alignSelf: "center",
    width: SCREEN_WIDTH * 0.9,
  },
  animationWrapper: {
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_HEIGHT * 0.45,
    overflow: "hidden",
    alignSelf: "center",
    borderRadius: 10,
  },
  animationWrapperText: {
    width: SCREEN_WIDTH * 0.7,
    height: SCREEN_HEIGHT * 0.1,
    overflow: "hidden",
    alignSelf: "center",
    borderRadius: 10,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 1)",
  },
});
