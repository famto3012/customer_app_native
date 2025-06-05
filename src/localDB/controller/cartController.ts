import { database } from "@/localDB/database";
import Cart from "@/localDB/models/Cart";
import { useAuthStore } from "@/store/store";

export const clearCart = async () => {
  await database.write(async () => {
    await database.get<Cart>("cart").query().destroyAllPermanently();
  });
  useAuthStore.setState({
    cart: { showCart: false, merchant: "", cartId: "" },
  });
};

export const updateCart = async (
  merchantId: string,
  productId: string,
  productName: string,
  price: number,
  newQuantity: number,
  variantTypeId?: string,
  variantTypeName?: string
) => {
  const cartCollection = database.get<Cart>("cart");

  // Fetch existing cart items
  const cartItems = await cartCollection.query().fetch();

  // If merchantId is different, clear the cart
  if (cartItems.length > 0 && cartItems[0].merchantId !== merchantId) {
    await clearCart();
  }

  // Check if the item exists in the cart
  const existingItem = cartItems.find(
    (item) =>
      item.merchantId === merchantId &&
      item.productId === productId &&
      (!variantTypeId || item.variantTypeId === variantTypeId)
  );

  await database.write(async () => {
    if (existingItem) {
      if (newQuantity === 0) {
        await existingItem.destroyPermanently();
      } else {
        await existingItem.update((cartItem) => {
          cartItem.quantity = newQuantity;
        });
      }
    } else {
      // Add new product
      await cartCollection.create((product) => {
        product.merchantId = merchantId;
        product.productId = productId;
        product.productName = productName;
        product.price = price;
        product.quantity = newQuantity;
        if (variantTypeId) {
          product.variantTypeId = variantTypeId;
          product.variantTypeName = variantTypeName;
        }
      });
    }
  });

  const updatedCartItems = await cartCollection.query().fetch();

  if (updatedCartItems.length === 0) {
    await clearCart();
  } else {
    useAuthStore.setState({
      cart: {
        showCart: updatedCartItems.length > 0,
        merchant: useAuthStore.getState().selectedMerchant?.merchantName || "",
        merchantId: useAuthStore.getState().selectedMerchant?.merchantId || "",
        cartId: "",
      },
    });
  }
};

export const getCartItems = async (): Promise<any[]> => {
  const cartItems = await database.get<Cart>("cart").query().fetch();

  return cartItems.map((item) => ({
    // id: item.id,
    // merchantId: item.merchantId,
    productId: item.productId,
    price: item.price,
    quantity: item.quantity,
    variantTypeId: item.variantTypeId,
  }));
};

export const getItemsWithVariants = async (productId: string) => {
  const cartItems = await database.get<Cart>("cart").query().fetch();

  return cartItems
    .filter((item) => item.variantTypeId && item.productId === productId)
    .map((item) => ({
      productId: item.productId,
      productName: item.productName,
      price: item.price,
      variantTypeId: item.variantTypeId || "",
      variantTypeName: item.variantTypeName || "",
      quantity: item.quantity,
    }));
};

export const getTotalPrice = async (): Promise<number> => {
  const cartItems = await getCartItems();
  return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
};
