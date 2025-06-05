import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import * as Keychain from "react-native-keychain";
import AsyncStorage from "@react-native-async-storage/async-storage";

const secureStorage = {
  setItem: async (key: string, value: string) => {
    if (key === "token" || key === "refreshToken" || key === "biometricAuth") {
      // await Keychain.setGenericPassword(key, value);
      await Keychain.setGenericPassword(key, value, { service: key });
    } else {
      await AsyncStorage.setItem(key, value);
    }
  },
  getItem: async (key: string) => {
    if (key === "token" || key === "refreshToken" || key === "biometricAuth") {
      // const credentials = await Keychain.getGenericPassword();
      const credentials = await Keychain.getGenericPassword({ service: key });
      return credentials && credentials.username === key
        ? credentials.password
        : null;
    } else {
      return await AsyncStorage.getItem(key);
    }
  },
  removeItem: async (key: string) => {
    if (key === "token" || key === "refreshToken" || key === "biometricAuth") {
      // await Keychain.resetGenericPassword();
      await Keychain.resetGenericPassword({ service: key });
    } else {
      await AsyncStorage.removeItem(key);
    }
  },
};

interface Order {
  orderId: string;
  createdAt: Date;
}

interface AuthStore {
  userId: string | null;
  token: string | null;
  refreshToken: string | null;
  location: { latitude: number; longitude: number } | null;
  selectedBusiness: string | null;
  newUser: boolean;
  cart: { showCart: boolean; merchant: string; merchantId: string; cartId: string };
  promoCode: {
    universal: string | null;
    pickAndDrop: string | null;
    customOrder: string | null;
  };
  fcmToken: string | null;
  orders: Order[];
  biometricAuth: boolean;
  selectedMerchant: { merchantId: string | null; merchantName: string | null };
  outsideGeofence: boolean;
  userAddress: { type: string; otherId: string; address: string };
  setUserId: (userId: string) => void;
  setToken: (token: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  setLocation: (location: { latitude: number; longitude: number }) => void;
  setSelectedBusiness: (business: string) => void;
  setNewUser: (newUser: boolean) => void;
  setPromoCode: (
    promoCodeKey: "universal" | "pickAndDrop" | "customOrder",
    code: string | null
  ) => void;
  setFcmToken: (code: string) => void;
  setCart: (cart: {
    showCart: boolean;
    merchant: string;
    cartId: string;
  }) => void;
  addOrder: (order: Order) => void;
  clearOrders: () => void;
  clearFcmToken: () => void;
  setBiometricAuth: (status: boolean) => void;
  setSelectedMerchant: (merchantId: string, merchantName: string) => void;
  setOutsideGeofence: (data: boolean) => void;
  setUserAddress: (userAddress: {
    type: string;
    otherId: string;
    address: string;
  }) => void;
  clearStorage: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      userId: null,
      token: null,
      refreshToken: null,
      location: null,
      selectedBusiness: null,
      newUser: true,
      cart: { showCart: false, merchant: "", cartId: "" },
      promoCode: { universal: null, pickAndDrop: null, customOrder: null },
      fcmToken: null,
      orders: [],
      biometricAuth: false,
      selectedMerchant: { merchantId: null, merchantName: null },
      outsideGeofence: false,
      userAddress: { type: "", otherId: "", address: "" },

      setUserId: async (userId) => {
        set({ userId });
        await secureStorage.setItem("userId", userId);
      },
      setToken: async (token) => {
        set({ token });
        await secureStorage.setItem("token", token);
      },
      setRefreshToken: async (refreshToken) => {
        set({ refreshToken });
        await secureStorage.setItem("refreshToken", refreshToken);
      },
      setLocation: async (location) => {
        set({ location });
        await secureStorage.setItem("location", JSON.stringify(location));
      },
      setSelectedBusiness: async (selectedBusiness) => {
        set({ selectedBusiness });
        await secureStorage.setItem("selectedBusiness", selectedBusiness);
      },
      setNewUser: async (newUser) => {
        set({ newUser });
        await secureStorage.setItem("newUser", JSON.stringify(newUser));
      },
      setCart: async (cart) => {
        set({ cart });
        await secureStorage.setItem("cart", JSON.stringify(cart));
      },
      setPromoCode: async (promoCodeKey, code) => {
        set((state) => {
          const updatedPromoCode = { ...state.promoCode, [promoCodeKey]: code };
          secureStorage.setItem("promoCode", JSON.stringify(updatedPromoCode));
          return { promoCode: updatedPromoCode };
        });
      },
      setFcmToken: async (fcmToken) => {
        set({ fcmToken });
        await secureStorage.setItem("fcmToken", fcmToken);
      },
      addOrder: async (order) => {
        set((state) => {
          const updatedOrders = [...state.orders, order];
          secureStorage.setItem("orders", JSON.stringify(updatedOrders));
          return { orders: updatedOrders };
        });
      },
      clearOrders: async () => {
        set({ orders: [] });
        await secureStorage.removeItem("orders");
      },
      clearFcmToken: async () => {
        set({ fcmToken: null });
        await secureStorage.removeItem("fcmToken");
      },
      setBiometricAuth: async (status) => {
        set({ biometricAuth: status });
        await secureStorage.setItem("biometricAuth", JSON.stringify(status));
      },
      setSelectedMerchant: async (merchantId, merchantName) => {
        const selectedMerchant = { merchantId, merchantName };
        set({ selectedMerchant });
        await secureStorage.setItem(
          "selectedMerchant",
          JSON.stringify(selectedMerchant)
        );
      },
      setOutsideGeofence: async (outsideGeofence) => {
        set({ outsideGeofence });
        await secureStorage.setItem(
          "outsideGeofence",
          JSON.stringify(outsideGeofence)
        );
      },
      setUserAddress: async (userAddress) => {
        set({ userAddress });
        await secureStorage.setItem("userAddress", JSON.stringify(userAddress));
      },
      clearStorage: async () => {
        set({
          userId: null,
          token: null,
          refreshToken: null,
          location: null,
          selectedBusiness: null,
          cart: { showCart: false, merchant: "", cartId: "" },
          promoCode: { universal: null, pickAndDrop: null, customOrder: null },
          orders: [],
          userAddress: { type: "", otherId: "", address: "" },
        });
        await secureStorage.removeItem("userId");
        await secureStorage.removeItem("token");
        await secureStorage.removeItem("refreshToken");
        await secureStorage.removeItem("location");
        await secureStorage.removeItem("selectedBusiness");
        await secureStorage.removeItem("cart");
        await secureStorage.removeItem("promoCode");
        await secureStorage.removeItem("orders");
        await secureStorage.removeItem("userAddress");
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => secureStorage),
    }
  )
);
