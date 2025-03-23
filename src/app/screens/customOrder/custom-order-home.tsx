// import { Image, StyleSheet, View } from "react-native";
// import { useCallback, useMemo, useRef } from "react";
// import ScreenWrapper from "@/components/ScreenWrapper";
// import Header from "@/components/Header";
// import BottomSheet, {
//   BottomSheetBackdrop,
//   BottomSheetBackdropProps,
//   SCREEN_HEIGHT,
// } from "@gorhom/bottom-sheet";
// import { scale, verticalScale } from "@/utils/styling";
// import { colors, radius, spacingX } from "@/constants/theme";
// import Button from "@/components/Button";
// import Typo from "@/components/Typo";
// import CustomOrderBottomSheet from "../../../components/BottomSheets/customOrder/CustomOrderBottomSheet";
// import CustomOrderLocationBottomSheet from "@/components/BottomSheets/customOrder/CustomOrderLocationBottomSheet";
// import { commonStyles } from "@/constants/commonStyles";
// import { customOrderDetails } from "@/utils/defaultData";

// const CustomOrderHome = () => {
//   const infoSheetRef = useRef<BottomSheet>(null);
//   const locationSheetRef = useRef<BottomSheet>(null);

//   const InfoSnapPoints = useMemo(() => ["55%"], []);
//   const locationSnapPoints = useMemo(() => ["25%"], []);

//   const closeInfo = () => infoSheetRef.current?.close();
//   const closeLocation = () => locationSheetRef.current?.close();

//   const renderBackdrop = useCallback(
//     (props: BottomSheetBackdropProps) => (
//       <BottomSheetBackdrop
//         {...props}
//         disappearsOnIndex={-1}
//         appearsOnIndex={0}
//         opacity={0.5}
//         style={[props.style, commonStyles.backdrop]}
//       />
//     ),
//     []
//   );

//   return (
//     <>
//       <ScreenWrapper>
//         <Header
//           title="Custom Order"
//           icon={require("@/assets/icons/info-circle.webp")}
//           onPress={() => infoSheetRef.current?.expand()}
//           showRightIcon
//         />

//         <View
//           style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
//         >
//           <Image
//             source={require("@/assets/images/custom-order-banner.webp")}
//             style={styles.image}
//             resizeMode="contain"
//           />

//           <Typo size={15} fontFamily="SemiBold" color={colors.NEUTRAL900}>
//             Shop not found on our list
//           </Typo>
//           <Typo
//             size={13}
//             color={colors.NEUTRAL400}
//             style={{ paddingTop: verticalScale(6) }}
//           >
//             Pinpoint the location on map
//           </Typo>
//         </View>

//         <View style={styles.detailContainer}>
//           <Typo
//             size={14}
//             fontFamily="Medium"
//             color={colors.NEUTRAL900}
//             style={{ paddingBottom: verticalScale(15) }}
//           >
//             Things to remember
//           </Typo>

//           {customOrderDetails?.map((detail, index) => (
//             <View key={index} style={styles.detail}>
//               <Typo>•</Typo>
//               <Typo size={13}>{detail}</Typo>
//             </View>
//           ))}
//         </View>

//         <View style={styles.button}>
//           <Button
//             title="Place your order"
//             onPress={() => locationSheetRef.current?.expand()}
//           />
//         </View>
//       </ScreenWrapper>

//       <BottomSheet
//         ref={infoSheetRef}
//         index={-1}
//         snapPoints={InfoSnapPoints}
//         enableDynamicSizing={false}
//         enablePanDownToClose
//         backdropComponent={renderBackdrop}
//       >
//         <CustomOrderBottomSheet />
//       </BottomSheet>

//       <BottomSheet
//         ref={locationSheetRef}
//         index={-1}
//         snapPoints={locationSnapPoints}
//         enableDynamicSizing={false}
//         enablePanDownToClose
//         backdropComponent={renderBackdrop}
//       >
//         <CustomOrderLocationBottomSheet onPress={closeLocation} />
//       </BottomSheet>
//     </>
//   );
// };

