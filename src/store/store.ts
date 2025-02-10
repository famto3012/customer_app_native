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

interface AuthStore {
  userId: string | null;
  token: string | null;
  refreshToken: string | null;
  location: { latitude: number; longitude: number } | null;
  selectedBusiness: string | null;
  newUser: boolean;
  cart: { showCart: boolean; merchant: string; cartId: string };
  setUserId: (userId: string) => void;
  setToken: (token: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  setLocation: (location: { latitude: number; longitude: number }) => void;
  setSelectedBusiness: (business: string) => void;
  setNewUser: (newUser: boolean) => void;
  setCart: (cart: {
    showCart: boolean;
    merchant: string;
    cartId: string;
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
        set({ cart }); // ✅ Properly updating `cart` object
        secureStorage.setItem("cart", JSON.stringify(cart));
      },
      clearStorage: () => {
        set({
          userId: null,
          token: null,
          refreshToken: null,
          location: null,
          selectedBusiness: null,
          cart: { showCart: false, merchant: "", cartId: "" },
        });
        secureStorage.removeItem("userId");
        secureStorage.removeItem("token");
        secureStorage.removeItem("refreshToken");
        secureStorage.removeItem("location");
        secureStorage.removeItem("selectedBusiness");
        secureStorage.removeItem("cart");
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => secureStorage),
    }
  )
);
