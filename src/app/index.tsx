import { View, Image } from "react-native";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/utils/styling";
import { useAuthStore } from "@/store/store";
import { resetAndNavigate } from "@/utils/navigation";

const Main = () => {
  const [loaded] = useFonts({
    Bold: require("../assets/fonts/Poppins.Bold.ttf"),
    Regular: require("../assets/fonts/Poppins.Regular.ttf"),
    Medium: require("../assets/fonts/Poppins.Medium.ttf"),
    Light: require("../assets/fonts/Poppins.Light.ttf"),
    SemiBold: require("../assets/fonts/Poppins.Semibold.ttf"),
  });

  const { token, newUser, setNewUser } = useAuthStore.getState();

  useEffect(() => {
    if (loaded) {
      const timeOut = setTimeout(() => {
        if (token) {
          resetAndNavigate("/(tabs)");
        } else if (!token) {
          resetAndNavigate("/auth");
        } else if (newUser) {
          setNewUser(false);
          resetAndNavigate("/auth");
        }
      }, 3000);

      return () => clearTimeout(timeOut);
    }
  }, [loaded]);

  return (
    <View>
      <StatusBar hidden />

      <Image
        source={require("@/assets/images/splash-screen.png")}
        style={{ width: "100%", height: "100%" }}
        resizeMode="cover"
      />
    </View>
  );
};

export default Main;
