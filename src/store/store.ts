import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";

// Create MMKV storage instance
const storage = new MMKV();

const secureStorage = {
  setItem: (key: string, value: string) => {
    storage.set(key, value);
  },
  getItem: (key: string): string | null => {
    const value = storage.getString(key);
    return value === undefined ? null : value;
  },
  removeItem: (key: string) => {
    storage.delete(key);
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
  cart: { showCart: boolean; merchant: string; cartId: string };
  promoCode: string | null;
  orders: Order[];
  biometricAuth: boolean; 
  setUserId: (userId: string) => void;
  setToken: (token: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  setLocation: (location: { latitude: number; longitude: number }) => void;
  setSelectedBusiness: (business: string) => void;
  setNewUser: (newUser: boolean) => void;
  setPromoCode: (code: string) => void;
  setCart: (cart: {
    showCart: boolean;
    merchant: string;
    cartId: string;
  }) => void;
  addOrder: (order: Order) => void; // New method to add orders
  clearOrders: () => void; // New method to clear orders
  setBiometricAuth: (status: boolean) => void; // ✅ Setter function for biometricAuth
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
      promoCode: null,
      orders: [], 
      biometricAuth: false,

      setUserId: (userId) => {
        set({ userId });
        secureStorage.setItem("userId", userId);
      },
      setToken: (token) => {
        set({ token });
        secureStorage.setItem("token", token);
      },
      setRefreshToken: (refreshToken) => {
        set({ refreshToken });
        secureStorage.setItem("refreshToken", refreshToken);
      },
      setLocation: (location) => {
        set({ location });
        secureStorage.setItem("location", JSON.stringify(location));
      },
      setSelectedBusiness: (selectedBusiness) => {
        set({ selectedBusiness });
        secureStorage.setItem("selectedBusiness", selectedBusiness);
      },
      setNewUser: (newUser) => {
        set({ newUser });
        secureStorage.setItem("newUser", JSON.stringify(newUser));
      },
      setCart: (cart) => {
        set({ cart });
        secureStorage.setItem("cart", JSON.stringify(cart));
      },
      setPromoCode: (promoCode) => {
        set({ promoCode });
        secureStorage.setItem("promoCode", promoCode);
      },
      addOrder: (order) => {
        set((state) => {
          const updatedOrders = [...state.orders, order];
          secureStorage.setItem("orders", JSON.stringify(updatedOrders));
          return { orders: updatedOrders };
        });
      },
      clearOrders: () => {
        set({ orders: [] });
        secureStorage.removeItem("orders");
      setBiometricAuth: (status) => {
        set({ biometricAuth: status });
        secureStorage.setItem("biometricAuth", JSON.stringify(status));
      },
      clearStorage: () => {
        set({
          userId: null,
          token: null,
          refreshToken: null,
          location: null,
          selectedBusiness: null,
          cart: { showCart: false, merchant: "", cartId: "" },
          promoCode: null,
          orders: [],
          biometricAuth: false,
        });
        secureStorage.removeItem("userId");
        secureStorage.removeItem("token");
        secureStorage.removeItem("refreshToken");
        secureStorage.removeItem("location");
        secureStorage.removeItem("selectedBusiness");
        secureStorage.removeItem("cart");
        secureStorage.removeItem("promoCode");
        secureStorage.removeItem("orders");
        secureStorage.removeItem("biometricAuth");
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => secureStorage),
    }
  )
);
