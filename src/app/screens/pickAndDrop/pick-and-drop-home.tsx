// import { AppState, StyleSheet, View } from "react-native";
// import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withTiming,
// } from "react-native-reanimated";
// import ScreenWrapper from "@/components/ScreenWrapper";
// import Header from "@/components/Header";
// import Typo from "@/components/Typo";
// import { colors, radius, spacingX } from "@/constants/theme";
// import Button from "@/components/Button";
// import { scale, verticalScale } from "@/utils/styling";
// import BottomSheet, {
//   BottomSheetBackdrop,
//   BottomSheetBackdropProps,
//   SCREEN_WIDTH,
// } from "@gorhom/bottom-sheet";
// import { router } from "expo-router";
// import PickAndDropBottomSheet from "@/components/BottomSheets/pickAndDrop/pick-and-drop-bottomsheet";
// import { commonStyles } from "@/constants/commonStyles";
// import {
//   customOrderDetails,
//   pickAndDropHomeImages,
//   pickAndDropSubtexts,
// } from "@/utils/defaultData";
// import { useMutation } from "@tanstack/react-query";
// import { initializePickAndDrop } from "@/service/pickandDropService";
// import { Audio, AVPlaybackStatusSuccess } from "expo-av";
// import { useFocusEffect } from "@react-navigation/native";

// const PickAndDropHome = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [sound, setSound] = useState<Audio.Sound | null>(null);
//   const [isPlaying, setIsPlaying] = useState(false);

//   const imageOffset = useSharedValue(-300);
//   const textOffset = useSharedValue(300);

//   const indexRef = useRef(0);
//   const infoSheetRef = useRef<BottomSheet>(null);

//   const InfoSnapPoints = useMemo(() => ["55%"], []);

//   useEffect(() => {
//     const cycleImages = () => {
//       const nextIndex = (indexRef.current + 1) % pickAndDropHomeImages.length;
//       indexRef.current = nextIndex;
//       setCurrentIndex(nextIndex);

//       const isLeftToRight = nextIndex % 2 === 0;

//       imageOffset.value = withTiming(
//         isLeftToRight ? -300 : 300,
//         { duration: 500 },
//         () => {
//           imageOffset.value = isLeftToRight ? 300 : -300;
//           imageOffset.value = withTiming(0, { duration: 500 });
//         }
//       );

//       textOffset.value = withTiming(
//         isLeftToRight ? 300 : -300,
//         { duration: 500 },
//         () => {
//           textOffset.value = isLeftToRight ? -300 : 300;
//           textOffset.value = withTiming(0, { duration: 500 });
//         }
//       );
//     };

//     cycleImages();

//     const interval = setInterval(cycleImages, 3000);
//     return () => clearInterval(interval);
//   }, []);

//   const animatedImageStyle = useAnimatedStyle(() => ({
//     transform: [{ translateX: imageOffset.value }],
//   }));

//   const animatedTextStyle = useAnimatedStyle(() => ({
//     transform: [{ translateX: textOffset.value }],
//   }));

//   const initializeMutation = useMutation({
//     mutationKey: ["initialize-cart"],
//     mutationFn: initializePickAndDrop,
//     onSuccess: (res) => {
//       if (res) {
//         router.push({
//           pathname: "/screens/pickAndDrop/Pick-and-Drop_ordering",
//         });
//       }
//     },
//   });

//   const playOrStopSound = async () => {
//     try {
//       if (sound && isPlaying) {
//         await stopSound();
//       } else {
//         const { sound: newSound } = await Audio.Sound.createAsync(
//           {
//             uri: "https://firebasestorage.googleapis.com/v0/b/famto-aa73e.appspot.com/o/voices%2FPick%20and%20drop.mp3?alt=media&token=09ccd097-3acf-4f91-8778-39b469ea9096",
//           },
//           { shouldPlay: true }
//         );

//         setSound(newSound);
//         setIsPlaying(true);

//         newSound.setOnPlaybackStatusUpdate((status) => {
//           if (
//             status.isLoaded &&
//             (status as AVPlaybackStatusSuccess).didJustFinish
//           ) {
//             stopSound();
//           }
//         });
//       }
//     } catch (error) {
//       console.error("Error playing/stopping sound:", error);
//     }
//   };

