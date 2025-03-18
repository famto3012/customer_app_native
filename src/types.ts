import {
  ImageSourcePropType,
  TextInput,
  TextInputProps,
  TextProps,
  TextStyle,
  ViewStyle,
} from "react-native";

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
  iconStyle?: ViewStyle;
};

export type ButtonProps = {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  isLoading?: boolean;
  labelColor?: string;
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
};

export type AddCartButtonProps = {
  onIncrement: () => void;
  onDecrement: () => void;
  onPress: () => void;
  count: number;
  inventory: boolean;
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

export type AddressProps = {
  id: string;
  fullName: string;
  phoneNumber: string;
  flat: string;
  area: string;
  landmark?: string;
  coordinates: number[];
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
  quantity: number | string;
  unit: string;
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
  id?: string;
  type: string | null;
  fullName: string | null;
  phoneNumber: string | null;
  flat: string | null;
  area: string | null;
  landmark: string | null;
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
