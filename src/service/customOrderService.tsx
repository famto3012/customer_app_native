import { appAxios } from "@/config/apiInterceptor";
import { AddCustomStoreProps } from "@/types";
import { Alert, Platform, ToastAndroid } from "react-native";

export const addStoreDetail = async (
  data: AddCustomStoreProps
): Promise<{
  cartId: string;
  shopName: string;
  place: string;
  distance: number | null;
  duration: number | null;
}> => {
  try {
    const res = await appAxios.post(`/customers/add-shop`, data);

    return res.status === 200
      ? res.data
      : { cartId: "", shopName: "", place: "", distance: null, duration: null };
  } catch (err) {
    console.error(`Error in adding store detail:`, err);
    if (Platform.OS === "android") {
      ToastAndroid.showWithGravity(
        "Something went wrong",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    } else {
      Alert.alert("", "Something went wrong");
    }
    return {
      cartId: "",
      shopName: "",
      place: "",
      distance: null,
      duration: null,
    };
  }
};

export const fetchCustomOrderItems = async (cartId: string) => {
  try {
    const res = await appAxios.get(`/customers/custom-order-item`, {
      params: { cartId },
    });

    return res.status === 200 ? res.data : [];
  } catch (err) {
    console.error(`Error in fetching cart items:`, err);
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

export const addItemDetail = async (data: FormData) => {
  try {
    const res = await appAxios.post(`/customers/add-item`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.error(`Error in adding item detail:`, err);
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

export const editItemDetail = async (itemId: string, data: FormData) => {
  try {
    const res = await appAxios.patch(`/customers/edit-item/${itemId}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.status === 200 ? res.data : [];
  } catch (err) {
    console.error(`Error in editing item detail:`, err);
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

export const deleteItem = async (
  itemId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const res = await appAxios.delete(`/customers/delete-item/${itemId}`);

    return res.status === 200
      ? res.data
      : { success: false, message: "Failed" };
  } catch (err) {
    console.error(`Error in deleting item detail:`, JSON.stringify(err));
    if (Platform.OS === "android") {
      ToastAndroid.showWithGravity(
        "Something went wrong",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    } else {
      Alert.alert("", "Something went wrong");
    }
    return { success: false, message: "Failed" };
  }
};

export const addDeliveryAddress = async (data: FormData) => {
  try {
    const res = await appAxios.post(`/customers/add-delivery-address`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.status === 200 ? res.data.cartId : "";
  } catch (err) {
    console.error(`Error in adding delivery address:`, err);
    if (Platform.OS === "android") {
      ToastAndroid.showWithGravity(
        "Something went wrong",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    } else {
      Alert.alert("", "Something went wrong");
    }
    return "";
  }
};

export const fetchCustomCartBill = async (cartId: string) => {
  try {
    const res = await appAxios.get(`/customers/custom-cart-bill`, {
      params: { cartId },
    });

    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.error(`Error in getting custom order bill:`, err);
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

export const confirmCustomOrder = async (cartId: string) => {
  try {
    const res = await appAxios.post(`/customers/confirm-custom-order`, {
      cartId,
    });

    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.error(`Error in confirming custom order:`, err);
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
