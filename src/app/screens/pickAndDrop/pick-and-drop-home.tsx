import { StyleSheet, View } from "react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import Typo from "@/components/Typo";
import { colors, radius, spacingX } from "@/constants/theme";
import Button from "@/components/Button";
import { scale, verticalScale } from "@/utils/styling";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  SCREEN_WIDTH,
} from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import PickAndDropBottomSheet from "@/components/BottomSheets/pickAndDrop/pick-and-drop-bottomsheet";
import { commonStyles } from "@/constants/commonStyles";
import {
  customOrderDetails,
  pickAndDropHomeImages,
  pickAndDropSubtexts,
} from "@/utils/defaultData";
import { useMutation } from "@tanstack/react-query";
import { initializePickAndDrop } from "@/service/pickandDropService";
import { Audio, AVPlaybackStatusSuccess } from "expo-av";

const PickAndDropHome = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const imageOffset = useSharedValue(-300);
  const textOffset = useSharedValue(300);

  const indexRef = useRef(0);
  const infoSheetRef = useRef<BottomSheet>(null);

  const InfoSnapPoints = useMemo(() => ["55%"], []);

  useEffect(() => {
    const cycleImages = () => {
      const nextIndex = (indexRef.current + 1) % pickAndDropHomeImages.length;
      indexRef.current = nextIndex;
      setCurrentIndex(nextIndex);

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

    cycleImages();

    const interval = setInterval(cycleImages, 3000);
    return () => clearInterval(interval);
  }, []);

  const animatedImageStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: imageOffset.value }],
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: textOffset.value }],
  }));

  const initializeMutation = useMutation({
    mutationKey: ["initialize-cart"],
    mutationFn: initializePickAndDrop,
    onSuccess: (res) => {
      if (res) {
        router.push({
          pathname: "/screens/pickAndDrop/Pick-and-Drop_ordering",
        });
      }
    },
  });

  const playOrStopSound = async () => {
    try {
      if (sound && isPlaying) {
        await stopSound();
      } else {
        const { sound: newSound } = await Audio.Sound.createAsync(
          {
            uri: "https://firebasestorage.googleapis.com/v0/b/famto-aa73e.appspot.com/o/voices%2FPick%20and%20drop.mp3?alt=media&token=09ccd097-3acf-4f91-8778-39b469ea9096",
          },
          { shouldPlay: true }
        );

        setSound(newSound);
        setIsPlaying(true);

        newSound.setOnPlaybackStatusUpdate((status) => {
          if (
            status.isLoaded &&
            (status as AVPlaybackStatusSuccess).didJustFinish
          ) {
            stopSound();
          }
        });
      }
    } catch (error) {
      console.error("Error playing/stopping sound:", error);
    }
  };

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
    }
  };

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        style={[props.style, commonStyles.backdrop]}
      />
    ),
    []
  );

  return (
    <>
      <ScreenWrapper>
        <Header
          title="Pick & Drop"
          icon={require("@/assets/icons/info-circle.webp")}
          onPress={() => infoSheetRef.current?.expand()}
          showRightIcon
        />

        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Animated.Image
            source={pickAndDropHomeImages[currentIndex].source}
            style={[styles.image, animatedImageStyle]}
            resizeMode="contain"
          />

          <Animated.View style={[styles.textContainer, animatedTextStyle]}>
            <Typo size={15} fontFamily="SemiBold" color={colors.NEUTRAL900}>
              {pickAndDropHomeImages[currentIndex].text}
            </Typo>

            <Typo
              size={13}
              color={colors.NEUTRAL400}
              style={{ textAlign: "center" }}
            >
              {pickAndDropSubtexts[currentIndex]}
            </Typo>
          </Animated.View>
        </View>

        <View style={styles.detailContainer}>
          <Typo
            size={14}
            fontFamily="Medium"
            color={colors.NEUTRAL900}
            style={{ paddingBottom: verticalScale(15) }}
          >
            Things to remember
          </Typo>

          {customOrderDetails?.map((detail, index) => (
            <View key={index} style={styles.detail}>
              <Typo>•</Typo>
              <Typo size={13}>{detail}</Typo>
            </View>
          ))}
        </View>

        <Button
          title="Place your order"
          onPress={() => initializeMutation.mutate()}
          isLoading={initializeMutation.isPending}
          style={styles.button}
        />
      </ScreenWrapper>

      <BottomSheet
        ref={infoSheetRef}
        index={-1}
        snapPoints={InfoSnapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        onClose={stopSound}
      >
        <PickAndDropBottomSheet
          closeSheet={() => {
            stopSound();
            infoSheetRef.current?.close();
          }}
          playSound={playOrStopSound}
          isPlaying={isPlaying}
        />
      </BottomSheet>
    </>
  );
};

export default PickAndDropHome;

const styles = StyleSheet.create({
  image: {
    width: scale(300),
    height: verticalScale(300),
    alignSelf: "center",
  },
  textContainer: {
    alignItems: "center",
    marginVertical: scale(5),
  },
  detailContainer: {
    backgroundColor: colors.NEUTRAL100,
    marginHorizontal: scale(20),
    marginTop: verticalScale(20),
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(20),
    borderRadius: radius._10,
  },
  detail: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(10),
    gap: spacingX._10,
  },
  button: {
    marginVertical: verticalScale(30),
    alignSelf: "center",
    width: SCREEN_WIDTH * 0.9,
  },
});
