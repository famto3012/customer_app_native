import { appAxios } from "@/config/apiInterceptor";
import { Alert, Platform, ToastAndroid } from "react-native";

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

export const getOrderDetail = async (orderId: string) => {
  try {
    const res = await appAxios.get(`/customers/orders/${orderId}`);

    if (res.status === 200) {
      return res.data.data || {};
    } else {
      throw new Error("Failed to fetch order details");
    }
  } catch (err) {
    console.error(`Error in getting order detail:`, err);
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
export const getScheduledOrderDetail = async (
  orderId: string,
  deliveryMode: string
) => {
  try {
    const res = await appAxios.get(`/customers/scheduled-orders-detail`, {
      params: {
        orderId,
        deliveryMode,
      },
    });

    if (res.status === 200) {
      return res.data || {};
    } else {
      throw new Error("Failed to fetch order details");
    }
  } catch (err) {
    console.error(`Error in getting order detail:`, err);
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

export const getChatMessages = async (agentId: string) => {
  try {
    const res = await appAxios.get(`/customers/chat/${agentId}`);

    if (res.status === 200) {
      return res.data || [];
    } else {
      throw new Error("Failed to fetch messages");
    }
  } catch (err) {
    console.error(`Error in getting messages:`, err);
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

export const sendChatMessages = async (formData: FormData) => {
  try {
    const res = await appAxios.post(`/customers/chat`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.status === 201) {
      return res.data || {};
    } else {
      throw new Error("Failed to send message");
    }
  } catch (err) {
    console.error(`Error in sending message:`, err);
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
