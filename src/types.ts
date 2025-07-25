import {
  ImageSourcePropType,
  ImageStyle,
  TextInput,
  TextInputProps,
  TextProps,
  TextStyle,
  ViewStyle,
} from "react-native";

export type DeliveryOptionType = "On-demand" | "Scheduled" | "Both";

export type PaymentOptionType =
  | "Cash-on-delivery"
  | "Famto-cash"
  | "Online-payment";

export type ScreenWrapperProps = {
  style?: ViewStyle;
  children: React.ReactNode;
};

export type TypoProps = {
  size?: number;
  color?: string;
  fontWeight?: TextStyle["fontWeight"];
  children: any | null;
  style?: TextStyle;
  textProps?: TextProps;
  fontFamily?: "Light" | "Regular" | "Medium" | "SemiBold" | "Bold";
};

export type HeaderProps = {
  title: string;
  icon?: ImageSourcePropType;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
  iconSize?: number;
  onPress?: () => void;
  iconStyle?: ImageStyle;
};

export type ButtonProps = {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  isLoading?: boolean;
  labelColor?: string;
  icon?: React.ReactNode;
};

export interface InputProps extends TextInputProps {
  icon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  inputRef?: React.RefObject<TextInput>;
}

export type BusinessCategoryProps = {
  id: string;
  title: string;
  bannerImageURL: string;
};

export type SearchProps = {
  placeHolder: string;
  onChangeText: (data: string) => void;
  capitalize?: boolean;
};

export type AuthPayload = {
  phoneNumber: string;
  latitude: number;
  longitude: number;
};

export type MerchantCardProps = {
  id: string;
  merchantName: string;
  description: string | null;
  averageRating: number;
  status: boolean;
  restaurantType: string;
  merchantImageURL: string;
  displayAddress: string;
  preOrderStatus: boolean;
  isFavorite: boolean;
  rating: number | 0;
  redirectable: boolean;
  businessCategoryId: string;
};

export type MerchantDataProps = {
  merchantName: string;
  distanceInKM: number;
  deliveryTime: number;
  description: string;
  displayAddress: string;
  preOrderStatus: boolean;
  rating: number;
  phoneNumber: string;
  fssaiNumber: string;
  isFavourite: boolean;
  distanceWarning: boolean;
  type: "Specific-time" | "Full-time";
  todayAvailability: {
    openAllDay: boolean;
    closedAllDay: boolean;
    specificTime: boolean;
    startTime: string;
    endTime: string;
  };
  nextDay: {
    day: string;
    startTime: string;
  };
} | null;

export type CategoryProps = {
  categoryId: string;
  categoryName: string;
  status: boolean;
};

export type ProductProps = {
  productId: string;
  merchantId: string;
  productName: string;
  price: number;
  discountPrice: number | null;
  minQuantityToOrder: number | null;
  maxQuantityPerOrder: number | null;
  isFavorite: boolean;
  preparationTime: number | null;
  description: string | null;
  longDescription: string | null;
  type: string;
  productImageURL: string;
  inventory: boolean;
  variantAvailable: boolean;
  cartCount?: number;
  redirectable?: boolean;
  businessCategoryId?: string | null;
};

export type AddCartButtonProps = {
  onIncrement: () => void;
  onDecrement: () => void;
  onPress: () => void;
  count: number;
  inventory: boolean;
  customizable: boolean;
};

export type Variant = {
  variantName: string;
  variantTypes: VariantType[];
  _id: string;
};

export type VariantType = {
  typeName: string;
  price: number;
  _id: string;
  discountPrice: number;
};

export type AddVariantProps = {
  productId: string;
  quantity: number;
  variantTypeId: string;
};

export type OrderItemProps = {
  orderId: string;
  merchantName: string;
  displayAddress: string;
  deliveryMode: string;
  orderStatus: string;
  orderDate: string;
  orderTime: string;
  grandTotal: number;
};

export type ScheduledOrderItemProps = {
  orderId: string;
  merchantName: string;
  displayAddress: string;
  deliveryMode: string;
  startDate: string;
  endDate: string;
  time: string;
  orderStatus: string;
  numberOfDays: number;
  grandTotal: number;
};

export type CartProps = {
  showCart: boolean;
  cartId: string;
  customerId: string;
  merchantId: string;
  items: Item[];
  deliveryOption: null;
  itemLength: number;
};

interface Item {
  productId: ProductId;
  quantity: number;
  price: number;
  variantTypeId: { id: string; variantTypeName: string } | null;
}

interface ProductId {
  id: string;
  productName: string;
  description: string;
  productImageURL: string;
}

export type UserProfileProps = {
  customerId: string;
  fullName: string;
  email: string;
  imageURL: string;
  phoneNumber: string;
};

export type CustomOrderItemsProps = {
  itemId?: string;
  itemName: string;
  quantity?: number | string;
  unit?: string;
  numOfUnits: number;
  itemImage?: string;
};

export type AddCustomStoreProps = {
  latitude: number | null;
  longitude: number | null;
  shopName: string;
  place: string;
  buyFromAnyWhere: boolean;
};

export type AddStoreResponse = {
  cartId: string;
  shopName: string;
  place: string;
  distance: number | null;
  duration: number | null;
};

export type CustomCartBill = {
  deliveryCharge: number | null;
  discountedAmount: number | null;
  grandTotal: number | null;
  taxAmount: number | null;
  itemTotal: number | null;
  addedTip: number | null;
  subTotal: number | null;
  surgePrice: number | null;
  promoCodeUsed: string | null;
} | null;

export type PickAndDropItemProps = {
  itemName: string;
  length: string | number;
  width: string | number;
  height: string | number;
  unit: string;
  weight: string | number;
};

export type LocationAddressProps = {
  placeType: string | null;
  address: string | null;
  state: string | null;
  pinCode: string | null;
  district: string | null;
  locality: string | null;
  poi: string | null;
};

export type UserAddressProps = {
  id: string;
  type: string;
  fullName: string | null;
  phoneNumber: string | null;
  flat: string | null;
  area: string | null;
  landmark?: string;
  coordinates: number[] | null;
};

export type PickAndDropCartBill = {
  deliveryCharge: number | null;
  discountedAmount: number | null;
  grandTotal: number | null;
  taxAmount: number | null;
  itemTotal: number | null;
  addedTip: number | null;
  subTotal: number | null;
  surgePrice: number | null;
  promoCodeUsed: string | null;
} | null;

export type SelectedAddress = {
  type: string;
  otherId: string;
  address: string;
};

export type PromoCodeProps = {
  id: string;
  imageURL: string;
  promoCode: string;
  validUpTo: string;
  minOrderAmount: number;
  status: boolean;
  promoType: string;
  discount: number;
  description?: string;
  maxDiscountValue: number;
};

export type AppBannerType = {
  name: string;
  imageUrl: string;
  businessCategoryId: string;
  merchantId: string;
  merchantName: string;
};
