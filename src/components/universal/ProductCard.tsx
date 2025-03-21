// import { Image, Pressable, StyleSheet, View } from "react-native";
// import { FC, memo, useCallback, useEffect, useState } from "react";
// import { ProductProps } from "@/types";
// import { scale, verticalScale } from "@/utils/styling";
// import Typo from "../Typo";
// import { colors, radius, spacingX } from "@/constants/theme";
// import AddCartButton from "./AddCartButton";
// import { Heart } from "phosphor-react-native";
// import { toggleProductFavorite } from "@/service/universal";
// import { useAuthStore } from "@/store/store";
// import { router, useFocusEffect } from "expo-router";
// import { useMutation } from "@tanstack/react-query";
// import { Grayscale } from "react-native-color-matrix-image-filters";
// import { updateCart } from "@/localDB/controller/cartController";
// import { database } from "@/localDB/database";
// import Cart from "@/localDB/models/Cart";
// import FastImage from "react-native-fast-image";

// const ProductCard: FC<{
//   item: ProductProps;
//   openVariant?: (product: ProductProps) => void;
//   cartCount?: number | null;
//   isFocused: boolean;
//   showAddCart: boolean;
//   trigger?: string;
//   onProductPress: (product: ProductProps) => void;
// }> = ({
//   item,
//   openVariant,
//   cartCount,
//   isFocused,
//   showAddCart,
//   trigger,
//   onProductPress,
// }) => {
//   const [isFavorite, setIsFavorite] = useState<boolean>(item.isFavorite);
//   const [count, setCount] = useState<number | null>(cartCount || null);

//   const { token, selectedMerchant } = useAuthStore.getState();

//   useFocusEffect(
//     useCallback(() => {
//       const fetchCartQuantity = async () => {
//         if (!selectedMerchant?.merchantId) {
//           return;
//         }

//         try {
//           const cartCollection = database.get<Cart>("cart");
//           const allCartItems = await cartCollection.query().fetch();

//           const filteredCartItems = allCartItems.filter(
//             (cartItem) =>
//               cartItem.merchantId === selectedMerchant.merchantId &&
//               cartItem.productId === item.productId &&
//               cartItem.quantity > 0
//           );

//           const totalQuantity = filteredCartItems.reduce(
//             (sum, cartItem) => sum + cartItem.quantity,
//             0
//           );

//           setCount(totalQuantity);
//         } catch (error) {
//           console.error("❌ Error fetching cart quantity:", error);
//         }
//       };

//       fetchCartQuantity();
//     }, [item, selectedMerchant, trigger, isFocused])
//   );

//   useEffect(() => {
//     cartCount ? setCount(cartCount) : setCount(null);
//   }, [cartCount]);

//   const handleFavoriteMutation = useMutation({
//     mutationKey: ["product-favorite", item.productId],
//     mutationFn: () => toggleProductFavorite(item.productId),
//     onSuccess: () => setIsFavorite(!isFavorite),
//   });

//   const isUserAuthenticated = () => {
//     if (!token) {
//       router.push({ pathname: "/auth", params: { showSkip: 0 } });
//       return false;
//     }
//     return true;
//   };

//   const handleDecrement = () => {
//     if (!isUserAuthenticated()) return;
//     if (!item.inventory) return;

//     if (item.variantAvailable) {
//       openVariant?.({ ...item, cartCount: count ? count : 0 });
//     } else {
//       const newQuantity = count ? count - 1 : 1;
//       newQuantity === 0 ? setCount(null) : setCount(newQuantity);
//       updateCart(
//         selectedMerchant?.merchantId || "",
//         item.productId,
//         item.productName,
//         item.price,
//         newQuantity
//       );
//     }
//   };

//   const handleIncrement = () => {
//     if (!isUserAuthenticated()) return;
//     if (!item.inventory) return;

//     if (item.variantAvailable) {
//       openVariant?.({ ...item, cartCount: count ? count + 1 : 1 });
//     } else {
//       const newQuantity = count ? count + 1 : 1;
//       console.log("newQuantity", newQuantity);
//       setCount(newQuantity);
//       updateCart(
//         selectedMerchant?.merchantId || "",
//         item.productId,
//         item.productName,
//         item.price,
//         newQuantity
//       );
//     }
//   };

//   return (
//     <>
//       <View style={styles.container}>
//         <View>
//           <Pressable onPress={() => onProductPress(item)}>
//             {!item.inventory ? (
//               <Grayscale>
//                 <FastImage
//                   source={{
//                     uri: item.productImageURL,
//                     priority: FastImage.priority.high,
//                   }}
//                   style={styles.image}
//                   resizeMode="cover"
//                 />
//               </Grayscale>
//             ) : (
//               <FastImage
//                 source={{
//                   uri: item.productImageURL,
//                   priority: FastImage.priority.high,
//                 }}
//                 style={styles.image}
//                 resizeMode="cover"
//               />
//             )}
//           </Pressable>