// export default CustomOrderHome;

// const styles = StyleSheet.create({
//   image: {
//     width: scale(300),
//     height: verticalScale(300),
//     borderRadius: radius._10,
//     alignSelf: "center",
//   },
//   detailContainer: {
//     backgroundColor: colors.NEUTRAL100,
//     marginHorizontal: scale(20),
//     marginTop: verticalScale(20),
//     paddingHorizontal: scale(20),
//     paddingVertical: verticalScale(20),
//     borderRadius: radius._10,
//   },
//   detail: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: verticalScale(10),
//     gap: spacingX._10,
//   },
//   button: {
//     marginVertical: verticalScale(30),
//     marginHorizontal: scale(20),
//   },
// });
import { Image, StyleSheet, View, AppState, BackHandler } from "react-native";
import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from "@gorhom/bottom-sheet";
import { scale, verticalScale } from "@/utils/styling";
import { colors, radius, spacingX } from "@/constants/theme";
import Button from "@/components/Button";
import Typo from "@/components/Typo";
import CustomOrderBottomSheet from "../../../components/BottomSheets/customOrder/CustomOrderBottomSheet";
import CustomOrderLocationBottomSheet from "@/components/BottomSheets/customOrder/CustomOrderLocationBottomSheet";
import { commonStyles } from "@/constants/commonStyles";
import { customOrderDetails } from "@/utils/defaultData";
import { Audio, AVPlaybackStatusSuccess } from "expo-av";
import { useFocusEffect } from "expo-router";
import { useNavigation } from "@react-navigation/native";

// Global audio reference - will ensure we only have one audio instance
let GLOBAL_SOUND: Audio.Sound | null = null;

