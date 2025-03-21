// import { useCallback, useMemo, useRef, useState } from "react";
// import {
//   ActivityIndicator,
//   FlatList,
//   Pressable,
//   StyleSheet,
//   Text,
//   View,
// } from "react-native";
// import { FC, memo } from "react";
// import { colors, radius } from "@/constants/theme";
// import Typo from "../Typo";
// import { CategoryProps, ProductProps } from "@/types";
// import { scale, verticalScale } from "@/utils/styling";
// import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
// import { getAllProducts } from "@/service/universal";
// import ProductCard from "./ProductCard";
// import { useAuthStore } from "@/store/store";
// import Animated, {
//   FadeInUp,
//   FadeOut,
//   LinearTransition,
// } from "react-native-reanimated";
// import { useFocusEffect, useIsFocused } from "@react-navigation/native";
// import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";

// const useProducts = (categoryId: string, userId: string) => {
//   return useInfiniteQuery({
//     queryKey: ["products", categoryId],
//     queryFn: ({ pageParam = 1 }) =>
//       getAllProducts(categoryId, userId, pageParam, 10),
//     initialPageParam: 1,
//     getNextPageParam: (lastPage) =>
//       lastPage.hasNextPage ? lastPage.page + 1 : undefined,
//     enabled: !!categoryId,
//     refetchOnMount: true,
//     refetchOnReconnect: true,
//     refetchOnWindowFocus: true,
//   });
// };

// const ProductList: FC<{
//   categoryId: string;
//   openVariant: (product: ProductProps) => void;
//   onProductPress: (product: ProductProps) => void;
//   trigger: string;
// }> = ({ categoryId, openVariant, onProductPress, trigger }) => {
//   const { userId } = useAuthStore.getState();
//   const queryClient = useQueryClient();

//   const {
//     data,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//     isLoading,
//     isError,
//   } = useProducts(categoryId, userId || "");
//   const isFocused = useIsFocused();

//   useFocusEffect(
//     useCallback(() => {
//       queryClient.invalidateQueries({ queryKey: ["products"] });
//     }, [])
//   );

//   if (isLoading)
//     return (
//       <View
//         style={{
//           flex: 1,
//           justifyContent: "center",
//           alignItems: "center",
//           width: SCREEN_WIDTH,
//           height: 30,
//         }}
//       >
//         <ActivityIndicator size="small" />
//       </View>
//     );
//   if (isError) return <Text>Error loading products.</Text>;

//   const products = Array.from(
//     new Map(
//       data?.pages
//         .flatMap((page) => page.data)
//         .map((item) => [item.productId, item])
//     ).values()
//   );

//   return (
//     <>
//       <FlatList
//         data={products}
//         keyExtractor={(item) => item.productId}
//         renderItem={({ item }) => (
//           <ProductCard
//             item={item}
//             openVariant={(product: ProductProps) => openVariant(product)}
//             cartCount={item?.cartCount || null}
//             showAddCart={true}
//             trigger={trigger}
//             isFocused={isFocused}
//             onProductPress={(product) => {
//               onProductPress(product);
//             }}
//           />
//         )}
//         onEndReached={() => {
//           if (hasNextPage && !isFetchingNextPage) {
//             fetchNextPage();
//           }
//         }}
//         onEndReachedThreshold={0.5}
//         ListFooterComponent={
//           <View
//             style={{
//               flex: 1,
//               justifyContent: "center",
//               alignItems: "center",
//               width: SCREEN_WIDTH,
//               height: 30,
//             }}
//           >
//             {isFetchingNextPage ? <ActivityIndicator size="small" /> : null}
//           </View>
//         }
//         initialNumToRender={5} // Render only 5 items initially
//         maxToRenderPerBatch={5} // Render 5 items per batch
//         windowSize={10} // Reduce the window size for better performance
//         updateCellsBatchingPeriod={100} // Batch updates to reduce re-renders
//         removeClippedSubviews={true}
//       />
//     </>
//   );
// };

// const CategoryItem: FC<{
//   category: CategoryProps;
//   openVariant: (product: ProductProps) => void;
//   onProductPress: (product: ProductProps) => void;
//   trigger: string;
// }> = ({ category, openVariant, onProductPress, trigger }) => {
//   const [isExpanded, setIsExpanded] = useState(category.status);

//   return (
//     <Animated.View
//       style={[
//         styles.categoryContainer,
//         { paddingBottom: isExpanded ? verticalScale(10) : verticalScale(0) },
//       ]}
//       layout={LinearTransition.damping(10)}
//     >
//       <Pressable
//         style={styles.categoryBtn}
//         onPress={() => setIsExpanded((prev) => !prev)}
//       >
//         <Typo size={16} color={colors.NEUTRAL900} fontFamily="SemiBold">
//           {category.categoryName}
//         </Typo>