//           <Pressable
//             onPress={() => handleFavoriteMutation.mutate()}
//             style={{ position: "absolute", right: 0, padding: scale(7) }}
//           >
//             <Heart
//               color={isFavorite ? colors.RED : colors.WHITE}
//               weight={isFavorite ? "fill" : "regular"}
//             />
//           </Pressable>

//           {showAddCart && (
//             <AddCartButton
//               onDecrement={handleDecrement}
//               onIncrement={handleIncrement}
//               onPress={handleIncrement}
//               count={count ? count : 0}
//               inventory={item?.inventory}
//             />
//           )}
//         </View>

//         <View style={styles.contentContainer}>
//           <Typo
//             size={14}
//             color={colors.NEUTRAL800}
//             fontFamily="Medium"
//             textProps={{ numberOfLines: 2 }}
//           >
//             {item.productName}
//           </Typo>

//           <View style={styles.priceContainer}>
//             <Typo
//               size={14}
//               color={colors.NEUTRAL400}
//               textProps={{ numberOfLines: 3 }}
//               style={{
//                 display: item?.discountPrice ? "flex" : "none",
//                 textDecorationLine: "line-through",
//               }}
//             >
//               ₹ {item?.price}
//             </Typo>
//             <Typo
//               size={16}
//               color={colors.NEUTRAL800}
//               textProps={{ numberOfLines: 3 }}
//             >
//               ₹ {item?.discountPrice ? item.discountPrice : item.price}
//             </Typo>
//           </View>

//           <Typo
//             size={12}
//             color={colors.NEUTRAL400}
//             textProps={{ numberOfLines: 3 }}
//           >
//             {item?.longDescription ? item?.longDescription : item?.description}
//           </Typo>
//         </View>
//       </View>
//     </>
//   );
// };

// export default memo(ProductCard);

// const styles = StyleSheet.create({
//   container: {
//     marginBottom: verticalScale(40),
//     flexDirection: "row",
//     alignItems: "flex-start",
//     gap: spacingX._15,
//   },
//   image: {
//     width: scale(120),
//     height: scale(120),
//     position: "relative",
//     borderRadius: radius._10,
//   },
//   contentContainer: {
//     flex: 1,
//     paddingTop: verticalScale(10),
//   },
//   priceContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: spacingX._10,
//   },
// });
import { Pressable, StyleSheet, View } from "react-native";
import { FC, memo, useCallback, useEffect, useRef, useState } from "react";
import { ProductProps } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import Typo from "../Typo";
import { colors, radius, spacingX } from "@/constants/theme";
import AddCartButton from "./AddCartButton";
import { Heart } from "phosphor-react-native";
import { toggleProductFavorite } from "@/service/universal";
import { useAuthStore } from "@/store/store";
import { router, useFocusEffect } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { Grayscale } from "react-native-color-matrix-image-filters";
import { updateCart } from "@/localDB/controller/cartController";
import { database } from "@/localDB/database";
import Cart from "@/localDB/models/Cart";
import FastImage from "react-native-fast-image";

