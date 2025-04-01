import { appAxios } from "@/config/apiInterceptor";

import { Alert, Platform, ToastAndroid } from "react-native";
import { MerchantCardProps, UserAddressProps } from "@/types";
import RazorpayCheckout from "react-native-razorpay";
import { IAUUpdateKind } from "sp-react-native-in-app-updates";

type AddressWithoutId = Omit<UserAddressProps, "id">;
type AddressWithId = UserAddressProps;

export const fetchUserAddress = async () => {
  try {
    const res = await appAxios.get("/customers/customer-address");

    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.error(`Error in getting user address:`, err);
    if (Platform.OS === "android") {
      ToastAndroid.showWithGravity(
        "Something went wrong",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    } else {
      Alert.alert("", "Something went wrong");
    }
    return null;
  }
};

export const fetchLoyaltyAndFamtoCash = async () => {
  try {
    const res = await appAxios.get("/customers/get-wallet-and-loyalty");

    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.error(`Error in getting loyalty and famto cash:`, err);
    if (Platform.OS === "android") {
      ToastAndroid.showWithGravity(
        "Something went wrong",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    } else {
      Alert.alert("", "Something went wrong");
    }
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
    if (Platform.OS === "android") {
      ToastAndroid.showWithGravity(
        "Something went wrong",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    } else {
      Alert.alert("", "Something went wrong");
    }
    return [];
  }
};

export const fetchCustomerSubscriptions = async () => {
  try {
    const res = await appAxios.get(`/customers/subscription-details`);

    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.error(`Error in getting subscription detail:`, err);
    if (Platform.OS === "android") {
      ToastAndroid.showWithGravity(
        "Something went wrong",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    } else {
      Alert.alert("", "Something went wrong");
    }
    return null;
  }
};

export const fetchUserProfile = async () => {
  try {
    const res = await appAxios.get(`/customers/profile`);

    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.error(`Error in getting customer profile:`, err);
    if (Platform.OS === "android") {
      ToastAndroid.showWithGravity(
        "Something went wrong",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    } else {
      Alert.alert("", "Something went wrong");
    }
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
    if (Platform.OS === "android") {
      ToastAndroid.showWithGravity(
        "Something went wrong",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    } else {
      Alert.alert("", "Something went wrong");
    }
    return false;
  }
};

export const getReferralCode = async () => {
  try {
    const res = await appAxios.get(`/customers/generate-referral`);

    return res.status === 200 ? res.data : null;
  } catch (err: any) {
    console.error(`Error in getting referral code:`, err);
    if (Platform.OS === "android") {
      ToastAndroid.showWithGravity(
        "Something went wrong",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    } else {
      Alert.alert("", "Something went wrong");
    }
    return null;
  }
};

export const getTemporaryOrder = async () => {
  try {
    const res = await appAxios.get(`/customers/get-temporary-order`);

    return res.status === 200 ? res.data : [];
  } catch (err: any) {
    console.error(`Error in getting temporary order:`, err);
    if (Platform.OS === "android") {
      ToastAndroid.showWithGravity(
        "Something went wrong",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    } else {
      Alert.alert("", "Something went wrong");
    }
    return null;
  }
};

export const getAppBanner = async () => {
  try {
    const res = await appAxios.get(`/admin/app-banner/get-app-banner`);

    return res.status === 200 ? res.data.data : [];
  } catch (err: any) {
    console.error(`Error in getting app banner:`, err);
    if (Platform.OS === "android") {
      ToastAndroid.showWithGravity(
        "Something went wrong",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    } else {
      Alert.alert("", "Something went wrong");
    }
    return null;
  }
};

export const getFavoriteProducts = async () => {
  try {
    const res = await appAxios.get(`/customers/favorite-products`);

    return res.status === 200 ? res.data : [];
  } catch (err: any) {
    console.error(`Error in getting favorite products:`, err);
    if (Platform.OS === "android") {
      ToastAndroid.showWithGravity(
        "Something went wrong",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    } else {
      Alert.alert("", "Something went wrong");
    }
    return [];
  }
};

export const getFavoriteMerchants = async (): Promise<{
  success: boolean;
  data: MerchantCardProps[];
}> => {
  try {
    const res = await appAxios.get(`/customers/favorite-merchants`);

    return res.status === 200 ? res.data : { success: false, data: [] };
  } catch (err: any) {
    console.error(`Error in getting favorite merchants:`, err);
    if (Platform.OS === "android") {
      ToastAndroid.showWithGravity(
        "Something went wrong",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    } else {
      Alert.alert("", "Something went wrong");
    }
    return { success: false, data: [] };
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
    if (Platform.OS === "android") {
      ToastAndroid.showWithGravity(
        "Something went wrong",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    } else {
      Alert.alert("", "Something went wrong");
    }
    return [];
  }
};

export const removeAppliedPromoCode = async (
  cartId: string,
  deliveryMode: string
) => {
  try {
    const res = await appAxios.put(`/customers/remove-promo-code`, {
      cartId,
      deliveryMode,
    });

    return res.status === 200 ? res.data.data : null;
  } catch (err: any) {
    console.error(`Error in removing promo code:`, err);
    if (Platform.OS === "android") {
      ToastAndroid.showWithGravity(
        "Something went wrong",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    } else {
      Alert.alert("", "Something went wrong");
    }
    return null;
  }
};

export const initiateWalletDeposit = async (amount: number) => {
  try {
    const res = await appAxios.post(`/customers/wallet-recharge`, {
      amount,
    });

    return res.data.success ? res.data : null;
  } catch (err) {
    console.error(`Error in initiating deposit:`, err);
    if (Platform.OS === "android") {
      ToastAndroid.showWithGravity(
        "Something went wrong",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    } else {
      Alert.alert("", "Something went wrong");
    }
    return null;
  }
};

export const verifyWalletPayment = async (
  orderId: string,
  amount: string | number
): Promise<{
  message: string;
} | null> => {
  try {
    const razorpayKey = process.env.EXPO_PUBLIC_RAZORPAY_KEY;

    if (!razorpayKey) {
      throw new Error("Razorpay key is missing. Check environment variables.");
    }

    const amountInPaise = Math.round(Number(amount) * 100);

    const options = {
      key: razorpayKey,
      amount: amountInPaise,
      currency: "INR",
      name: "Famto",
      description: "Wallet recharge",
      order_id: orderId,
      image:
        "https://res.cloudinary.com/dcfj1j1ku/image/upload/v1743054538/Group_427320859_y8jszt.svg",
      prefill: {
        name: "",
        email: "",
        contact: "",
      },
      theme: {
        color: "#00CED1",
      },
    };

    return new Promise((resolve, reject) => {
      RazorpayCheckout.open(options)
        .then(async (response) => {
          const paymentDetails = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };

          try {
            const res = await appAxios.post(
              `/customers/verify-wallet-recharge`,
              {
                amount,
                paymentDetails,
              }
            );

            resolve(res.status === 200 ? res.data : null);
          } catch (error) {
            console.error("❌ Error in Payment Verification API:", error);
            reject(error);
          }
        })
        .catch((error) => {
          console.error("❌ Payment failed or canceled:", error);
          reject(error);
        });
    });
  } catch (err) {
    console.error("❌ Error in verifying payment:", err);
    return null;
  }
};

export const initiateSubscription = async (planId: string) => {
  try {
    const res = await appAxios.post(
      `/admin/subscription-payment/customer-subscription-payment-user`,
      {
        planId,
        paymentMode: "Online",
      }
    );

    return res.status === 201 ? res.data : null;
  } catch (err) {
    console.error(`Error in initiating deposit:`, err);
    if (Platform.OS === "android") {
      ToastAndroid.showWithGravity(
        "Something went wrong",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    } else {
      Alert.alert("", "Something went wrong");
    }
    return null;
  }
};

export const verifySubscription = async (
  orderId: string,
  amount: string | number,
  userId: string,
  currentPlan: string
): Promise<{
  message: string;
} | null> => {
  try {
    const razorpayKey = process.env.EXPO_PUBLIC_RAZORPAY_KEY;

    if (!razorpayKey) {
      throw new Error("Razorpay key is missing. Check environment variables.");
    }

    const amountInPaise = Math.round(Number(amount) * 100);

    const options = {
      key: razorpayKey,
      amount: amountInPaise,
      currency: "INR",
      name: "Famto",
      description: "Subscription payment",
      order_id: orderId,
      image:
        "https://res.cloudinary.com/dcfj1j1ku/image/upload/v1743054538/Group_427320859_y8jszt.svg",
      prefill: {
        name: "",
        email: "",
        contact: "",
      },
      theme: {
        color: "#00CED1",
      },
    };

    return new Promise((resolve, reject) => {
      RazorpayCheckout.open(options)
        .then(async (response) => {
          const paymentDetails = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            amount,
            paymentMode: "Online",
            userId,
            currentPlan,
          };

          try {
            const res = await appAxios.post(
              `/admin/subscription-payment/customer-subscription-payment-verification`,
              paymentDetails
            );

            resolve(res.status === 200 ? res.data : null);
          } catch (error) {
            console.error("❌ Error in Payment Verification API:", error);
            reject(error);
          }
        })
        .catch((error) => {
          console.error("❌ Payment failed or canceled:", error);
          reject(error);
        });
    });
  } catch (err) {
    console.error("❌ Error in verifying payment:", err);
    return null;
  }
};

export const updateUserAddress = async (
  data: AddressWithoutId | AddressWithId
): Promise<{ success: boolean; address: UserAddressProps | null }> => {
  try {
    const res = await appAxios.patch(`/customers/update-address`, data);

    return res.status === 200 ? res.data : { success: false, address: null };
  } catch (err: any) {
    console.error(`Error in adding customer address:`, err);
    if (Platform.OS === "android") {
      ToastAndroid.showWithGravity(
        "Something went wrong",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    } else {
      Alert.alert("", "Something went wrong");
    }
    return { success: false, address: null };
  }
};

export const verifyCustomerAddressLocation = async (
  latitude: number,
  longitude: number
): Promise<{ success: boolean }> => {
  try {
    const res = await appAxios.post(`/customers/verify-geofence`, {
      latitude,
      longitude,
    });

    return res.status === 200 ? res.data.success : { success: false };
  } catch (err: any) {
    console.error(`Error in verifying customer geofence:`, err);
    return { success: false };
  }
};

export const searchMerchantAndProducts = async (
  query: string,
  page: number,
  limit: number
) => {
  try {
    const res = await appAxios.get(`/customers/get-merchant-product`, {
      params: {
        query,
        page,
        limit,
      },
    });
    if (res.status === 200) {
      return {
        data: res.data.results,
        page: res.data.page,
        hasNextPage: res.data.hasNextPage,
      };
    } else {
      return {
        data: [],
        hasNextPage: false,
      };
    }
  } catch (err) {
    console.error(`Error in searching merchant and products:`, err);
    if (Platform.OS === "android") {
      ToastAndroid.showWithGravity(
        "Something went wrong",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    } else {
      Alert.alert("", "Something went wrong");
    }
    return { data: [], hasNextPage: false };
  }
};

export const getCustomerAppUpdateType = async (): Promise<IAUUpdateKind> => {
  try {
    const res = await appAxios.get("/customers/customer-app-update-type");

    return res.data.updateType === "IMMEDIATE"
      ? IAUUpdateKind.IMMEDIATE
      : IAUUpdateKind.FLEXIBLE;
  } catch (err: any) {
    console.log(
      `Error in retrieving app update type: ${JSON.stringify(err.message)}`
    );
    return IAUUpdateKind.IMMEDIATE;
  }
};

export const setGeofenceForUser = async (
  latitude: number,
  longitude: number
): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const res = await appAxios.post(`/customers/set-geofence`, {
      latitude,
      longitude,
    });

    return res.status === 200
      ? res.data
      : { success: false, message: "Failed" };
  } catch (err) {
    console.log(`Error in setting geofence`);
    return { success: false, message: "Failed" };
  }
};

export const fetchVisibilityOfLoyaltyOrReferral = async (
  query: string
): Promise<{ status: boolean }> => {
  try {
    const res = await appAxios.get(`/customers/visibility-status`, {
      params: { query },
    });

    return res.status === 200 ? res.data : { status: false };
  } catch (err) {
    console.log(`Error in getting visibility: ${err}`);
    return { status: false };
  }
};
