import { useAuthStore } from "@/store/store";
import * as Location from "expo-location";
import { Audio } from "expo-av";
import { Alert, Linking, PermissionsAndroid, Platform } from "react-native";
import messaging from "@react-native-firebase/messaging";
import SpInAppUpdates, {
  IAUInstallStatus,
  AndroidStatusEventListener,
} from "sp-react-native-in-app-updates";
import DeviceInfo from "react-native-device-info";
import { getCustomerAppUpdateType } from "@/service/userService";

const APP_STORE_ID = "YOUR_APP_ID";
const APP_STORE_URL = `itms-apps://apps.apple.com/app/id${APP_STORE_ID}`;

let statusUpdateListener: AndroidStatusEventListener | null = null;

let GLOBAL_SOUND: Audio.Sound | null = null;

export const requestLocationPermission = async () => {
  try {
    const { setLocation } = useAuthStore.getState();

    let { status } = await Location.getForegroundPermissionsAsync();

    if (status !== "granted") {
      const { status: newStatus } =
        await Location.requestForegroundPermissionsAsync();
      if (newStatus !== "granted") return false;
      status = newStatus;
    }

    let location = null;
    const maxRetries = 2; // Max attempts
    let attempt = 0;

    while (!location && attempt < maxRetries) {
      location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
        distanceInterval: 10,
      }).catch(() => null);

      if (location) break; // Stop retrying if location is obtained

      attempt++;
      await new Promise((resolve) => setTimeout(resolve, 1300));
    }

    if (!location) {
      console.log("Failed to get location after multiple attempts");
      return false;
    }

    const { latitude, longitude } = location.coords;

    setLocation({ latitude, longitude });

    return true;
  } catch (error) {
    console.error("Location error:", error);
    return false;
  }
};

export const getRecordingPermissions = async () => {
  const { status } = await Audio.requestPermissionsAsync();

  if (status !== "granted") {
    Alert.alert(
      "Microphone Permission Required",
      "Please allow microphone access to record audio.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Open Settings",
          onPress: () => Linking.openSettings(), // Redirect user to settings
        },
      ]
    );
    return false;
  }

  return true;
};

export const useSafeLocation = () => {
  const location = useAuthStore((state) => state.location);
  return {
    latitude: location?.latitude || 0,
    longitude: location?.longitude || 0,
  };
};

export const formatDate = (date: Date): string => {
  if (!date) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const formatTime = (hours: number, minutes: number): string => {
  if (hours === null || minutes === null) return "";

  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = String(minutes).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes} ${period}`;
};

export const requestNotificationPermission = async () => {
  try {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Notification permission denied");
        return;
      }
    }

    generateFcmToken();
  } catch (error) {
    console.log("Error requesting notification permission:", error);
  }
};

export const generateFcmToken = async () => {
  try {
    console.log("Generating FCM token...");

    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      console.log("User denied push notifications. Cannot generate FCM token.");
      return;
    }

    const token = await messaging().getToken();
    console.log("FCM token:", token);

    useAuthStore.setState({ fcmToken: token });
  } catch (error) {
    console.log("Error generating FCM token:", error);
  }
};

export const toggleNotificationPermission = async (enable: boolean) => {
  try {
    if (enable) {
      // ENABLE NOTIFICATIONS
      if (Platform.OS === "android" && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Notification permission denied");
          return;
        }
      }

      generateFcmToken();
    } else {
      // DISABLE NOTIFICATIONS
      await messaging().deleteToken(); // Remove FCM token
      console.log("FCM token deleted. Notifications disabled.");
      const { clearFcmToken } = useAuthStore.getState();

      clearFcmToken();

      if (Platform.OS === "ios") {
        await messaging().requestPermission({
          alert: false,
          badge: false,
          sound: false,
        });
      }
    }
  } catch (error) {
    console.log("Error toggling notification permission:", error);
  }
};

export const checkForUpdate = async (): Promise<void> => {
  const inAppUpdates = new SpInAppUpdates(false); // false = production mode

  try {
    const result = await inAppUpdates.checkNeedsUpdate();
    if (result.shouldUpdate) {
      if (Platform.OS === "android") {
        const updateType = await getCustomerAppUpdateType();
        // console.log(
        //   `Starting update with type: ${
        //     updateType === IAUUpdateKind.IMMEDIATE ? "IMMEDIATE" : "FLEXIBLE"
        //   }`
        // );

        inAppUpdates.startUpdate({ updateType });

        // Define and store the listener
        statusUpdateListener = (downloadStatus) => {
          // console.log("Download status:", downloadStatus);
          if (downloadStatus.status === IAUInstallStatus.DOWNLOADED) {
            // console.log("Update downloaded, installing...");
            inAppUpdates.installUpdate();
            if (statusUpdateListener) {
              inAppUpdates.removeStatusUpdateListener(statusUpdateListener);
              statusUpdateListener = null; // Clear the reference
            }
          }
        };

        inAppUpdates.addStatusUpdateListener(statusUpdateListener);
      } else {
        checkiOSUpdate();
      }
    }
  } catch (error) {
    console.error("Error checking for update:", error);
  }
};