//         <Animated.Image
//           source={require("@/assets/icons/arrow-square-up.webp")}
//           style={{
//             height: verticalScale(24),
//             width: scale(24),
//             resizeMode: "cover",
//             marginRight: scale(10),
//             transform: [{ rotate: isExpanded ? "180deg" : "0deg" }],
//           }}
//         />
//       </Pressable>

//       {isExpanded && (
//         <Animated.View
//           entering={FadeInUp.springify().damping(12).stiffness(100)}
//           exiting={FadeOut.springify().damping(10).stiffness(80)}
//         >
//           <ProductList
//             categoryId={category.categoryId}
//             openVariant={(product: ProductProps) => openVariant(product)}
//             onProductPress={(product) => {
//               onProductPress(product);
//             }}
//             trigger={trigger}
//           />
//         </Animated.View>
//       )}
//     </Animated.View>
//   );
// };

// export default memo(CategoryItem);

// const styles = StyleSheet.create({
//   categoryContainer: {
//     marginVertical: verticalScale(10),
//     backgroundColor: colors.WHITE,
//     paddingHorizontal: scale(7),
//     marginHorizontal: scale(10),
//     borderRadius: radius._10,
//   },
//   categoryBtn: {
//     paddingTop: verticalScale(24),
//     paddingBottom: verticalScale(24),
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
// });
// import { useCallback, useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   FlatList,
//   Pressable,
//   StyleSheet,
//   Text,
//   View,
// } from "react-native";
// import { FC, memo } from "react";
// import { colors, radius } from "@/constants/theme";
// import Typo from "../Typo";
// import { CategoryProps, ProductProps } from "@/types";
// import { scale, verticalScale } from "@/utils/styling";
// import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
// import { getAllProducts } from "@/service/universal";
// import ProductCard from "./ProductCard";
// import { useAuthStore } from "@/store/store";
// import Animated, {
//   FadeInUp,
//   FadeOut,
//   LinearTransition,
// } from "react-native-reanimated";
// import { useFocusEffect, useIsFocused } from "@react-navigation/native";

// const CategoryItem: FC<{
//   category: CategoryProps;
//   openVariant: (product: ProductProps) => void;
//   onProductPress: (product: ProductProps) => void;
//   trigger: string;
// }> = ({ category, openVariant, onProductPress, trigger }) => {
//   const [isExpanded, setIsExpanded] = useState<boolean>(category.status);
//   const { userId } = useAuthStore.getState();
//   const queryClient = useQueryClient();
//   const isFocused = useIsFocused();

//   // Individual products query for each category
//   const {
//     data,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//     isLoading,
//     isError,
//   } = useInfiniteQuery({
//     queryKey: ["products", category.categoryId],
//     queryFn: ({ pageParam = 1 }) =>
//       getAllProducts(category.categoryId, userId || "", pageParam, 10),
//     initialPageParam: 1,
//     getNextPageParam: (lastPage) =>
//       lastPage.hasNextPage ? lastPage.page + 1 : undefined,
//     enabled: !!category.categoryId && isExpanded,
//     refetchOnMount: true,
//     refetchOnReconnect: true,
//     refetchOnWindowFocus: true,
//   });

//   useEffect(() => {
//     setIsExpanded(category.status);
//   }, [category]);

//   useFocusEffect(
//     useCallback(() => {
//       if (isExpanded) {
//         queryClient.invalidateQueries({
//           queryKey: ["products", category.categoryId],
//         });
//       }
//     }, [isExpanded, category.categoryId, queryClient])
//   );

//   // Transform products data to avoid duplicates
//   const products = Array.from(
//     new Map(
//       data?.pages
//         ?.flatMap((page) => page.data)
//         .map((item) => [item.productId, item]) || []
//     ).values()
//   );

//   return (
//     <Animated.View
//       style={[
//         styles.categoryContainer,
//         { paddingBottom: isExpanded ? verticalScale(10) : verticalScale(0) },
//       ]}
//       layout={LinearTransition.damping(10)}
//     >
//       <Pressable
//         style={styles.categoryBtn}
//         onPress={() => setIsExpanded((prev) => !prev)}
//       >
//         <Typo size={16} color={colors.NEUTRAL900} fontFamily="SemiBold">
//           {category.categoryName}
//         </Typo>

//         <Animated.Image
//           source={require("@/assets/icons/arrow-square-up.webp")}
//           style={{
//             height: verticalScale(24),
//             width: scale(24),
//             resizeMode: "cover",
//             marginRight: scale(10),
//             transform: [{ rotate: isExpanded ? "180deg" : "0deg" }],
//           }}
//         />
//       </Pressable>

