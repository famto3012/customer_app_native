import { useAuthStore } from "@/store/store";
import * as Location from "expo-location";
import { Audio, AVPlaybackStatusSuccess } from "expo-av";
import { Alert, Linking, PermissionsAndroid, Platform } from "react-native";
import messaging from "@react-native-firebase/messaging";

export const requestLocationPermission = async () => {
  try {
    const { setLocation } = useAuthStore.getState();

    let { status } = await Location.getForegroundPermissionsAsync();

    if (status !== "granted") {
      const { status: newStatus } =
        await Location.requestForegroundPermissionsAsync();
      if (newStatus !== "granted") {
        return false;
      }
      status = newStatus;
    }

    // Optimized location request for faster response
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
      distanceInterval: 10,
    }).catch(() => null);

    if (!location) {
      console.log("Location fetch failed");
      return false;
    }

    const { latitude, longitude } = location.coords;
    // console.log("Location", location.coords);
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

    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status:", authStatus);
      const token = await messaging().getToken();
      console.log("FCM token:", token);
      useAuthStore.getState().setFcmToken(token);
    } else {
      console.log("User denied push notifications");
    }
  } catch (error) {
    console.log("Error requesting notification permission:", error);
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

      const authStatus = await messaging().requestPermission();
      const hasPermission =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (hasPermission) {
        console.log("Push notifications enabled!");
        const token = await messaging().getToken();
        console.log("FCM Token:", token);
        useAuthStore.getState().setFcmToken(token);
      } else {
        console.log("User denied push notifications");
      }
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

export const playOrStopScheduleSound = async (
  sound: Audio.Sound | null,
  isPlaying: boolean,
  setSound: (data: Audio.Sound | null) => void,
  setIsPlaying: (data: boolean) => void,
  stopSound: () => void
) => {
  try {
    if (sound && isPlaying) {
      await stopSound();
    } else {
      const { sound: newSound } = await Audio.Sound.createAsync(
        {
          uri: "https://firebasestorage.googleapis.com/v0/b/famto-aa73e.appspot.com/o/voices%2FScheduled%20Order.mp3?alt=media&token=da59e122-08f8-4964-8b6f-bfebc8c32fbe",
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

export const stopScheduleSound = async (
  sound: Audio.Sound | null,
  setSound: (data: Audio.Sound | null) => void,
  setIsPlaying: (data: boolean) => void
) => {
  if (sound) {
    await sound.stopAsync();
    await sound.unloadAsync();
    setSound(null);
    setIsPlaying(false);
  }
};
