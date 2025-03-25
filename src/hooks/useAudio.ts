import { forceAudioCleanup } from "@/utils/helpers";
import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { AppState } from "react-native";

export const useAudioCleanup = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // Cleanup when navigating away
    const unsubscribe = navigation.addListener("beforeRemove", () => {
      forceAudioCleanup();
    });

    // Cleanup when app goes to the background
    const appStateListener = AppState.addEventListener(
      "change",
      (nextAppState) => {
        if (nextAppState !== "active") {
          forceAudioCleanup();
        }
      }
    );

    // Cleanup when unmounting
    return () => {
      unsubscribe();
      appStateListener.remove();
      forceAudioCleanup();
    };
  }, [navigation]);
};
