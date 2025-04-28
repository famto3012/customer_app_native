import { appAxios } from "@/config/apiInterceptor";
import { useData } from "@/context/DataContext";
import { BusinessCategoryProps, DeliveryOptionType } from "@/types";
import { Alert, Platform, ToastAndroid } from "react-native";
import RazorpayCheckout from "react-native-razorpay";

export const getBusinessCategories = async (
  latitude: number,
  longitude: number,
  query: string
): Promise<{ outside: boolean; data: BusinessCategoryProps[] }> => {
  try {
    const res = await appAxios.post(
      "/customers/all-business-categories",
      {
        latitude,
        longitude,
      },
      { params: { query } }
    );

    if (res.status === 200 && res.data.outside) {
      return { outside: true, data: [] };
    }

    return { outside: false, data: res.data.data };
  } catch (err: any) {
    console.error(
      `Error in getting business categories:`,
      JSON.stringify(err.response.data)
    );
    if (Platform.OS === "android") {
      ToastAndroid.showWithGravity(
        "Something went wrong",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    } else {
      Alert.alert("", "Something went wrong");
    }

    return { outside: false, data: [] };
  }
};

export const getMerchants = async (
  latitude: number,
  longitude: number,
  categoryId: string,
  filterType: string,
  query: string,
  productName: string,
  merchantId: string,
  page: number,
  limit: number
) => {
  try {
    const res = await appAxios.get("/customers/filter-and-search-merchants", {
      params: {
        query,
        latitude,
        longitude,
        businessCategoryId: categoryId,
        filterType,
        productName,
        merchantId,
        page,
        limit,
      },
    });

    if (res.status === 200) {
      return {
        data: res.data,
        hasNextPage: res.data.length === limit,
      };
    } else {
      return {
        data: [],
        hasNextPage: false,
      };
    }
  } catch (err) {
    console.error(`Error in getting merchants:`, err);
    if (Platform.OS === "android") {
      ToastAndroid.showWithGravity(
        "Something went wrong",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    } else {
      Alert.alert("", "Something went wrong");
    }

    // Ensure function always returns an object
    return {
      data: [],
      hasNextPage: false,
    };
  }
};

export const toggleMerchantFavorite = async (
  merchantId: string,
  businessCategoryId: string | null
): Promise<{ success: boolean; message: string }> => {
  try {
    const res = await appAxios.patch(
      `/customers/toggle-merchant-favorite/${merchantId}/${businessCategoryId}`,
      {}
    );

    return res.status === 200
      ? res.data
      : { success: false, message: "Failed" };
  } catch (err) {
    console.error(`Error in toggle merchant favorite:`, err);
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

export const fetchCategory = async (
  merchantId: string,
  businessCategoryId: string,
  page: number
) => {
  try {
    const res = await appAxios.get(`/customers/category`, {
      params: { merchantId, businessCategoryId, page },
    });

    return {
      data: res.data.data[0] || null,
      hasNextPage: res.data.hasNextPage,
    };
  } catch (err) {
    return { data: null, hasNextPage: false };
  }
};

export const fetchProduct = async (
  categoryId: string,
  customerId: string,
  page: number,
  filter?: string
) => {
  try {
    const res = await appAxios.get(`/customers/products`, {
      params: { categoryId, customerId, page, filter },
    });

    return { data: res.data.data, hasNextPage: res.data.hasNextPage };
  } catch (err) {
    return { data: [], hasNextPage: false };
  }
};

export const getMerchantData = async (
  merchantId: string,
  latitude?: number,
  longitude?: number
) => {
  try {
    const res = await appAxios.get("/customers/merchant-data", {
      params: {
        latitude,
        longitude,
        merchantId,
      },
    });

    return res.status === 200 ? res.data : {};
  } catch (err) {
    console.error(`Error in getting merchant data:`, err);
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

export const getVariants = async (productId: string) => {
  try {
    const res = await appAxios.get(
      `/customers/merchant/product/${productId}/variants`
    );

    if (res.status === 200) {
      return res.data.data;
    } else {
      throw new Error("Failed to fetch variants");
    }
  } catch (err) {
    console.error(`Error in getting variants:`, err);
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

export const toggleProductFavorite = async (
  productId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const res = await appAxios.patch(
      `/customers/toggle-product-favorite/${productId}`,
      {}
    );

    return res.status === 200
      ? res.data
      : { success: false, message: "Failed" };
  } catch (err) {
    console.error(`Error in toggling product favorite:`, err);
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

export const addRatingsToMerchant = async (
  merchantId: string,
  rating: number,
  review?: string
) => {
  try {
    const res = await appAxios.post(`/customers/rate-merchant/${merchantId}`, {
      rating,
      review,
    });

    if (res.status === 200) {
      return true;
    } else {
      throw new Error("Failed to rate merchant");
    }
  } catch (err) {
    console.error(`Error in rating merchant:`, err);
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

export const getMerchantBanners = async (merchantId: string) => {
  try {
    const res = await appAxios.get(`/customers/merchant-banner/${merchantId}`);

    return res.status === 200 ? res.data : [];
  } catch (err) {
    console.error(`Error in getting merchant banners:`, err);
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

export const addProductToCart = async (
  productId: string,
  quantity: number,
  variantTypeId?: string
) => {
  try {
    const res = await appAxios.put("/customers/update-cart", {
      productId,
      quantity,
      variantTypeId,
    });

    return res.status === 200 ? true : false;
  } catch (err) {
    console.error(`Error in updating cart item:`, err);
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

export const haveValidCart = async () => {
  try {
    const res = await appAxios.get("/customers/have-cart");

    return res.status === 200
      ? res.data
      : { haveCart: false, merchant: "", cartId: "" };
  } catch (err) {
    console.error(`Error in checking valid cart existence:`, err);
    if (Platform.OS === "android") {
      ToastAndroid.showWithGravity(
        "Something went wrong",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    } else {
      Alert.alert("", "Something went wrong");
    }
    return { haveCart: false, merchant: "", cartId: "" };
  }
};

export const clearCart = async (cartId: string) => {
  try {
    const res = await appAxios.delete(`/customers/clear-cart/${cartId}`);

    return res.status === 200 ? true : false;
  } catch (err) {
    console.error(`Error in clearing cart:`, err);
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

export const getCustomerCart = async () => {
  try {
    const res = await appAxios.get(`/customers/get-cart`);

    return res.status === 200 ? res.data.data : null;
  } catch (err) {
    console.error(`Error in getting cart:`, err);
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

export const getMerchantDeliveryOption = async (
  merchantId: string
): Promise<DeliveryOptionType> => {
  try {
    const res = await appAxios.get(
      `/customers/merchant/${merchantId}/delivery-option`
    );

    return res.data.data;
  } catch (err) {
    console.error(`Error in getting merchant delivery option:`, err);
    if (Platform.OS === "android") {
      ToastAndroid.showWithGravity(
        "Something went wrong",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    } else {
      Alert.alert("", "Something went wrong");
    }

    return "On-demand";
  }
};

export const confirmOrder = async (cartDetail: any) => {
  try {
    const res = await appAxios.post(`/customers/cart/add-details`, cartDetail, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.error(`Error in clearing cart:`, err);
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

export const getCartBill = async (cartId: string) => {
  try {
    const res = await appAxios.get(`/customers/get-cart-bill`, {
      params: {
        cartId,
      },
    });

    return res.status === 200 ? res.data.billDetail : null;
  } catch (err) {
    console.error(`Error in getting cart bill:`, err);
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

export const addUniversalTip = async (tip: number) => {
  try {
    const res = await appAxios.post(`/customers/add-tip`, {
      tip,
    });

    return res.status === 200 ? true : false;
  } catch (err) {
    console.error(`Error in adding tip:`, err);
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

export const placeUniversalOrder = async (paymentMode: string) => {
  try {
    const res = await appAxios.post(`/customers/confirm-order`, {
      paymentMode,
    });

    return res.data.success ? res.data : null;
  } catch (err) {
    console.error(`Error in placing order:`, err);
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

export const applyUniversalPromoCode = async (promoCode: string) => {
  try {
    const res = await appAxios.post(`/customers/apply-promocode`, {
      promoCode,
    });

    return res.status === 200 ? res.data : null;
  } catch (err: any) {
    const message = err?.response?.data?.message;

    if (
      err?.response?.status === 400 &&
      message === "Promo code is not applicable for this merchant"
    ) {
      // Gracefully handle business logic failure
      if (Platform.OS === "android") {
        ToastAndroid.showWithGravity(
          message,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
      } else {
        Alert.alert("", message);
      }

      return null;
    }

    // For actual unexpected errors
    console.error("Unexpected error in applying promo code:", err);

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

export const getProductsWithVariantsInCart = async (productId: string) => {
  try {
    const res = await appAxios.get(`/customers/products-with-variants`, {
      params: {
        productId,
      },
    });

    return res.status === 200 ? res.data : [];
  } catch (err) {
    console.error(`Error in fetching products with variants in cart:`, err);
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

export const verifyPayment = async (
  orderId: string,
  amount: string | number
): Promise<{
  orderId: string;
  createdAt: string;
  merchantName: string;
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
      description: "Order payment",
      order_id: orderId,
      image:
        "https://res.cloudinary.com/dcfj1j1ku/image/upload/v1743054538/Group_427320859_y8jszt.svg",
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
            const res = await appAxios.post(`/customers/verify-payment`, {
              paymentDetails,
            });

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

export const rateMerchant = async (data: {
  merchantId: string;
  rating: number;
  review?: string;
}) => {
  try {
    const res = await appAxios.post(`/customers/rate-merchant`, data);

    return res.status === 200 ? res.data : null;
  } catch (err) {
    console.error(`Error in rating merchant:`, err);
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

export const addItemsToCart = async (
  merchantId: string,
  items: {
    productId: string;
    price: number;
    quantity: number;
    variantTypeId?: string;
  }[]
) => {
  try {
    const res = await appAxios.post(`/customers/add-items`, {
      merchantId,
      items,
    });

    return res.status === 200 ? res.data.cartId : null;
  } catch (err) {
    console.error(`Error in adding items:`, err);
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

export const filterAndSearchProducts = async (
  merchantId: string,
  filter?: string,
  query?: string
) => {
  try {
    const res = await appAxios.get(
      `/customers/products/filter-and-sort/${merchantId}`,
      {
        params: {
          filter,
          productName: query,
        },
      }
    );

    return res.status === 200 ? res.data : [];
  } catch (err) {
    console.error(`Error in searching products:`, err);
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

export const cancelOrder = async (
  orderId: string,
  deliveryMode: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const endPoint =
      deliveryMode === "Universal"
        ? `/customers/cancel-universal-order`
        : deliveryMode === "Pick-and-drop"
        ? `/customers/cancel-pick-and-drop-order`
        : `/customers/cancel-custom-order`;

    const res = await appAxios.post(endPoint, {
      orderId,
    });

    return res.status === 200
      ? res.data
      : { success: false, message: "Order not found or already confirmed" };
  } catch (err) {
    if (Platform.OS === "android") {
      ToastAndroid.showWithGravity(
        "Order already confirmed or not found",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    } else {
      Alert.alert("Error", "Order already confirmed or not found");
    }

    console.error(`Error in cancelling order:`, JSON.stringify(err));
    return { success: false, message: "Error while cancelling order" };
  }
};
