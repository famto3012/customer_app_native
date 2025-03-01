import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import Typo from "@/components/Typo";
import { colors } from "@/constants/theme";
import Button from "@/components/Button";
import { scale } from "@/utils/styling";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from "@gorhom/bottom-sheet";

import { Info } from "phosphor-react-native";
import { router } from "expo-router";
import PickAndDropBottomSheet from "@/components/BottomSheets/pickAndDrop/pick-and-drop-bottomsheet";
import { commonStyles } from "@/constants/commonStyles";

const images = [
  {
    source: require("@/assets/images/Pick-and-drop-home.webp"),
    text: "Forgot something at home?",
  },
  {
    source: require("@/assets/images/Pick-and-drop-home1.webp"),
    text: "Delivery boys available anytime",
  },
  {
    source: require("@/assets/images/location-permission.webp"),
    text: "Fast and safe delivery",
  },
];

const subtexts = [
  "Give us a pickup address",
  "Our delivery agents are at your service",
  "We ensure safe and fast delivery everytime",
];

const PickAndDropHome = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const imageOffset = useSharedValue(-300);
  const textOffset = useSharedValue(300);
  const indexRef = useRef(0);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const variantSheetSnapPoints = useMemo(() => ["50%"], []);

  useEffect(() => {
    const cycleImages = () => {
      // Compute the next index
      const nextIndex = (indexRef.current + 1) % images.length;
      indexRef.current = nextIndex; // Update the ref
      setCurrentIndex(nextIndex); // Update state BEFORE animation starts

      const isLeftToRight = nextIndex % 2 === 0;

      imageOffset.value = withTiming(
        isLeftToRight ? -300 : 300,
        { duration: 500 },
        () => {
          imageOffset.value = isLeftToRight ? 300 : -300;
          imageOffset.value = withTiming(0, { duration: 500 });
        }
      );

      textOffset.value = withTiming(
        isLeftToRight ? 300 : -300,
        { duration: 500 },
        () => {
          textOffset.value = isLeftToRight ? -300 : 300;
          textOffset.value = withTiming(0, { duration: 500 });
        }
      );
    };

    cycleImages(); // Start animation immediately

    const interval = setInterval(cycleImages, 3000);
    return () => clearInterval(interval);
  }, []);

  const animatedImageStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: imageOffset.value }],
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: textOffset.value }],
  }));

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        style={[props.style, commonStyles.backdrop]}
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
          <Header title={"Pick & Drop"} />
          <Pressable onPress={() => bottomSheetRef.current?.expand()}>
            <Info
              size={32}
              style={{ marginLeft: scale(-60), paddingRight: scale(60) }}
            />
          </Pressable>
        </View>

        <View style={styles.animationWrapper}>
          <Animated.Image
            source={images[currentIndex].source}
            style={[styles.image, animatedImageStyle]}
            resizeMode="contain"
          />
        </View>
        <View style={styles.animationWrapperText}>
          <Animated.View style={[styles.textContainer, animatedTextStyle]}>
            <Typo size={15} fontFamily="SemiBold" color={colors.NEUTRAL900}>
              {images[currentIndex].text}
            </Typo>
            <Typo
              size={13}
              color={colors.NEUTRAL400}
              style={{ textAlign: "center" }}
            >
              {subtexts[currentIndex]}
            </Typo>
          </Animated.View>
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
          onPress={() => {
            router.push({
              pathname: "/screens/pickAndDrop/Pick-and-Drop_ordering",
            });
          }}
          style={styles.button}
        />
      </ScreenWrapper>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={variantSheetSnapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <PickAndDropBottomSheet bottomSheetRef={bottomSheetRef} />
      </BottomSheet>
    </>
  );
};

export default PickAndDropHome;

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
});
