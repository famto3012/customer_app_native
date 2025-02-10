import { useAuthStore } from "@/store/store";
import * as Location from "expo-location";

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

export const useSafeLocation = () => {
  const location = useAuthStore((state) => state.location);
  return {
    latitude: location?.latitude || 0,
    longitude: location?.longitude || 0,
  };
};
