import { appAxios } from "@/config/apiInterceptor";
import { AddCustomStoreProps } from "@/types";
import { Alert } from "react-native";

export const addStoreDetail = async (data: AddCustomStoreProps) => {
  try {
    const res = await appAxios.post(`/customers/add-shop`, data);

    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.error(`Error in adding store detail:`, err);
    Alert.alert("Error", "Something went wrong!");
    return null;
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
    Alert.alert("Error", "Something went wrong!");
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
    Alert.alert("Error", "Something went wrong!");
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
    Alert.alert("Error", "Something went wrong!");
    return [];
  }
};

export const deleteItem = async (itemId: string) => {
  try {
    const res = await appAxios.delete(`/customers/delete-item/${itemId}`);

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in deleting item detail:`, err);
    Alert.alert("Error", "Something went wrong!");
    return null;
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
    Alert.alert("Error", "Something went wrong!");
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
    Alert.alert("Error", "Something went wrong!");
    return null;
  }
};

export const applyCustomOrderTipAndPromoCode = async (
  addedTip?: number | null,
  promoCode?: string
) => {
  try {
    const res = await appAxios.post(`/customers/add-custom-tip-and-promocode`, {
      addedTip,
      promoCode,
    });

    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.error(`Error in getting custom order bill:`, err);
    Alert.alert("Error", "Something went wrong!");
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
    Alert.alert("Error", "Something went wrong!");
    return null;
  }
};
