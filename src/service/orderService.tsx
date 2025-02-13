import { appAxios } from "@/config/apiInterceptor";
import { Alert } from "react-native";

export const getOrderList = async () => {
  try {
    const res = await appAxios.get("/customers/orders");

    if (res.status === 200) {
      return res.data.data;
    } else {
      throw new Error("Failed to fetch orders");
    }
  } catch (err) {
    console.error(`Error in getting orders:`, err);
    Alert.alert("Error", "Something went wrong!");
    return [];
  }
};

export const getScheduledOrderList = async () => {
  try {
    const res = await appAxios.get("/customers/scheduled-orders");

    if (res.status === 200) {
      return res.data.data;
    } else {
      throw new Error("Failed to fetch scheduled orders");
    }
  } catch (err) {
    console.error(`Error in getting scheduled orders:`, err);
    Alert.alert("Error", "Something went wrong!");
    return [];
  }
};