const CustomOrderHome = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const infoSheetRef = useRef<BottomSheet>(null);
  const locationSheetRef = useRef<BottomSheet>(null);
  const isNavigatingRef = useRef(false);

  const InfoSnapPoints = useMemo(() => ["55%"], []);
  const locationSnapPoints = useMemo(() => ["25%"], []);
  const navigation = useNavigation();

  // Ultra aggressive sound cleanup - works even if the component state is stale
  const forceAudioCleanup = async () => {
    console.log("🔴 FORCE AUDIO CLEANUP");

    try {
      // Force set our state regardless of what happens with the actual cleanup
      setIsPlaying(false);

      // If we have a reference to the global sound
      if (GLOBAL_SOUND) {
        try {
          console.log("Attempting force pause");
          await GLOBAL_SOUND.pauseAsync().catch(() => {});

          console.log("Attempting force stop");
          await GLOBAL_SOUND.stopAsync().catch(() => {});

          console.log("Attempting force unload");
          await GLOBAL_SOUND.unloadAsync().catch(() => {});
        } catch (e) {
          console.log("Caught error during force cleanup:", e);
        }

        // Clear the global reference
        GLOBAL_SOUND = null;
      }

      // Try to set volume to 0 on the Audio module directly (as a last resort)
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: false,
          staysActiveInBackground: false,
          shouldDuckAndroid: false,
        });
      } catch (e) {
        console.log("Error setting audio mode:", e);
      }

      console.log("Force audio cleanup complete");
    } catch (e) {
      console.error("Critical error in force cleanup:", e);
    }
  };

  const playOrStopSound = async () => {
    try {
      if (isPlaying) {
        await forceAudioCleanup();
      } else {
        // Force cleanup first in case there's a lingering instance
        await forceAudioCleanup();

        // Create new sound
        try {
          const { sound: newSound } = await Audio.Sound.createAsync(
            {
              uri: "https://firebasestorage.googleapis.com/v0/b/famto-aa73e.appspot.com/o/voices%2FCustom%20Order.mp3?alt=media&token=99e53808-0115-4960-bcbf-3189950f0624",
            },
            { shouldPlay: true }
          );

          // Set our global reference
          GLOBAL_SOUND = newSound;
          setIsPlaying(true);

          newSound.setOnPlaybackStatusUpdate((status) => {
            if (
              status.isLoaded &&
              (status as AVPlaybackStatusSuccess).didJustFinish
            ) {
              forceAudioCleanup();
            }
          });
        } catch (soundError) {
          console.error("Error creating sound:", soundError);
          forceAudioCleanup();
        }
      }
    } catch (error) {
      console.error("Critical error in playOrStopSound:", error);
      forceAudioCleanup();
    }
  };

  // For navigation
  const prepareForNavigation = async () => {
    console.log("🚨 NAVIGATION PREPARATION STARTED");
    isNavigatingRef.current = true;

    // Force cleanup audio first
    await forceAudioCleanup();

    // Proceed with navigation
    console.log("Navigation can proceed now");
    return true;
  };

  const closeInfo = () => infoSheetRef.current?.close();

  const closeLocation = async () => {
    await forceAudioCleanup();
    locationSheetRef.current?.close();
  };

  const handleLocationPress = async () => {
    if (await prepareForNavigation()) {
      locationSheetRef.current?.expand();
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

  // Setup all navigation and lifecycle handlers

  // On app state change (background/foreground)
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState !== "active") {
        console.log("App going to background");
        forceAudioCleanup();
      }
    });

    return () => subscription.remove();
  }, []);

  // On hardware back button
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        forceAudioCleanup();
        return false;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => backHandler.remove();
    }, [])
  );

  // On navigation gestures
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", () => {
      forceAudioCleanup();
    });

    return unsubscribe;
  }, [navigation]);

  // On component unmount
  useEffect(() => {
    return () => {
      forceAudioCleanup();
    };
  }, []);

  // On screen focus change
  useFocusEffect(
    useCallback(() => {
      // Cleanup when losing focus
      return () => {
        if (!isNavigatingRef.current) {
          forceAudioCleanup();
        }
      };
    }, [])
  );

  return (
    <>
      <ScreenWrapper>
        <Header
          title="Custom Order"
          icon={require("@/assets/icons/info-circle.webp")}
          onPress={() => infoSheetRef.current?.expand()}
          showRightIcon
        />

        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Image
            source={require("@/assets/images/custom-order-banner.webp")}
            style={styles.image}
            resizeMode="contain"
          />

          <Typo size={15} fontFamily="SemiBold" color={colors.NEUTRAL900}>
            Shop not found on our list
          </Typo>
          <Typo
            size={13}
            color={colors.NEUTRAL400}
            style={{ paddingTop: verticalScale(6) }}
          >
            Pinpoint the location on map
          </Typo>
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

        <View style={styles.button}>
          <Button title="Place your order" onPress={handleLocationPress} />
        </View>
      </ScreenWrapper>

      <BottomSheet
        ref={infoSheetRef}
        index={-1}
        snapPoints={InfoSnapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        onClose={() => forceAudioCleanup()}
      >
        <CustomOrderBottomSheet
          closeSheet={() => {
            forceAudioCleanup();
            infoSheetRef.current?.close();
          }}
          playSound={playOrStopSound}
          isPlaying={isPlaying}
        />
      </BottomSheet>

      <BottomSheet
        ref={locationSheetRef}
        index={-1}
        snapPoints={locationSnapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        // onClose={() => forceAudioCleanup()}
      >
        <CustomOrderLocationBottomSheet onPress={closeLocation} />
      </BottomSheet>
    </>
  );
};

export default CustomOrderHome;

const styles = StyleSheet.create({
  image: {
    width: scale(300),
    height: verticalScale(300),
    borderRadius: radius._10,
    alignSelf: "center",
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
    marginHorizontal: scale(20),
  },
});
