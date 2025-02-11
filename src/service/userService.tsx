import { appAxios } from "@/config/apiInterceptor";
import { Alert } from "react-native";

export const fetchUserAddress = async () => {
  try {
    const res = await appAxios.get("/customers/customer-address");

    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.error(`Error in getting user address:`, err);
    Alert.alert("Error", "Something went wrong!");
    return null;
  }
};