//   const stopSound = async () => {
//     if (sound) {
//       await sound.stopAsync();
//       await sound.unloadAsync();
//       setSound(null);
//       setIsPlaying(false);
//     }
//   };

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

//   useFocusEffect(
//     useCallback(() => {
//       return () => {
//         stopSound();
//       };
//     }, [])
//   );

//   // Stop audio when app goes to background
//   useEffect(() => {
//     const subscription = AppState.addEventListener("change", (nextAppState) => {
//       if (nextAppState !== "active") {
//         stopSound();
//       }
//     });

//     return () => subscription.remove();
//   }, []);

//   return (
//     <>
//       <ScreenWrapper>
//         <Header
//           title="Pick & Drop"
//           icon={require("@/assets/icons/info-circle.webp")}
//           onPress={() => infoSheetRef.current?.expand()}
//           showRightIcon
//         />

//         <View
//           style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
//         >
//           <Animated.Image
//             source={pickAndDropHomeImages[currentIndex].source}
//             style={[styles.image, animatedImageStyle]}
//             resizeMode="contain"
//           />

//           <Animated.View style={[styles.textContainer, animatedTextStyle]}>
//             <Typo size={15} fontFamily="SemiBold" color={colors.NEUTRAL900}>
//               {pickAndDropHomeImages[currentIndex].text}
//             </Typo>

//             <Typo
//               size={13}
//               color={colors.NEUTRAL400}
//               style={{ textAlign: "center" }}
//             >
//               {pickAndDropSubtexts[currentIndex]}
//             </Typo>
//           </Animated.View>
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

//         <Button
//           title="Place your order"
//           onPress={() => initializeMutation.mutate()}
//           isLoading={initializeMutation.isPending}
//           style={styles.button}
//         />
//       </ScreenWrapper>

//       <BottomSheet
//         ref={infoSheetRef}
//         index={-1}
//         snapPoints={InfoSnapPoints}
//         enableDynamicSizing={false}
//         enablePanDownToClose
//         backdropComponent={renderBackdrop}
//         onClose={stopSound}
//       >
//         <PickAndDropBottomSheet
//           closeSheet={() => {
//             stopSound();
//             infoSheetRef.current?.close();
//           }}
//           playSound={playOrStopSound}
//           isPlaying={isPlaying}
//         />
//       </BottomSheet>
//     </>
//   );
// };

// export default PickAndDropHome;

// const styles = StyleSheet.create({
//   image: {
//     width: scale(300),
//     height: verticalScale(300),
//     alignSelf: "center",
//   },
//   textContainer: {
//     alignItems: "center",
//     marginVertical: scale(5),
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
//     alignSelf: "center",
//     width: SCREEN_WIDTH * 0.9,
//   },
// });
// import { AppState, BackHandler, StyleSheet, View } from "react-native";
// import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withTiming,
// } from "react-native-reanimated";
// import ScreenWrapper from "@/components/ScreenWrapper";
// import Header from "@/components/Header";
// import Typo from "@/components/Typo";
// import { colors, radius, spacingX } from "@/constants/theme";
// import Button from "@/components/Button";
// import { scale, verticalScale } from "@/utils/styling";
// import BottomSheet, {
//   BottomSheetBackdrop,
//   BottomSheetBackdropProps,
//   SCREEN_WIDTH,
// } from "@gorhom/bottom-sheet";
// import { router, useFocusEffect } from "expo-router";
// import PickAndDropBottomSheet from "@/components/BottomSheets/pickAndDrop/pick-and-drop-bottomsheet";
// import { commonStyles } from "@/constants/commonStyles";
// import {
//   customOrderDetails,
//   pickAndDropHomeImages,
//   pickAndDropSubtexts,
// } from "@/utils/defaultData";
// import { useMutation } from "@tanstack/react-query";
// import { initializePickAndDrop } from "@/service/pickandDropService";
// import { Audio, AVPlaybackStatusSuccess } from "expo-av";
// import { useNavigation } from "@react-navigation/native";

