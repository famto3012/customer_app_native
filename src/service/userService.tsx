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

export const fetchLoyaltyAndFamtoCash = async () => {
  try {
    const res = await appAxios.get("/customers/get-wallet-and-loyalty");

    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.error(`Error in getting loyalty and famto cash:`, err);
    Alert.alert("Error", "Something went wrong!");
    return null;
  }
};

export const fetchTransactionHistory = async (page: number) => {
  try {
    const res = await appAxios.get("/customers/transaction-details", {
      params: { page, limit: 20 },
    });

    return res.status === 200 && Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.error(`Error in getting transaction detail:`, err);
    Alert.alert("Error", "Something went wrong!");
    return [];
  }
};

export const fetchCustomerSubscriptions = async () => {
  try {
    const res = await appAxios.get(`/customers/subscription-details`);

    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.error(`Error in getting subscription detail:`, err);
    Alert.alert("Error", "Something went wrong!");
    return null;
  }
};
