import { useAuthStore } from "@/store/store";
import * as Location from "expo-location";
import { Audio } from "expo-av";
import { Alert, Linking, PermissionsAndroid } from "react-native";
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
  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log("Authorization status:", authStatus);
    const token = await messaging().getToken();
    console.log("FCM token:", token);
  }
};