// const PickAndDropHome = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [sound, setSound] = useState<Audio.Sound | null>(null);
//   const [isPlaying, setIsPlaying] = useState(false);

//   const imageOffset = useSharedValue(-300);
//   const textOffset = useSharedValue(300);

//   const indexRef = useRef(0);
//   const infoSheetRef = useRef<BottomSheet>(null);

//   const InfoSnapPoints = useMemo(() => ["55%"], []);

//   useEffect(() => {
//     const cycleImages = () => {
//       const nextIndex = (indexRef.current + 1) % pickAndDropHomeImages.length;
//       indexRef.current = nextIndex;
//       setCurrentIndex(nextIndex);

//       const isLeftToRight = nextIndex % 2 === 0;

//       imageOffset.value = withTiming(
//         isLeftToRight ? -300 : 300,
//         { duration: 500 },
//         () => {
//           imageOffset.value = isLeftToRight ? 300 : -300;
//           imageOffset.value = withTiming(0, { duration: 500 });
//         }
//       );

//       textOffset.value = withTiming(
//         isLeftToRight ? 300 : -300,
//         { duration: 500 },
//         () => {
//           textOffset.value = isLeftToRight ? -300 : 300;
//           textOffset.value = withTiming(0, { duration: 500 });
//         }
//       );
//     };

//     cycleImages();

//     const interval = setInterval(cycleImages, 3000);
//     return () => clearInterval(interval);
//   }, []);

//   const animatedImageStyle = useAnimatedStyle(() => ({
//     transform: [{ translateX: imageOffset.value }],
//   }));

//   const animatedTextStyle = useAnimatedStyle(() => ({
//     transform: [{ translateX: textOffset.value }],
//   }));

//   const initializeMutation = useMutation({
//     mutationKey: ["initialize-cart"],
//     mutationFn: initializePickAndDrop,
//     onSuccess: (res) => {
//       if (res) {
//         router.push({
//           pathname: "/screens/pickAndDrop/Pick-and-Drop_ordering",
//         });
//       }
//     },
//   });

//   const playOrStopSound = async () => {
//     try {
//       if (sound && isPlaying) {
//         await stopSound();
//       } else {
//         const { sound: newSound } = await Audio.Sound.createAsync(
//           {
//             uri: "https://firebasestorage.googleapis.com/v0/b/famto-aa73e.appspot.com/o/voices%2FPick%20and%20drop.mp3?alt=media&token=09ccd097-3acf-4f91-8778-39b469ea9096",
//           },
//           { shouldPlay: true }
//         );

//         setSound(newSound);
//         setIsPlaying(true);

//         newSound.setOnPlaybackStatusUpdate((status) => {
//           if (
//             status.isLoaded &&
//             (status as AVPlaybackStatusSuccess).didJustFinish
//           ) {
//             stopSound();
//           }
//         });
//       }
//     } catch (error) {
//       console.error("Error playing/stopping sound:", error);
//     }
//   };

//   const stopSound = async () => {
//     console.log("triggeredHere");

//     if (sound) {
//       const status = await sound.getStatusAsync();
//       console.log("Sound Status:", status);

//       if (status.isLoaded) {
//         console.log("triggered");
//         await sound.stopAsync();
//         await sound.unloadAsync();
//         setSound(null);
//         setIsPlaying(false);
//       }
//     }
//   };

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

//   // Stop audio when navigating away
//   useFocusEffect(
//     useCallback(() => {
//       return () => {
//         stopSound();
//       };
//     }, [])
//   );

//   // Stop audio when the component unmounts
//   useEffect(() => {
//     return () => {
//       stopSound();
//     };
//   }, []);

//   // Stop audio when app goes to background
//   useEffect(() => {
//     const subscription = AppState.addEventListener("change", (nextAppState) => {
//       if (nextAppState !== "active") {
//         stopSound();
//       }
//     });

//     return () => subscription.remove();
//   }, []);

//   useFocusEffect(
//     useCallback(() => {
//       const onBackPress = () => {
//         stopSound(); // Stop the audio when the back button is pressed
//         return false; // Allow the default back action
//       };

//       const backHandler = BackHandler.addEventListener(
//         "hardwareBackPress",
//         onBackPress
//       );

