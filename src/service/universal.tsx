import { appAxios } from "@/config/apiInterceptor";
import { Alert } from "react-native";

export const getBusinessCategories = async (
  latitude: number,
  longitude: number,
  query: string
) => {
  try {
    const res = await appAxios.post(
      "/customers/all-business-categories",
      {
        latitude,
        longitude,
      },
      { params: { query } }
    );

    if (res.status === 200) {
      return res.data.data;
    } else {
      throw new Error("Failed to fetch categories");
    }
  } catch (err) {
    console.error(`Error in getting business categories:`, err);
    Alert.alert("Error", "Something went wrong!");
    return [];
  }
};

export const getMerchants = async (
  latitude: number,
  longitude: number,
  categoryId: string,
  filter: string,
  query: string
) => {
  try {
    const res = await appAxios.post(
      "/customers/list-restaurants",
      {
        latitude,
        longitude,
        businessCategoryId: categoryId,
        filter,
      },
      { params: { query } }
    );

    if (res.status === 200) {
      return res.data.data;
    } else {
      throw new Error("Failed to fetch categories");
    }
  } catch (err) {
    console.error(`Error in getting merchants:`, err);
    Alert.alert("Error", "Something went wrong!");
    return [];
  }
};

export const toggleMerchantFavorite = async (
  merchantId: string,
  businessCategoryId: string | null
) => {
  try {
    const res = await appAxios.patch(
      `/customers/toggle-merchant-favorite/${merchantId}/${businessCategoryId}`,
      {}
    );

    if (res.status === 200) {
      return true;
    } else {
      throw new Error("Failed to fetch categories");
    }
  } catch (err) {
    console.error(`Error in toggle merchant favorite:`, err);
    Alert.alert("Error", "Something went wrong!");
    return false;
  }
};

export const getAllCategory = async (
  merchantId: string,
  businessCategoryId: string,
  page: number,
  limit: number
) => {
  try {
    const res = await appAxios.get(`/customers/category`, {
      params: {
        merchantId,
        businessCategoryId,
        page,
        limit,
      },
    });

    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Failed to fetch categories");
    }
  } catch (err) {
    console.error(`Error in getting merchant category:`, err);
    Alert.alert("Error", "Something went wrong!");
    return [];
  }
};

export const getAllProducts = async (
  categoryId: string,
  customerId: string,
  page: number,
  limit: number
) => {
  try {
    const res = await appAxios.get(`/customers/products`, {
      params: {
        categoryId,
        customerId,
        page,
        limit,
      },
    });

    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Failed to fetch products");
    }
  } catch (err) {
    console.error(`Error in getting merchant products:`, err);
    Alert.alert("Error", "Something went wrong!");
    return [];
  }
};

export const getMerchantData = async (
  merchantId: string,
  latitude: number,
  longitude: number
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
    Alert.alert("Error", "Something went wrong!");
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
    Alert.alert("Error", "Something went wrong!");
    return [];
  }
};

export const toggleProductFavorite = async (productId: string) => {
  try {
    const res = await appAxios.patch(
      `/customers/toggle-product-favorite/${productId}`,
      {}
    );

    if (res.status === 200) {
      return true;
    } else {
      throw new Error("Failed to fetch variants");
    }
  } catch (err) {
    console.error(`Error in toggling product favorite:`, err);
    Alert.alert("Error", "Something went wrong!");
    return false;
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
    Alert.alert("Error", "Something went wrong!");
    return false;
  }
};

export const getMerchantBanners = async (merchantId: string) => {
  try {
    const res = await appAxios.get(`/customers/merchant-banner/${merchantId}`);

    return res.status === 200 ? res.data : [];
  } catch (err) {
    console.error(`Error in getting merchant banners:`, err);
    Alert.alert("Error", "Something went wrong!");
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
    Alert.alert("Error", "Something went wrong!");
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
    Alert.alert("Error", "Something went wrong!");
    return { haveCart: false, merchant: "", cartId: "" };
  }
};

export const clearCart = async (cartId: string) => {
  try {
    const res = await appAxios.delete(`/customers/clear-cart/${cartId}`);

    return res.status === 200 ? true : false;
  } catch (err) {
    console.error(`Error in clearing cart:`, err);
    Alert.alert("Error", "Something went wrong!");
    return false;
  }
};

export const getCustomerCart = async () => {
  try {
    const res = await appAxios.get(`/customers/get-cart`);

    return res.status === 200 ? res.data.data : null;
  } catch (err) {
    console.error(`Error in getting cart:`, err);
    Alert.alert("Error", "Something went wrong!");
    return null;
  }
};

export const confirmOrder = async (cartDetail: any) => {
  try {
    const res = await appAxios.post(
      `/customers/cart/add-details`,
      cartDetail,
      {}
    );

    return res.status === 200 ? true : false;
  } catch (err) {
    console.error(`Error in clearing cart:`, err);
    Alert.alert("Error", "Something went wrong!");
    return false;
  }
};
