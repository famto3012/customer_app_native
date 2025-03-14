import { appAxios } from "@/config/apiInterceptor";
import { PickAndDropItemProps } from "@/types";
import { Alert } from "react-native";

export const initializePickAndDrop = async () => {
  try {
    const res = await appAxios.delete("/customers/initialize-cart");

    return res.status === 200 ? true : false;
  } catch (err) {
    console.error(`Error in initializing P&D:`, JSON.stringify(err));
    Alert.alert("Error", "Something went wrong!");
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
    Alert.alert("Error", "Something went wrong!");
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
    Alert.alert("Error", "Something went wrong!");
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
    Alert.alert("Error", "Something went wrong!");
    return null;
  }
};

export const addPickAndDropTipAndPromoCode = async (
  addedTip?: number,
  promoCode?: string
) => {
  try {
    const res = await appAxios.post("/customers/add-tip-and-promocode", {
      addedTip,
      promoCode,
    });

    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.error(`Error in adding tip or promo code:`, JSON.stringify(err));
    Alert.alert("Error", "Something went wrong!");
    return null;
  }
};