//       {isExpanded && (
//         <Animated.View
//           entering={FadeInUp.springify().damping(12).stiffness(100)}
//           exiting={FadeOut.springify().damping(10).stiffness(80)}
//         >
//           {isLoading ? (
//             <View style={styles.loadingContainer}>
//               <ActivityIndicator size="small" />
//             </View>
//           ) : isError ? (
//             <Text style={styles.errorText}>Error loading products.</Text>
//           ) : (
//             <FlatList
//               data={products}
//               keyExtractor={(item) =>
//                 `product-${category.categoryId}-${item.productId}`
//               }
//               renderItem={({ item }) => (
//                 <ProductCard
//                   item={item}
//                   openVariant={(product: ProductProps) => openVariant(product)}
//                   cartCount={item?.cartCount || null}
//                   showAddCart={true}
//                   trigger={trigger}
//                   isFocused={isFocused}
//                   onProductPress={(product) => {
//                     onProductPress(product);
//                   }}
//                 />
//               )}
//               onEndReached={() => {
//                 if (hasNextPage && !isFetchingNextPage) {
//                   fetchNextPage();
//                 }
//               }}
//               onEndReachedThreshold={0.5}
//               ListFooterComponent={
//                 isFetchingNextPage ? (
//                   <View style={styles.loadingContainer}>
//                     <ActivityIndicator size="small" />
//                   </View>
//                 ) : null
//               }
//               initialNumToRender={5}
//               maxToRenderPerBatch={5}
//               windowSize={5} // Reduced window size to improve performance
//               updateCellsBatchingPeriod={100}
//               removeClippedSubviews={true}
//               scrollEnabled={false} // Disable scrolling on inner FlatLists
//               nestedScrollEnabled={true}
//             />
//           )}
//         </Animated.View>
//       )}
//     </Animated.View>
//   );
// };

// export default memo(CategoryItem);