const ProductCard: FC<{
  item: ProductProps;
  openVariant?: (product: ProductProps) => void;
  cartCount?: number | null;
  isFocused: boolean;
  showAddCart: boolean;
  trigger?: string;
  onProductPress: (product: ProductProps) => void;
}> = ({
  item,
  openVariant,
  cartCount,
  isFocused,
  showAddCart,
  trigger,
  onProductPress,
}) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(item.isFavorite);
  const [count, setCount] = useState<number | null>(cartCount || null);
  const isUpdatingRef = useRef(false);

  const { token, selectedMerchant } = useAuthStore.getState();

  useFocusEffect(
    useCallback(() => {
      const fetchCartQuantity = async () => {
        if (!selectedMerchant?.merchantId || isUpdatingRef.current) {
          return;
        }

        try {
          const cartCollection = database.get<Cart>("cart");
          const allCartItems = await cartCollection.query().fetch();

          const filteredCartItems = allCartItems.filter(
            (cartItem) =>
              cartItem.merchantId === selectedMerchant.merchantId &&
              cartItem.productId === item.productId &&
              cartItem.quantity > 0
          );

          const totalQuantity = filteredCartItems.reduce(
            (sum, cartItem) => sum + cartItem.quantity,
            0
          );

          if (!isUpdatingRef.current) {
            setCount(totalQuantity > 0 ? totalQuantity : null);
          }
        } catch (error) {
          console.error("❌ Error fetching cart quantity:", error);
        }
      };

      fetchCartQuantity();
    }, [item.productId, selectedMerchant, trigger, isFocused])
  );

  useEffect(() => {
    if (cartCount !== undefined && !isUpdatingRef.current) {
      // setCount(cartCount > 0 ? cartCount : null);
      cartCount ? setCount(cartCount) : setCount(null);
    }
  }, [cartCount]);

  const handleFavoriteMutation = useMutation({
    mutationKey: ["product-favorite", item.productId],
    mutationFn: () => toggleProductFavorite(item.productId),
    onSuccess: () => setIsFavorite(!isFavorite),
  });

  const isUserAuthenticated = () => {
    if (!token) {
      router.push({ pathname: "/auth", params: { showSkip: 0 } });
      return false;
    }
    return true;
  };

  const handleDecrement = async () => {
    if (!isUserAuthenticated()) return;
    if (!item.inventory) return;

    // Set updating flag to prevent interference from useFocusEffect
    isUpdatingRef.current = true;

    try {
      if (item.variantAvailable) {
        openVariant?.({ ...item, cartCount: count ? count : 0 });
      } else {
        const newQuantity = count ? count - 1 : 0;

        // Update state first for immediate UI feedback
        if (newQuantity === 0) {
          setCount(null);
        } else {
          setCount(newQuantity);
        }

        // Update database
        await updateCart(
          selectedMerchant?.merchantId || "",
          item.productId,
          item.productName,
          item.price,
          newQuantity
        );
      }
    } finally {
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 100);
    }
  };

  const handleIncrement = async () => {
    if (!isUserAuthenticated()) return;
    if (!item.inventory) return;

    // Set updating flag to prevent interference from useFocusEffect
    isUpdatingRef.current = true;

    try {
      if (item.variantAvailable) {
        openVariant?.({ ...item, cartCount: count ? count + 1 : 1 });
      } else {
        const newQuantity = count ? count + 1 : 1;

        // Update state first for immediate UI feedback
        setCount(newQuantity);

        // Update database
        await updateCart(
          selectedMerchant?.merchantId || "",
          item.productId,
          item.productName,
          item.price,
          newQuantity
        );
      }
    } finally {
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 100);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          {/* Image Pressable with improved hitSlop for better clickability */}
          <Pressable
            onPress={() => onProductPress(item)}
            style={styles.imagePressable}
            hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
          >
            {!item.inventory ? (
              <Grayscale>
                <FastImage
                  source={{
                    uri: item.productImageURL,
                    priority: FastImage.priority.high,
                  }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </Grayscale>
            ) : (
              <FastImage
                source={{
                  uri: item.productImageURL,
                  priority: FastImage.priority.high,
                }}
                style={styles.image}
                resizeMode="cover"
              />
            )}
          </Pressable>

          {/* Favorite button with improved z-index */}
          <Pressable
            onPress={() => handleFavoriteMutation.mutate()}
            style={styles.favoriteButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Heart
              color={isFavorite ? colors.RED : colors.WHITE}
              weight={isFavorite ? "fill" : "regular"}
            />
          </Pressable>

          {/* Add to cart button with highest z-index */}
          {showAddCart && (
            <View style={styles.addCartButtonContainer}>
              <AddCartButton
                onDecrement={handleDecrement}
                onIncrement={handleIncrement}
                onPress={handleIncrement}
                count={count || 0}
                inventory={item?.inventory}
              />
            </View>
          )}
        </View>

        <View style={styles.contentContainer}>
          <Typo
            size={14}
            color={colors.NEUTRAL800}
            fontFamily="Medium"
            textProps={{ numberOfLines: 2 }}
          >
            {item.productName}
          </Typo>

          <View style={styles.priceContainer}>
            <Typo
              size={14}
              color={colors.NEUTRAL400}
              textProps={{ numberOfLines: 3 }}
              style={{
                display: item?.discountPrice ? "flex" : "none",
                textDecorationLine: "line-through",
              }}
            >
              ₹ {item?.price}
            </Typo>
            <Typo
              size={16}
              color={colors.NEUTRAL800}
              textProps={{ numberOfLines: 3 }}
            >
              ₹ {item?.discountPrice ? item.discountPrice : item.price}
            </Typo>
          </View>

          <Typo
            size={12}
            color={colors.NEUTRAL400}
            textProps={{ numberOfLines: 3 }}
          >
            {item?.longDescription ? item?.longDescription : item?.description}
          </Typo>
        </View>
      </View>
    </>
  );
};

export default memo(ProductCard);

const styles = StyleSheet.create({
  container: {
    marginBottom: verticalScale(40),
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacingX._15,
  },
  imageContainer: {
    position: "relative",
    width: scale(120),
    height: scale(120),
  },
  imagePressable: {
    width: "100%",
    height: "100%",
    zIndex: 1, // Lowest z-index
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: radius._10,
  },
  favoriteButton: {
    position: "absolute",
    right: 0,
    top: 0,
    padding: scale(7),
    zIndex: 2, // Middle z-index
  },
  addCartButtonContainer: {
    position: "absolute",
    width: "100%",
    bottom: scale(-15),
    zIndex: 3, // Highest z-index to ensure it's on top
  },
  contentContainer: {
    flex: 1,
    paddingTop: verticalScale(10),
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
  },
});
