// import { create } from "zustand";
// import { createJSONStorage, persist } from "zustand/middleware";
// import { MMKV } from "react-native-mmkv";

// // Create MMKV storage instance
// const storage = new MMKV();

// const secureStorage = {
//   setItem: (key: string, value: string) => {
//     storage.set(key, value);
//   },
//   getItem: (key: string): string | null => {
//     const value = storage.getString(key);
//     return value === undefined ? null : value;
//   },
//   removeItem: (key: string) => {
//     storage.delete(key);
//   },
// };

// interface Order {
//   orderId: string;
//   createdAt: Date;
// }

// interface AuthStore {
//   userId: string | null;
//   token: string | null;
//   refreshToken: string | null;
//   location: { latitude: number; longitude: number } | null;
//   selectedBusiness: string | null;
//   newUser: boolean;
//   cart: { showCart: boolean; merchant: string; cartId: string };
//   promoCode: string | null;
//   fcmToken: string | null;
//   orders: Order[];
//   biometricAuth: boolean;
//   selectedMerchant: { merchantId: string | null; merchantName: string | null };
//   setUserId: (userId: string) => void;
//   setToken: (token: string) => void;
//   setRefreshToken: (refreshToken: string) => void;
//   setLocation: (location: { latitude: number; longitude: number }) => void;
//   setSelectedBusiness: (business: string) => void;
//   setNewUser: (newUser: boolean) => void;
//   setPromoCode: (code: string) => void;
//   setFcmToken: (code: string) => void;
//   setCart: (cart: {
//     showCart: boolean;
//     merchant: string;
//     cartId: string;
//   }) => void;
//   addOrder: (order: Order) => void;
//   clearOrders: () => void;
//   clearFcmToken: () => void;
//   setBiometricAuth: (status: boolean) => void;
//   setSelectedMerchant: (merchantId: string, merchantName: string) => void;
//   clearStorage: () => void;
// }

// export const useAuthStore = create<AuthStore>()(
//   persist(
//     (set) => ({
//       userId: null,
//       token: null,
//       refreshToken: null,
//       location: null,
//       selectedBusiness: null,
//       newUser: true,
//       cart: { showCart: false, merchant: "", cartId: "" },
//       promoCode: null,
//       fcmToken: null,
//       orders: [],
//       biometricAuth: false,
//       selectedMerchant: { merchantId: null, merchantName: null },

//       setUserId: (userId) => {
//         set({ userId });
//         secureStorage.setItem("userId", userId);
//       },
//       setToken: (token) => {
//         set({ token });
//         secureStorage.setItem("token", token);
//       },
//       setRefreshToken: (refreshToken) => {
//         set({ refreshToken });
//         secureStorage.setItem("refreshToken", refreshToken);
//       },
//       setLocation: (location) => {
//         set({ location });
//         secureStorage.setItem("location", JSON.stringify(location));
//       },
//       setSelectedBusiness: (selectedBusiness) => {
//         set({ selectedBusiness });
//         secureStorage.setItem("selectedBusiness", selectedBusiness);
//       },
//       setNewUser: (newUser) => {
//         set({ newUser });
//         secureStorage.setItem("newUser", JSON.stringify(newUser));
//       },
//       setCart: (cart) => {
//         set({ cart });
//         secureStorage.setItem("cart", JSON.stringify(cart));
//       },
//       setPromoCode: (promoCode) => {
//         set({ promoCode });
//         secureStorage.setItem("promoCode", promoCode);
//       },
//       setFcmToken: (fcmToken) => {
//         set({ fcmToken });
//         secureStorage.setItem("fcmToken", fcmToken);
//       },
//       addOrder: (order) => {
//         set((state) => {
//           const updatedOrders = [...state.orders, order];
//           secureStorage.setItem("orders", JSON.stringify(updatedOrders));
//           return { orders: updatedOrders };
//         });
//       },
//       clearOrders: () => {
//         set({ orders: [] });
//         secureStorage.removeItem("orders");
//       },
//       clearFcmToken: () => {
//         set({ fcmToken: null });
//         secureStorage.removeItem("fcmToken");
//       },
//       setBiometricAuth: (status) => {
//         set({ biometricAuth: status });
//         secureStorage.setItem("biometricAuth", JSON.stringify(status));
//       },
//       setSelectedMerchant: (merchantId, merchantName) => {
//         const selectedMerchant = { merchantId, merchantName };
//         set({ selectedMerchant });
//         secureStorage.setItem(
//           "selectedMerchant",
//           JSON.stringify(selectedMerchant)
//         );
//       },

//       clearStorage: () => {
//         set({
//           userId: null,
//           token: null,
//           refreshToken: null,
//           location: null,
//           selectedBusiness: null,
//           cart: { showCart: false, merchant: "", cartId: "" },
//           promoCode: null,
//           orders: [],
//         });
//         secureStorage.removeItem("userId");
//         secureStorage.removeItem("token");
//         secureStorage.removeItem("refreshToken");
//         secureStorage.removeItem("location");
//         secureStorage.removeItem("selectedBusiness");
//         secureStorage.removeItem("cart");
//         secureStorage.removeItem("promoCode");
//         secureStorage.removeItem("orders");
//       },
//     }),
//     {
//       name: "auth-store",
//       storage: createJSONStorage(() => secureStorage),
//     }
//   )
// );
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import * as Keychain from "react-native-keychain";

const secureStorage = {
  setItem: async (key: string, value: string) => {
    await Keychain.setGenericPassword(key, value);
  },
  getItem: async (key: string) => {
    const credentials = await Keychain.getGenericPassword();
    return credentials && credentials.username === key
      ? credentials.password
      : null;
  },
  removeItem: async (key: string) => {
    const credentials = await Keychain.getGenericPassword();
    if (credentials && credentials.username === key) {
      await Keychain.resetGenericPassword();
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
  cart: { showCart: boolean; merchant: string; cartId: string };
  promoCode: string | null;
  fcmToken: string | null;
  orders: Order[];
  biometricAuth: boolean;
  selectedMerchant: { merchantId: string | null; merchantName: string | null };
  setUserId: (userId: string) => void;
  setToken: (token: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  setLocation: (location: { latitude: number; longitude: number }) => void;
  setSelectedBusiness: (business: string) => void;
  setNewUser: (newUser: boolean) => void;
  setPromoCode: (code: string) => void;
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
      fcmToken: null,
      orders: [],
      biometricAuth: false,
      selectedMerchant: { merchantId: null, merchantName: null },

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
      setPromoCode: async (promoCode) => {
        set({ promoCode });
        await secureStorage.setItem("promoCode", promoCode);
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
      clearStorage: async () => {
        set({
          userId: null,
          token: null,
          refreshToken: null,
          location: null,
          selectedBusiness: null,
          cart: { showCart: false, merchant: "", cartId: "" },
          promoCode: null,
          orders: [],
        });
        await secureStorage.removeItem("userId");
        await secureStorage.removeItem("token");
        await secureStorage.removeItem("refreshToken");
        await secureStorage.removeItem("location");
        await secureStorage.removeItem("selectedBusiness");
        await secureStorage.removeItem("cart");
        await secureStorage.removeItem("promoCode");
        await secureStorage.removeItem("orders");
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => secureStorage),
    }
  )
);