// const styles = StyleSheet.create({
//   categoryContainer: {
//     marginVertical: verticalScale(10),
//     backgroundColor: colors.WHITE,
//     paddingHorizontal: scale(7),
//     marginHorizontal: scale(10),
//     borderRadius: radius._10,
//   },
//   categoryBtn: {
//     paddingTop: verticalScale(24),
//     paddingBottom: verticalScale(24),
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     width: "100%",
//     height: 30,
//     marginVertical: verticalScale(10),
//   },
//   errorText: {
//     textAlign: "center",
//     padding: 10,
//     color: colors.RED,
//   },
// });
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { FC, memo } from "react";
import { colors, radius } from "@/constants/theme";
import Typo from "../Typo";
import { CategoryProps, ProductProps } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { getAllProducts } from "@/service/universal";
import ProductCard from "./ProductCard";
import { useAuthStore } from "@/store/store";
import Animated, {
  FadeInUp,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const CategoryItem: FC<{
  category: CategoryProps;
  openVariant: (product: ProductProps) => void;
  onProductPress: (product: ProductProps) => void;
  trigger: string;
}> = ({ category, openVariant, onProductPress, trigger }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(category.status);
  const { userId } = useAuthStore.getState();
  const queryClient = useQueryClient();
  const isFocused = useIsFocused();

  // Individual products query for each category
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["products", category.categoryId],
    queryFn: ({ pageParam = 1 }) =>
      getAllProducts(category.categoryId, userId || "", pageParam, 10),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    enabled: !!category.categoryId, // Fixed: explicitly convert to boolean
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    setIsExpanded(category.status);
  }, [category]);

  useFocusEffect(
    useCallback(() => {
      if (isExpanded) {
        queryClient.invalidateQueries({
          queryKey: ["products", category.categoryId],
        });
      }
    }, [isExpanded, category.categoryId, queryClient])
  );

  // Transform products data to avoid duplicates
  const products = Array.from(
    new Map(
      data?.pages
        ?.flatMap((page) => page.data)
        .map((item) => [item.productId, item]) || []
    ).values()
  );

  return (
    <Animated.View
      style={[
        styles.categoryContainer,
        { paddingBottom: isExpanded ? verticalScale(10) : verticalScale(0) },
      ]}
      layout={LinearTransition.damping(10)}
    >
      <Pressable
        style={styles.categoryBtn}
        onPress={() => setIsExpanded((prev) => !prev)}
      >
        <Typo size={16} color={colors.NEUTRAL900} fontFamily="SemiBold">
          {category.categoryName}
        </Typo>

        <Animated.Image
          source={require("@/assets/icons/arrow-square-up.webp")}
          style={{
            height: verticalScale(24),
            width: scale(24),
            resizeMode: "cover",
            marginRight: scale(10),
            transform: [{ rotate: isExpanded ? "180deg" : "0deg" }],
          }}
        />
      </Pressable>

      {isExpanded && (
        <Animated.View
          entering={FadeInUp.springify().damping(12).stiffness(100)}
          exiting={FadeOut.springify().damping(10).stiffness(80)}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <SkeletonPlaceholder borderRadius={4}>
                <SkeletonPlaceholder.Item
                  flexDirection="row"
                  alignItems="center"
                >
                  <SkeletonPlaceholder.Item
                    width={60}
                    height={60}
                    borderRadius={10}
                  />
                  <SkeletonPlaceholder.Item marginLeft={20}>
                    <SkeletonPlaceholder.Item width={120} height={20} />
                    <SkeletonPlaceholder.Item
                      marginTop={6}
                      width={80}
                      height={20}
                    />
                  </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder.Item>
              </SkeletonPlaceholder>
              {/* <ActivityIndicator size="small" color={colors.PRIMARY} /> */}
            </View>
          ) : isError ? (
            <Text style={styles.errorText}>Error loading products.</Text>
          ) : (
            <FlatList
              data={products}
              keyExtractor={(item) =>
                `product-${category.categoryId}-${item.productId}`
              }
              renderItem={({ item }) => (
                <ProductCard
                  item={item}
                  openVariant={(product: ProductProps) => openVariant(product)}
                  cartCount={item?.cartCount || null}
                  showAddCart={true}
                  trigger={trigger}
                  isFocused={isFocused}
                  onProductPress={(product) => {
                    onProductPress(product);
                  }}
                />
              )}
              onEndReached={() => {
                if (hasNextPage && !isFetchingNextPage) {
                  fetchNextPage();
                }
              }}
              onEndReachedThreshold={0.5}
              ListFooterComponent={
                isFetchingNextPage ? (
                  <View style={styles.loadingContainer}>
                    <SkeletonPlaceholder borderRadius={4}>
                      <SkeletonPlaceholder.Item
                        flexDirection="row"
                        alignItems="center"
                      >
                        <SkeletonPlaceholder.Item
                          width={60}
                          height={60}
                          borderRadius={10}
                        />
                        <SkeletonPlaceholder.Item marginLeft={20}>
                          <SkeletonPlaceholder.Item width={120} height={20} />
                          <SkeletonPlaceholder.Item
                            marginTop={6}
                            width={80}
                            height={20}
                          />
                        </SkeletonPlaceholder.Item>
                      </SkeletonPlaceholder.Item>
                    </SkeletonPlaceholder>
                  </View>
                ) : null
              }
              initialNumToRender={5}
              maxToRenderPerBatch={5}
              windowSize={5} // Reduced window size to improve performance
              updateCellsBatchingPeriod={100}
              removeClippedSubviews={true}
              scrollEnabled={false} // Disable scrolling on inner FlatLists
              nestedScrollEnabled={true}
            />
          )}
        </Animated.View>
      )}
    </Animated.View>
  );
};

export default memo(CategoryItem);

const styles = StyleSheet.create({
  categoryContainer: {
    marginVertical: verticalScale(10),
    backgroundColor: colors.WHITE,
    paddingHorizontal: scale(7),
    marginHorizontal: scale(10),
    borderRadius: radius._10,
  },
  categoryBtn: {
    paddingTop: verticalScale(24),
    paddingBottom: verticalScale(24),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
    height: 100,
    marginVertical: verticalScale(10),
    paddingHorizontal: scale(20),
    backgroundColor: colors.WHITE,
  },
  errorText: {
    textAlign: "center",
    padding: 10,
    color: colors.RED,
  },
  container: {
    marginBottom: 40,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  imageContainer: {
    position: "relative",
    width: 120,
    height: 120,
  },
  imagePressable: {
    width: "100%",
    height: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  favoriteButton: {
    position: "absolute",
    right: 0,
    top: 0,
    padding: 7,
    zIndex: 2,
  },
  addCartButtonContainer: {
    position: "absolute",
    width: "100%",
    bottom: -15,
    zIndex: 3,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 10,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  // Skeleton Styles
  skeletonImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  skeletonText: {
    width: "80%",
    height: 16,
    borderRadius: 4,
    marginBottom: 6,
  },
  skeletonPriceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  },
  skeletonPrice: {
    width: 50,
    height: 14,
    borderRadius: 4,
  },
  skeletonDiscountPrice: {
    width: 40,
    height: 14,
    borderRadius: 4,
  },
  skeletonDescription: {
    width: "90%",
    height: 12,
    borderRadius: 4,
  },
});
