import { appAxios } from "@/config/apiInterceptor";
import { Alert } from "react-native";
import RazorpayCheckout from "react-native-razorpay";

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

export const initiateWalletDeposit = async (amount: number) => {
  try {
    const res = await appAxios.post(`/customers/wallet-recharge`, {
      amount,
    });

    return res.data.success ? res.data : null;
  } catch (err) {
    console.error(`Error in initiating deposit:`, err);
    Alert.alert("Error", "Something went wrong!");
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
    Alert.alert("Error", "Something went wrong!");
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
