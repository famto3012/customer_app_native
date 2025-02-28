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

export const fetchUserProfile = async () => {
  try {
    const res = await appAxios.get(`/customers/profile`);

    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.error(`Error in getting customer profile:`, err);
    Alert.alert("Error", "Something went wrong!");
    return null;
  }
};

export const updateUserProfile = async (data: FormData) => {
  try {
    const res = await appAxios.put(`/customers/edit-profile`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.status === 200 ? res.data.success : false;
  } catch (err: any) {
    console.error(`Error in updating customer profile:`, err);
    Alert.alert("Error", "Something went wrong!");
    return false;
  }
};

export const getReferralCode = async () => {
  try {
    const res = await appAxios.get(`/customers/generate-referral`);

    return res.status === 200 ? res.data : null;
  } catch (err: any) {
    console.error(`Error in getting referral code:`, err);
    Alert.alert("Error", "Something went wrong!");
    return null;
  }
};

export const getTemporaryOrder = async () => {
  try {
    const res = await appAxios.get(`/customers/get-temporary-order`);

    return res.status === 200 ? res.data : [];
  } catch (err: any) {
    console.error(`Error in getting temporary order:`, err);
    Alert.alert("Error", "Something went wrong!");
    return null;
  }
};

export const getAppBanner = async () => {
  try {
    const res = await appAxios.get(`/admin/app-banner/get-app-banner`);

    return res.status === 200 ? res.data.data : [];
  } catch (err: any) {
    console.error(`Error in getting app banner:`, err);
    Alert.alert("Error", "Something went wrong!");
    return null;
  }
};

export const getFavoriteProducts = async () => {
  try {
    const res = await appAxios.get(`/customers/favorite-products`);

    return res.status === 200 ? res.data : [];
  } catch (err: any) {
    console.error(`Error in getting favorite products:`, err);
    Alert.alert("Error", "Something went wrong!");
    return [];
  }
};

export const getFavoriteMerchants = async () => {
  try {
    const res = await appAxios.get(`/customers/favorite-merchants`);

    return res.status === 200 ? res.data.data : [];
  } catch (err: any) {
    console.error(`Error in getting favorite merchants:`, err);
    Alert.alert("Error", "Something went wrong!");
    return [];
  }
};

export const getAvailablePromoCodes = async (
  deliveryMode: string,
  merchantId?: string,
  query?: string
) => {
  try {
    const res = await appAxios.get(`/customers/get-promocodes`, {
      params: { deliveryMode, merchantId, query },
    });

    return res.status === 200 ? res.data : [];
  } catch (err: any) {
    console.error(`Error in getting promo codes:`, err);
    Alert.alert("Error", "Something went wrong!");
    return [];
  }
};

export const removeAppliedPromoCode = async (
  cartId: string,
  deliveryMode: string
) => {
  try {
    console.log("Remove promo", cartId, deliveryMode);

    const res = await appAxios.put(`/customers/remove-promo-code`, {
      cartId,
      deliveryMode,
    });

    return res.status === 200 ? res.data.data : null;
  } catch (err: any) {
    console.error(`Error in removing promo code:`, err);
    Alert.alert("Error", "Something went wrong!");
    return null;
  }
};
