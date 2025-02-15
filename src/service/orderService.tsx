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

export const getOngoingOrder = async () => {
  try {
    const res = await appAxios.get("/customers/current-ongoing-orders");

    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Failed to fetch current ongoing orders");
    }
  } catch (err) {
    console.error(`Error in getting current ongoing orders:`, err);
    Alert.alert("Error", "Something went wrong!");
    return [];
  }
};