const checkiOSUpdate = async (): Promise<void> => {
  try {
    const currentVersion = DeviceInfo.getVersion();
    // console.log("Current iOS Version:", currentVersion);

    const response = await fetch(
      `https://itunes.apple.com/lookup?id=${APP_STORE_ID}`
    );
    const data: { results: { version: string }[] } = await response.json();

    if (data.results.length > 0) {
      const latestVersion = data.results[0].version;
      // console.log("Latest iOS Version:", latestVersion);

      if (currentVersion < latestVersion) {
        Alert.alert(
          "Update Available",
          "A new version of the app is available. Please update for the best experience.",
          [
            { text: "Update", onPress: () => Linking.openURL(APP_STORE_URL) },
            { text: "Cancel", style: "cancel" },
          ]
        );
      }
    }
  } catch (error) {
    console.error("Error checking iOS update:", error);
  }
};

export const forceAudioCleanup = async (
  setIsPlaying?: (state: boolean) => void
) => {
  try {
    if (GLOBAL_SOUND) {
      try {
        await GLOBAL_SOUND.pauseAsync().catch(() => {});
        await GLOBAL_SOUND.stopAsync().catch(() => {});
        await GLOBAL_SOUND.unloadAsync().catch(() => {});
      } catch (e) {
        console.log("Caught error during force cleanup:", e);
      }

      GLOBAL_SOUND = null;
    }

    // Reset audio mode
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: false,
        staysActiveInBackground: false,
        shouldDuckAndroid: false,
      });
    } catch (e) {
      console.log("Error setting audio mode:", e);
    }

    // Reset playing state if a setter is provided
    if (setIsPlaying) {
      setIsPlaying(false);
    }
  } catch (e) {
    console.error("Critical error in force cleanup:", e);
  }
};

export const playOrStopSound = async (
  uri: string,
  isPlaying: boolean,
  setIsPlaying: (state: boolean) => void
) => {
  try {
    if (isPlaying) {
      await forceAudioCleanup();
      setIsPlaying(false); // Reset state when stopping manually
    } else {
      await forceAudioCleanup();

      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri },
          { shouldPlay: true }
        );

        GLOBAL_SOUND = newSound;
        setIsPlaying(true);

        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            forceAudioCleanup();
            setIsPlaying(false); // Reset state after audio completes
          }
        });
      } catch (soundError) {
        console.error("Error creating sound:", soundError);
        forceAudioCleanup();
        setIsPlaying(false);
      }
    }
  } catch (error) {
    console.error("Critical error in playOrStopSound:", error);
    forceAudioCleanup();
    setIsPlaying(false);
  }
};