//       return () => backHandler.remove();
//     }, [])
//   );

//   const navigation = useNavigation();

//   useEffect(() => {
//     const beforeRemoveListener = navigation.addListener("beforeRemove", () => {
//       stopSound(); // Stop audio when navigating back via gestures or back button
//     });

//     return () => {
//       navigation.removeListener("beforeRemove", beforeRemoveListener);
//     };
//   }, [navigation]);

//   return (
//     <>
//       <ScreenWrapper>
//         <Header
//           title="Pick & Drop"
//           icon={require("@/assets/icons/info-circle.webp")}
//           onPress={() => infoSheetRef.current?.expand()}
//           showRightIcon
//         />

//         <View
//           style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
//         >
//           <Animated.Image
//             source={pickAndDropHomeImages[currentIndex].source}
//             style={[styles.image, animatedImageStyle]}
//             resizeMode="contain"
//           />

//           <Animated.View style={[styles.textContainer, animatedTextStyle]}>
//             <Typo size={15} fontFamily="SemiBold" color={colors.NEUTRAL900}>
//               {pickAndDropHomeImages[currentIndex].text}
//             </Typo>

//             <Typo
//               size={13}
//               color={colors.NEUTRAL400}
//               style={{ textAlign: "center" }}
//             >
//               {pickAndDropSubtexts[currentIndex]}
//             </Typo>
//           </Animated.View>
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

//         <Button
//           title="Place your order"
//           onPress={() => initializeMutation.mutate()}
//           isLoading={initializeMutation.isPending}
//           style={styles.button}
//         />
//       </ScreenWrapper>

//       <BottomSheet
//         ref={infoSheetRef}
//         index={-1}
//         snapPoints={InfoSnapPoints}
//         enableDynamicSizing={false}
//         enablePanDownToClose
//         backdropComponent={renderBackdrop}
//         onClose={stopSound}
//       >
//         <PickAndDropBottomSheet
//           closeSheet={() => {
//             stopSound();
//             infoSheetRef.current?.close();
//           }}
//           playSound={playOrStopSound}
//           isPlaying={isPlaying}
//         />
//       </BottomSheet>
//     </>
//   );
// };

// export default PickAndDropHome;

// const styles = StyleSheet.create({
//   image: {
//     width: scale(300),
//     height: verticalScale(300),
//     alignSelf: "center",
//   },
//   textContainer: {
//     alignItems: "center",
//     marginVertical: scale(5),
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
//     alignSelf: "center",
//     width: SCREEN_WIDTH * 0.9,
//   },
// });
import { AppState, BackHandler, StyleSheet, View } from "react-native";
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
import { router, useFocusEffect } from "expo-router";
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
import { useNavigation } from "@react-navigation/native";

// Global audio reference - will ensure we only have one audio instance
let GLOBAL_SOUND: Audio.Sound | null = null;

const PickAndDropHome = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const imageOffset = useSharedValue(-300);
  const textOffset = useSharedValue(300);

  const indexRef = useRef(0);
  const infoSheetRef = useRef<BottomSheet>(null);
  const isNavigatingRef = useRef(false);

  const InfoSnapPoints = useMemo(() => ["55%"], []);
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

  const handlePlaceOrder = async () => {
    if (await prepareForNavigation()) {
      initializeMutation.mutate();
    }
  };

  const initializeMutation = useMutation({
    mutationKey: ["initialize-cart"],
    mutationFn: initializePickAndDrop,
    onSuccess: (res) => {
      if (res) {
        // Double check audio is stopped before navigating
        forceAudioCleanup().then(() => {
          router.push({
            pathname: "/screens/pickAndDrop/Pick-and-Drop_ordering",
          });
        });
      }
    },
  });

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
              uri: "https://firebasestorage.googleapis.com/v0/b/famto-aa73e.appspot.com/o/voices%2FPick%20and%20drop.mp3?alt=media&token=09ccd097-3acf-4f91-8778-39b469ea9096",
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
          onPress={handlePlaceOrder}
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
        onClose={() => forceAudioCleanup()}
      >
        <PickAndDropBottomSheet
          closeSheet={() => {
            forceAudioCleanup();
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
