import { Alert, Platform, ToastAndroid } from "react-native";

export const useShowAlert = () => {
  const showAlert = (message: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.showWithGravity(
        message,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    } else {
      Alert.alert("", message);
    }
  };

  return { showAlert };
};
