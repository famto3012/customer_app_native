import { appAxios } from "@/config/apiInterceptor";
import { Alert } from "react-native";

export const addStoreDetail = async (data: any) => {
  try {
    const res = await appAxios.post(`/customers/add-shop`, data);

    return res.status === 200 ? res.data.data : {};
  } catch (err) {
    console.error(`Error in adding store detail:`, err);
    Alert.alert("Error", "Something went wrong!");
    return false;
  }
};
export const addItemDetail = async (data: FormData) => {
  try {
    console.log("Data form", data);
    const res = await appAxios.post(`/customers/add-item`, data);

    return res.status === 200 ? res.data.data : {};
  } catch (err) {
    console.error(`Error in adding item detail:`, err);
    Alert.alert("Error", "Something went wrong!");
    return false;
  }
};
