import { appAxios } from "@/config/apiInterceptor";
import { PickAndDropItemProps } from "@/types";
import { Alert, Platform, ToastAndroid } from "react-native";
import RazorpayCheckout from "react-native-razorpay";

export const initializePickAndDrop = async () => {
  try {
    const res = await appAxios.delete("/customers/initialize-cart");

    return res.status === 200 ? true : false;
  } catch (err) {
    console.error(`Error in initializing P&D:`, JSON.stringify(err));
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

export const addPickAndDropAddress = async (data: FormData) => {
  try {
    const res = await appAxios.post(
      "/customers/add-pick-and-drop-address",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res.status === 200 ? res.data.cartId : null;
  } catch (err) {
    console.error(`Error in adding addresses:`, JSON.stringify(err));
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

export const getVehicleDetails = async (cartId: string) => {
  try {
    const res = await appAxios.get("/customers/get-vehicle-charges", {
      params: {
        cartId,
      },
    });

    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.error(`Error in getting vehicle details:`, JSON.stringify(err));
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

export const addPickAndDropItems = async (
  items: PickAndDropItemProps[],
  vehicleType: string,
  deliveryCharges: number
) => {
  try {
    const res = await appAxios.post("/customers/add-pick-and-drop-items", {
      items,
      vehicleType,
      deliveryCharges,
    });

    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.error(`Error in adding P&D items:`, JSON.stringify(err));
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

export const addPickAndDropTipAndPromoCode = async (
  addedTip?: number | null,
  promoCode?: string
) => {
  try {
    const res = await appAxios.post("/customers/add-tip-and-promocode", {
      addedTip,
      promoCode,
    });

    return res.status === 200 ? res.data.success : false;
  } catch (err: any) {
    console.error(`Error in adding tip or promo code:`, err.response.data);

    // Extract and display server error message
    const errorMessage = err.response?.data?.message || "Something went wrong!";

    Alert.alert("", errorMessage);
    return false;
  }
};

export const getPickAndDropBill = async (cartId: string) => {
  try {
    const res = await appAxios.get("/customers/get-pick-and-drop-bill", {
      params: {
        cartId,
      },
    });

    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.error(`Error in getting cart bill:`, JSON.stringify(err));
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

export const confirmPickAndDropOrder = async (
  paymentMode: string
): Promise<{
  success: boolean;
  orderId: string;
  amount?: number;
  createdAt?: string;
}> => {
  try {
    const res = await appAxios.post("/customers/confirm-pick-and-drop", {
      paymentMode,
    });

    console.log("RES", res.data);

    return res.status === 200 ? res.data : { success: false, orderId: "" };
  } catch (err) {
    console.error(`Error in confirming P&D:`, JSON.stringify(err));
    if (Platform.OS === "android") {
      ToastAndroid.showWithGravity(
        "Something went wrong",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    } else {
      Alert.alert("", "Something went wrong");
    }
    return { success: false, orderId: "" };
  }
};

export const verifyPickAndDropPayment = async (
  orderId: string,
  amount: string | number
): Promise<{
  success: boolean;
  orderId: string;
  createdAt: string;
}> => {
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
      description: "Order Payment",
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
            const res = await appAxios.post(`/customers/verify-pick-and-drop`, {
              paymentDetails,
            });

            resolve(
              res.status === 200
                ? res.data
                : { success: false, orderId: "", createdAt: "" }
            );
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
    return { success: false, orderId: "", createdAt: "" };
  }
};
