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
};

export type ButtonProps = {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  isLoading?: boolean;
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
  landmark: string;
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
  variantTypeId: null;
}

interface ProductId {
  id: string;
  productName: string;
  description: string;
  productImageURL: string;
}
