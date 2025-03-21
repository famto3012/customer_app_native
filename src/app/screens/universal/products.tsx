// // import {
// //   ActivityIndicator,
// //   Dimensions,
// //   FlatList,
// //   Platform,
// //   Pressable,
// //   StyleSheet,
// //   View,
// // } from "react-native";
// // import { scale, verticalScale } from "@/utils/styling";
// // import { colors, radius, spacingX } from "@/constants/theme";
// // import Header from "@/components/Header";
// // import { StatusBar } from "expo-status-bar";
// // import Typo from "@/components/Typo";
// // import { XCircle } from "phosphor-react-native";
// // import SearchView from "@/components/SearchView";
// // import { productFilters } from "@/utils/defaultData";
// // import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// // import { router, useLocalSearchParams } from "expo-router";
// // import { useAuthStore } from "@/store/store";
// // import { MerchantDataProps, ProductProps } from "@/types";
// // import { getAllCategory, getMerchantData } from "@/service/universal";
// // import { useSafeLocation } from "@/utils/helpers";
// // import FloatingCart from "@/components/universal/FloatingCart";
// // import BottomSheet, {
// //   BottomSheetBackdrop,
// //   BottomSheetBackdropProps,
// //   SCREEN_WIDTH,
// // } from "@gorhom/bottom-sheet";
// // import { GestureHandlerRootView } from "react-native-gesture-handler";
// // import VariantSheet from "@/components/BottomSheets/VariantSheet";
// // import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
// // import MerchantData from "@/components/universal/MerchantData";
// // import MerchantBanner from "@/components/universal/MerchantBanner";
// // import { commonStyles } from "@/constants/commonStyles";
// // import ProductFooter from "@/components/universal/ProductFooter";
// // import CategoryItem from "@/components/universal/CategoryItem";
// // import ClearCartSheet from "@/components/BottomSheets/universal/ClearCartSheet";
// // import DuplicateVariantSheet from "@/components/BottomSheets/universal/DuplicateVariantSheet";
// // import MerchantRatingSheet from "@/components/BottomSheets/universal/MerchantRatingSheet";
// // import ProductDetailSheet from "@/components/BottomSheets/universal/ProductDetailSheet";
// // import DistanceWarning from "@/components/BottomSheets/universal/DistanceWarning";

// // const { height } = Dimensions.get("window");

// // const Product = () => {
// //   const [selectedFilter, setSelectedFilter] = useState<string>("");
// //   const [product, setProduct] = useState<ProductProps | null>(null);
// //   const [duplicateProduct, setDuplicateProductId] =
// //     useState<ProductProps | null>(null);
// //   const [trigger, setTrigger] = useState<string>(`${new Date()}`);
// //   const [selectedDetailProduct, setSelectedDetailProduct] =
// //     useState<ProductProps | null>(null);

// //   const variantSheetRef = useRef<BottomSheet>(null);
// //   const clearCartSheetRef = useRef<BottomSheet>(null);
// //   const duplicateVariantSheetRef = useRef<BottomSheet>(null);
// //   const ratingSheetRef = useRef<BottomSheet>(null);
// //   const productDetailRef = useRef<BottomSheet>(null);
// //   const distanceWarningSheetRef = useRef<BottomSheet>(null);

// //   const variantSheetSnapPoints = useMemo(() => ["60%"], []);
// //   const clearCartSheetSnapPoints = useMemo(() => ["28%"], []);
// //   const duplicateSheetSnapPoints = useMemo(() => ["40%"], []);
// //   const ratingSheetSnapPoints = useMemo(() => ["45%"], []);
// //   const productDetailSnapPoints = useMemo(() => ["55%"], []);
// //   const distanceWarningSheetSnapPoints = useMemo(() => ["50%"], []);

// //   const { merchantId } = useLocalSearchParams();
// //   const { selectedBusiness } = useAuthStore.getState();
// //   const { latitude, longitude } = useSafeLocation();

// //   const CATEGORY_LIMIT: number = 2;

// //   const {
// //     data: categoryData,
// //     fetchNextPage: fetchNextCategoryPage,
// //     hasNextPage: hasNextCategoryPage,
// //     isFetchingNextPage: isFetchingNextCategoryPage,
// //   } = useInfiniteQuery({
// //     queryKey: ["category", merchantId, selectedBusiness],
// //     queryFn: ({ pageParam = 1 }) =>
// //       getAllCategory(
// //         merchantId.toString(),
// //         selectedBusiness || "",
// //         pageParam,
// //         CATEGORY_LIMIT
// //       ),
// //     initialPageParam: 1,
// //     getNextPageParam: (lastPage) =>
// //       lastPage.hasNextPage ? lastPage.page + 1 : undefined,
// //     refetchOnMount: true,
// //     refetchOnReconnect: true,
// //     refetchOnWindowFocus: true,
// //   });

// //   const { data: merchantData } = useQuery<MerchantDataProps>({
// //     queryKey: ["merchant-data", merchantId],
// //     queryFn: () => getMerchantData(merchantId.toString(), latitude, longitude),
// //   });

// //   useEffect(() => {
// //     if (merchantData?.distanceWarning) {
// //       distanceWarningSheetRef.current?.snapToIndex(0);
// //     }
// //   }, [merchantData]);

// //   const handleSelectFilter = (value: string) => {
// //     if (value === selectedFilter) {
// //       setSelectedFilter("");
// //     } else {
// //       setSelectedFilter(value);
// //     }
// //   };

// //   const handleOpenProductDetails = (product: ProductProps) => {
// //     setSelectedDetailProduct(product);

// //     if (productDetailRef.current) {
// //       productDetailRef.current.snapToIndex(0);
// //     } else {
// //       console.warn("ProductDetail BottomSheet ref is NULL");
// //     }
// //   };

// //   const openVariantSheet = (product: ProductProps) => {
// //     if (!product) return;

// //     if (product.cartCount) {
// //       setDuplicateProductId(product);
// //       duplicateVariantSheetRef.current?.snapToIndex(0);
// //     } else {
// //       setProduct((prevProduct) => prevProduct || product);
// //       variantSheetRef.current?.snapToIndex(0);
// //     }
// //   };

// //   const handleNewCustomization = (product: ProductProps | null) => {
// //     if (product?.productId) {
// //       setProduct(product);
// //       duplicateVariantSheetRef.current?.close();
// //       variantSheetRef.current?.snapToIndex(0);
// //     }
// //   };

// //   const handleBottomSheetClose = useCallback(() => {
// //     setTrigger((prev) => `${prev}-${Date.now()}`);
// //   }, []);

// //   const renderBackdrop = useCallback(
// //     (props: BottomSheetBackdropProps) => (
// //       <BottomSheetBackdrop
// //         {...props}
// //         disappearsOnIndex={-1}
// //         appearsOnIndex={0}
// //         opacity={0.5}
// //         style={[props.style, commonStyles.backdrop]}
// //       />
// //     ),
// //     []
// //   );

// //   const renderItem = ({ item }: any) => {
// //     return (
// //       <Pressable
// //         style={[
// //           styles.filterItem,
// //           selectedFilter === item.value && styles.selectedFilter,
// //         ]}
// //         onPress={() => handleSelectFilter(item.value)}
// //       >
// //         <Typo
// //           size={13}
// //           color={
// //             selectedFilter === item.value ? colors.WHITE : colors.NEUTRAL900
// //           }
// //         >
// //           {item.label}
// //         </Typo>

// //         {selectedFilter === item.value && <XCircle size={20} color="white" />}
// //       </Pressable>
// //     );
// //   };

// //   return (
// //     <GestureHandlerRootView>
// //       <View>
// //         <StatusBar
// //           backgroundColor={colors.NEUTRAL200}
// //           style="dark"
// //           translucent={false}
// //         />

// //         <FlatList
// //           data={categoryData?.pages.flatMap((page) => page.data) || []}
// //           renderItem={({ item }) => (
// //             <CategoryItem
// //               category={item}
// //               openVariant={openVariantSheet}
// //               onProductPress={handleOpenProductDetails}
// //               trigger={trigger}
// //             />
// //           )}
// //           keyExtractor={(item, index) => `category-${item.categoryId}-${index}`}
// //           onEndReached={() => {
// //             if (hasNextCategoryPage && !isFetchingNextCategoryPage) {
// //               fetchNextCategoryPage();
// //             }
// //           }}
// //           onEndReachedThreshold={0.5}
// //           showsVerticalScrollIndicator={false}
// //           ListHeaderComponent={
// //             <>
// //               <View style={styles.merchantOuter}>
// //                 <Header title="Products" />

// //                 <MerchantData
// //                   merchantData={merchantData ? merchantData : null}
// //                   openRating={() => ratingSheetRef.current?.snapToIndex(0)}
// //                 />
// //               </View>

// //               <MerchantBanner merchantId={merchantId.toString()} />

// //               <View style={{ paddingHorizontal: scale(20) }}>
// //                 <SearchView
// //                   placeholder="Search Dishes / Products"
// //                   onPress={() =>
// //                     router.push("/screens/universal/product-search")
// //                   }
// //                 />

// //                 <FlatList
// //                   data={productFilters}
// //                   renderItem={renderItem}
// //                   keyExtractor={(item) => item.value}
// //                   horizontal
// //                   nestedScrollEnabled
// //                   showsHorizontalScrollIndicator={false}
// //                   contentContainerStyle={{ marginVertical: verticalScale(15) }}
// //                 />
// //               </View>
// //             </>
// //           }
// //           ListFooterComponent={
// //             isFetchingNextCategoryPage ? (
// //               <View
// //                 style={{
// //                   flex: 1,
// //                   justifyContent: "center",
// //                   alignItems: "center",
// //                   width: SCREEN_WIDTH,
// //                   height: 30,
// //                 }}
// //               >
// //                 <ActivityIndicator size="small" />
// //               </View>
// //             ) : (
// //               <ProductFooter
// //                 merchantData={merchantData ? merchantData : null}
// //               />
// //             )
// //           }
// //           initialNumToRender={5} // Render only 5 items initially
// //           maxToRenderPerBatch={5} // Render 5 items per batch
// //           windowSize={10} // Reduce the window size for better performance
// //           updateCellsBatchingPeriod={100} // Batch updates to reduce re-renders
// //           removeClippedSubviews={true}
// //         />

// //         <FloatingCart onClearCart={() => clearCartSheetRef.current?.expand()} />

// //         <BottomSheet
// //           ref={variantSheetRef}
// //           index={-1}
// //           snapPoints={variantSheetSnapPoints}
// //           enableDynamicSizing={false}
// //           enablePanDownToClose
// //           onClose={() => setProduct(null)}
// //           backdropComponent={renderBackdrop}
// //         >
// //           <VariantSheet
// //             product={product ? product : null}
// //             onAddItem={() => {
// //               setTrigger((prev) => `${prev}-${new Date().getTime()}`); // Ensure unique value
// //               variantSheetRef.current?.close();
// //             }}
// //           />
// //         </BottomSheet>

// //         <BottomSheet
// //           ref={clearCartSheetRef}
// //           index={-1}
// //           snapPoints={clearCartSheetSnapPoints}
// //           enableDynamicSizing={false}
// //           enablePanDownToClose
// //           backdropComponent={renderBackdrop}
// //         >
// //           <ClearCartSheet
// //             closeClearCartSheet={() => {
// //               handleBottomSheetClose();
// //               clearCartSheetRef.current?.close();
// //             }}
// //           />
// //         </BottomSheet>

// //         <BottomSheet
// //           ref={duplicateVariantSheetRef}
// //           index={-1}
// //           snapPoints={duplicateSheetSnapPoints}
// //           enableDynamicSizing={false}
// //           enablePanDownToClose
// //           backdropComponent={renderBackdrop}
// //           onClose={handleBottomSheetClose}
// //         >
// //           <DuplicateVariantSheet
// //             product={duplicateProduct}
// //             onNewCustomization={handleNewCustomization}
// //             closeSheet={() => {
// //               setTrigger((prev) => `${prev}-${new Date().getTime()}`);
// //               duplicateVariantSheetRef.current?.close();
// //             }}
// //           />
// //         </BottomSheet>

// //         <BottomSheet
// //           ref={ratingSheetRef}
// //           index={-1}
// //           snapPoints={ratingSheetSnapPoints}
// //           enableDynamicSizing={false}
// //           enablePanDownToClose
// //           backdropComponent={renderBackdrop}
// //         >
// //           <MerchantRatingSheet
// //             merchantId={merchantId.toString()}
// //             rating={merchantData?.rating || 0}
// //             onPress={() => ratingSheetRef.current?.close()}
// //           />
// //         </BottomSheet>
// //         <BottomSheet
// //           ref={productDetailRef}
// //           index={-1}
// //           snapPoints={productDetailSnapPoints}
// //           enableDynamicSizing={false}
// //           enablePanDownToClose
// //           backdropComponent={renderBackdrop}
// //           onClose={() => {
// //             handleBottomSheetClose();
// //           }}
// //         >
// //           {selectedDetailProduct && (
// //             <ProductDetailSheet
// //               product={selectedDetailProduct}
// //               onClose={() => {
// //                 productDetailRef.current?.close();
// //               }}
// //             />
// //           )}
// //         </BottomSheet>

// //         <BottomSheet
// //           ref={distanceWarningSheetRef}
// //           index={-1}
// //           snapPoints={distanceWarningSheetSnapPoints}
// //           enableDynamicSizing={false}
// //           enablePanDownToClose
// //           backdropComponent={renderBackdrop}
// //         >
// //           <DistanceWarning
// //             closeDistanceWarningSheet={() => {
// //               setTrigger((prev) => `${prev}-${Date.now()}`);
// //               distanceWarningSheetRef.current?.close();
// //             }}
// //           />
// //         </BottomSheet>
// //       </View>
// //     </GestureHandlerRootView>
// //   );
// // };

// // export default Product;

// // const styles = StyleSheet.create({
// //   merchantOuter: {
// //     backgroundColor: colors.NEUTRAL200,
// //     paddingTop: Platform.OS === "ios" ? height * scale(0.06) : scale(20),
// //     borderBottomLeftRadius: radius._30,
// //     borderBottomRightRadius: radius._30,
// //     paddingBottom: verticalScale(20),
// //   },
// //   filterItem: {
// //     padding: 10,
// //     paddingHorizontal: 15,
// //     marginHorizontal: 2,
// //     borderRadius: 5,
// //     backgroundColor: colors.NEUTRAL200,
// //     height: verticalScale(40),
// //     flexDirection: "row",
// //     gap: spacingX._5,
// //     marginRight: scale(15),
// //     alignItems: "center",
// //   },
// //   selectedFilter: {
// //     backgroundColor: colors.PRIMARY,
// //   },
// //   categoryHeader: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     paddingBottom: verticalScale(5),
// //   },
// //   productItem: {
// //     paddingVertical: verticalScale(5),
// //     borderBottomWidth: 0.5,
// //     borderBottomColor: colors.NEUTRAL300,
// //   },
// //   icon: {
// //     width: scale(24),
// //     height: verticalScale(24),
// //     resizeMode: "cover",
// //     marginEnd: scale(10),
// //   },
// // });
// // import {
// //   ActivityIndicator,
// //   Dimensions,
// //   FlatList,
// //   Platform,
// //   Pressable,
// //   ScrollView,
// //   StyleSheet,
// //   View,
// // } from "react-native";
// // import { scale, verticalScale } from "@/utils/styling";
// // import { colors, radius, spacingX } from "@/constants/theme";
// // import Header from "@/components/Header";
// // import { StatusBar } from "expo-status-bar";
// // import Typo from "@/components/Typo";
// // import { XCircle } from "phosphor-react-native";
// // import SearchView from "@/components/SearchView";
// // import { productFilters } from "@/utils/defaultData";
// // import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// // import { router, useLocalSearchParams } from "expo-router";
// // import { useAuthStore } from "@/store/store";
// // import { MerchantDataProps, ProductProps } from "@/types";
// // import { getAllCategory, getMerchantData } from "@/service/universal";
// // import { useSafeLocation } from "@/utils/helpers";
// // import FloatingCart from "@/components/universal/FloatingCart";
// // import BottomSheet, {
// //   BottomSheetBackdrop,
// //   BottomSheetBackdropProps,
// //   SCREEN_WIDTH,
// // } from "@gorhom/bottom-sheet";
// // import { GestureHandlerRootView } from "react-native-gesture-handler";
// // import VariantSheet from "@/components/BottomSheets/VariantSheet";
// // import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
// // import MerchantData from "@/components/universal/MerchantData";
// // import MerchantBanner from "@/components/universal/MerchantBanner";
// // import { commonStyles } from "@/constants/commonStyles";
// // import ProductFooter from "@/components/universal/ProductFooter";
// // import CategoryItem from "@/components/universal/CategoryItem";
// // import ClearCartSheet from "@/components/BottomSheets/universal/ClearCartSheet";
// // import DuplicateVariantSheet from "@/components/BottomSheets/universal/DuplicateVariantSheet";
// // import MerchantRatingSheet from "@/components/BottomSheets/universal/MerchantRatingSheet";
// // import ProductDetailSheet from "@/components/BottomSheets/universal/ProductDetailSheet";
// // import DistanceWarning from "@/components/BottomSheets/universal/DistanceWarning";

// // const { height } = Dimensions.get("window");

// // const Product = () => {
// //   const [selectedFilter, setSelectedFilter] = useState<string>("");
// //   const [product, setProduct] = useState<ProductProps | null>(null);
// //   const [duplicateProduct, setDuplicateProductId] =
// //     useState<ProductProps | null>(null);
// //   const [trigger, setTrigger] = useState<string>(`${new Date()}`);
// //   const [selectedDetailProduct, setSelectedDetailProduct] =
// //     useState<ProductProps | null>(null);

// //   const variantSheetRef = useRef<BottomSheet>(null);
// //   const clearCartSheetRef = useRef<BottomSheet>(null);
// //   const duplicateVariantSheetRef = useRef<BottomSheet>(null);
// //   const ratingSheetRef = useRef<BottomSheet>(null);
// //   const productDetailRef = useRef<BottomSheet>(null);
// //   const distanceWarningSheetRef = useRef<BottomSheet>(null);

// //   const variantSheetSnapPoints = useMemo(() => ["60%"], []);
// //   const clearCartSheetSnapPoints = useMemo(() => ["28%"], []);
// //   const duplicateSheetSnapPoints = useMemo(() => ["40%"], []);
// //   const ratingSheetSnapPoints = useMemo(() => ["45%"], []);
// //   const productDetailSnapPoints = useMemo(() => ["55%"], []);
// //   const distanceWarningSheetSnapPoints = useMemo(() => ["50%"], []);

// //   const { merchantId } = useLocalSearchParams();
// //   const { selectedBusiness } = useAuthStore.getState();
// //   const { latitude, longitude } = useSafeLocation();

// //   const CATEGORY_LIMIT: number = 1; // Increased limit to load more categories at once

// //   const {
// //     data: categoryData,
// //     fetchNextPage: fetchNextCategoryPage,
// //     hasNextPage: hasNextCategoryPage,
// //     isFetchingNextPage: isFetchingNextCategoryPage,
// //   } = useInfiniteQuery({
// //     queryKey: ["category", merchantId, selectedBusiness],
// //     queryFn: ({ pageParam = 1 }) =>
// //       getAllCategory(
// //         merchantId.toString(),
// //         selectedBusiness || "",
// //         pageParam,
// //         CATEGORY_LIMIT
// //       ),
// //     initialPageParam: 1,
// //     getNextPageParam: (lastPage) =>
// //       lastPage.hasNextPage ? lastPage.page + 1 : undefined,
// //     refetchOnMount: true,
// //     refetchOnReconnect: true,
// //     refetchOnWindowFocus: true,
// //   });

// //   const { data: merchantData } = useQuery<MerchantDataProps>({
// //     queryKey: ["merchant-data", merchantId],
// //     queryFn: () => getMerchantData(merchantId.toString(), latitude, longitude),
// //   });

// //   useEffect(() => {
// //     if (merchantData?.distanceWarning) {
// //       distanceWarningSheetRef.current?.snapToIndex(0);
// //     }
// //   }, [merchantData]);

// //   const handleSelectFilter = (value: string) => {
// //     if (value === selectedFilter) {
// //       setSelectedFilter("");
// //     } else {
// //       setSelectedFilter(value);
// //     }
// //   };

// //   const handleOpenProductDetails = (product: ProductProps) => {
// //     setSelectedDetailProduct(product);

// //     if (productDetailRef.current) {
// //       productDetailRef.current.snapToIndex(0);
// //     } else {
// //       console.warn("ProductDetail BottomSheet ref is NULL");
// //     }
// //   };

// //   const openVariantSheet = (product: ProductProps) => {
// //     if (!product) return;

// //     if (product.cartCount) {
// //       setDuplicateProductId(product);
// //       duplicateVariantSheetRef.current?.snapToIndex(0);
// //     } else {
// //       setProduct((prevProduct) => prevProduct || product);
// //       variantSheetRef.current?.snapToIndex(0);
// //     }
// //   };

// //   const handleNewCustomization = (product: ProductProps | null) => {
// //     if (product?.productId) {
// //       setProduct(product);
// //       duplicateVariantSheetRef.current?.close();
// //       variantSheetRef.current?.snapToIndex(0);
// //     }
// //   };

// //   const handleBottomSheetClose = useCallback(() => {
// //     setTrigger((prev) => `${prev}-${Date.now()}`);
// //   }, []);

// //   const renderBackdrop = useCallback(
// //     (props: BottomSheetBackdropProps) => (
// //       <BottomSheetBackdrop
// //         {...props}
// //         disappearsOnIndex={-1}
// //         appearsOnIndex={0}
// //         opacity={0.5}
// //         style={[props.style, commonStyles.backdrop]}
// //       />
// //     ),
// //     []
// //   );

// //   const renderItem = ({ item }: any) => {
// //     return (
// //       <Pressable
// //         style={[
// //           styles.filterItem,
// //           selectedFilter === item.value && styles.selectedFilter,
// //         ]}
// //         onPress={() => handleSelectFilter(item.value)}
// //       >
// //         <Typo
// //           size={13}
// //           color={
// //             selectedFilter === item.value ? colors.WHITE : colors.NEUTRAL900
// //           }
// //         >
// //           {item.label}
// //         </Typo>

// //         {selectedFilter === item.value && <XCircle size={20} color="white" />}
// //       </Pressable>
// //     );
// //   };

// //   const categories = useMemo(() => {
// //     return categoryData?.pages.flatMap((page) => page.data) || [];
// //   }, [categoryData]);

// //   const renderHeader = () => (
// //     <>
// //       <View style={styles.merchantOuter}>
// //         <Header title="Products" />

// //         <MerchantData
// //           merchantData={merchantData ? merchantData : null}
// //           openRating={() => ratingSheetRef.current?.snapToIndex(0)}
// //         />
// //       </View>

// //       <MerchantBanner merchantId={merchantId.toString()} />

// //       <View style={{ paddingHorizontal: scale(20) }}>
// //         <SearchView
// //           placeholder="Search Dishes / Products"
// //           onPress={() => router.push("/screens/universal/product-search")}
// //         />

// //         <FlatList
// //           data={productFilters}
// //           renderItem={renderItem}
// //           keyExtractor={(item) => item.value}
// //           horizontal
// //           nestedScrollEnabled
// //           showsHorizontalScrollIndicator={false}
// //           contentContainerStyle={{ marginVertical: verticalScale(15) }}
// //         />
// //       </View>
// //     </>
// //   );

// //   const renderFooter = () => (
// //     <>
// //       {isFetchingNextCategoryPage ? (
// //         <View style={styles.loadingContainer}>
// //           <ActivityIndicator size="small" />
// //         </View>
// //       ) : (
// //         <ProductFooter merchantData={merchantData ? merchantData : null} />
// //       )}

// //       {/* Load more categories button (optional) */}
// //       {hasNextCategoryPage && (
// //         <Pressable
// //           style={styles.loadMoreButton}
// //           onPress={() => fetchNextCategoryPage()}
// //         >
// //           <Typo size={14} color={colors.PRIMARY} fontFamily="Medium">
// //             Load More Categories
// //           </Typo>
// //         </Pressable>
// //       )}
// //     </>
// //   );

// //   return (
// //     <GestureHandlerRootView>
// //       <View>
// //         <StatusBar
// //           backgroundColor={colors.NEUTRAL200}
// //           style="dark"
// //           translucent={false}
// //         />

// //         {/* Main container with ScrollView instead of FlatList */}
// //         <ScrollView
// //           showsVerticalScrollIndicator={false}
// //           contentContainerStyle={{ paddingBottom: verticalScale(80) }}
// //         >
// //           {renderHeader()}

// //           {/* Render each category with its own FlatList */}
// //           {categories.map((category) => (
// //             <CategoryItem
// //               key={`category-${category.categoryId}`}
// //               category={category}
// //               openVariant={openVariantSheet}
// //               onProductPress={handleOpenProductDetails}
// //               trigger={trigger}
// //             />
// //           ))}

// //           {renderFooter()}
// //         </ScrollView>

// //         <FloatingCart onClearCart={() => clearCartSheetRef.current?.expand()} />

// //         <BottomSheet
// //           ref={variantSheetRef}
// //           index={-1}
// //           snapPoints={variantSheetSnapPoints}
// //           enableDynamicSizing={false}
// //           enablePanDownToClose
// //           onClose={() => setProduct(null)}
// //           backdropComponent={renderBackdrop}
// //         >
// //           <VariantSheet
// //             product={product ? product : null}
// //             onAddItem={() => {
// //               setTrigger((prev) => `${prev}-${new Date().getTime()}`);
// //               variantSheetRef.current?.close();
// //             }}
// //           />
// //         </BottomSheet>

// //         <BottomSheet
// //           ref={clearCartSheetRef}
// //           index={-1}
// //           snapPoints={clearCartSheetSnapPoints}
// //           enableDynamicSizing={false}
// //           enablePanDownToClose
// //           backdropComponent={renderBackdrop}
// //         >
// //           <ClearCartSheet
// //             closeClearCartSheet={() => {
// //               handleBottomSheetClose();
// //               clearCartSheetRef.current?.close();
// //             }}
// //           />
// //         </BottomSheet>

// //         <BottomSheet
// //           ref={duplicateVariantSheetRef}
// //           index={-1}
// //           snapPoints={duplicateSheetSnapPoints}
// //           enableDynamicSizing={false}
// //           enablePanDownToClose
// //           backdropComponent={renderBackdrop}
// //           onClose={handleBottomSheetClose}
// //         >
// //           <DuplicateVariantSheet
// //             product={duplicateProduct}
// //             onNewCustomization={handleNewCustomization}
// //             closeSheet={() => {
// //               setTrigger((prev) => `${prev}-${new Date().getTime()}`);
// //               duplicateVariantSheetRef.current?.close();
// //             }}
// //           />
// //         </BottomSheet>

// //         <BottomSheet
// //           ref={ratingSheetRef}
// //           index={-1}
// //           snapPoints={ratingSheetSnapPoints}
// //           enableDynamicSizing={false}
// //           enablePanDownToClose
// //           backdropComponent={renderBackdrop}
// //         >
// //           <MerchantRatingSheet
// //             merchantId={merchantId.toString()}
// //             rating={merchantData?.rating || 0}
// //             onPress={() => ratingSheetRef.current?.close()}
// //           />
// //         </BottomSheet>
// //         <BottomSheet
// //           ref={productDetailRef}
// //           index={-1}
// //           snapPoints={productDetailSnapPoints}
// //           enableDynamicSizing={false}
// //           enablePanDownToClose
// //           backdropComponent={renderBackdrop}
// //           onClose={() => {
// //             handleBottomSheetClose();
// //           }}
// //         >
// //           {selectedDetailProduct && (
// //             <ProductDetailSheet
// //               product={selectedDetailProduct}
// //               onClose={() => {
// //                 productDetailRef.current?.close();
// //               }}
// //             />
// //           )}
// //         </BottomSheet>

// //         <BottomSheet
// //           ref={distanceWarningSheetRef}
// //           index={-1}
// //           snapPoints={distanceWarningSheetSnapPoints}
// //           enableDynamicSizing={false}
// //           enablePanDownToClose
// //           backdropComponent={renderBackdrop}
// //         >
// //           <DistanceWarning
// //             closeDistanceWarningSheet={() => {
// //               setTrigger((prev) => `${prev}-${Date.now()}`);
// //               distanceWarningSheetRef.current?.close();
// //             }}
// //           />
// //         </BottomSheet>
// //       </View>
// //     </GestureHandlerRootView>
// //   );
// // };

// // export default Product;

// // const styles = StyleSheet.create({
// //   merchantOuter: {
// //     backgroundColor: colors.NEUTRAL200,
// //     paddingTop: Platform.OS === "ios" ? height * scale(0.06) : scale(20),
// //     borderBottomLeftRadius: radius._30,
// //     borderBottomRightRadius: radius._30,
// //     paddingBottom: verticalScale(20),
// //   },
// //   filterItem: {
// //     padding: 10,
// //     paddingHorizontal: 15,
// //     marginHorizontal: 2,
// //     borderRadius: 5,
// //     backgroundColor: colors.NEUTRAL200,
// //     height: verticalScale(40),
// //     flexDirection: "row",
// //     gap: spacingX._5,
// //     marginRight: scale(15),
// //     alignItems: "center",
// //   },
// //   selectedFilter: {
// //     backgroundColor: colors.PRIMARY,
// //   },
// //   loadingContainer: {
// //     flex: 1,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     width: SCREEN_WIDTH,
// //     height: 30,
// //     marginVertical: verticalScale(10),
// //   },
// //   loadMoreButton: {
// //     alignItems: "center",
// //     padding: 15,
// //     marginHorizontal: scale(20),
// //     marginBottom: verticalScale(20),
// //   },
// // });
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { scale, verticalScale } from "@/utils/styling";
import { colors, radius, spacingX } from "@/constants/theme";
import Header from "@/components/Header";
import { StatusBar } from "expo-status-bar";
import Typo from "@/components/Typo";
import { XCircle } from "phosphor-react-native";
import SearchView from "@/components/SearchView";
import { productFilters } from "@/utils/defaultData";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useAuthStore } from "@/store/store";
import { MerchantDataProps, ProductProps } from "@/types";
import { getAllCategory, getMerchantData } from "@/service/universal";
import { useSafeLocation } from "@/utils/helpers";
import FloatingCart from "@/components/universal/FloatingCart";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  SCREEN_WIDTH,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import VariantSheet from "@/components/BottomSheets/VariantSheet";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import MerchantData from "@/components/universal/MerchantData";
import MerchantBanner from "@/components/universal/MerchantBanner";
import { commonStyles } from "@/constants/commonStyles";
import ProductFooter from "@/components/universal/ProductFooter";
import CategoryItem from "@/components/universal/CategoryItem";
import ClearCartSheet from "@/components/BottomSheets/universal/ClearCartSheet";
import DuplicateVariantSheet from "@/components/BottomSheets/universal/DuplicateVariantSheet";
import MerchantRatingSheet from "@/components/BottomSheets/universal/MerchantRatingSheet";
import ProductDetailSheet from "@/components/BottomSheets/universal/ProductDetailSheet";
import DistanceWarning from "@/components/BottomSheets/universal/DistanceWarning";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const { height } = Dimensions.get("window");

const Product = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  const [product, setProduct] = useState<ProductProps | null>(null);
  const [duplicateProduct, setDuplicateProductId] =
    useState<ProductProps | null>(null);
  const [trigger, setTrigger] = useState<string>(`${new Date()}`);
  const [selectedDetailProduct, setSelectedDetailProduct] =
    useState<ProductProps | null>(null);

  const scrollViewRef = useRef<ScrollView>(null);

  const variantSheetRef = useRef<BottomSheet>(null);
  const clearCartSheetRef = useRef<BottomSheet>(null);
  const duplicateVariantSheetRef = useRef<BottomSheet>(null);
  const ratingSheetRef = useRef<BottomSheet>(null);
  const productDetailRef = useRef<BottomSheet>(null);
  const distanceWarningSheetRef = useRef<BottomSheet>(null);

  const variantSheetSnapPoints = useMemo(() => ["60%"], []);
  const clearCartSheetSnapPoints = useMemo(() => ["28%"], []);
  const duplicateSheetSnapPoints = useMemo(() => ["40%"], []);
  const ratingSheetSnapPoints = useMemo(() => ["45%"], []);
  const productDetailSnapPoints = useMemo(() => ["55%"], []);
  const distanceWarningSheetSnapPoints = useMemo(() => ["48%"], []);

  const { merchantId } = useLocalSearchParams();
  const { selectedBusiness } = useAuthStore.getState();
  const { latitude, longitude } = useSafeLocation();

  const CATEGORY_LIMIT: number = 4; // Increased for better UX when paginating

  const {
    data: categoryData,
    fetchNextPage: fetchNextCategoryPage,
    hasNextPage: hasNextCategoryPage,
    isFetchingNextPage: isFetchingNextCategoryPage,
  } = useInfiniteQuery({
    queryKey: ["category", merchantId, selectedBusiness],
    queryFn: ({ pageParam = 1 }) =>
      getAllCategory(
        merchantId.toString(),
        selectedBusiness || "",
        pageParam,
        CATEGORY_LIMIT
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });

  const { data: merchantData } = useQuery<MerchantDataProps>({
    queryKey: ["merchant-data", merchantId],
    queryFn: () => getMerchantData(merchantId.toString(), latitude, longitude),
  });

  useEffect(() => {
    // console.log("MerchantData", merchantData);
    if (merchantData?.distanceWarning) {
      setTimeout(() => {
        distanceWarningSheetRef.current?.snapToIndex(0);
      }, 100);
    }
  }, [merchantData]);

  const handleSelectFilter = (value: string) => {
    if (value === selectedFilter) {
      setSelectedFilter("");
    } else {
      setSelectedFilter(value);
    }
  };

  const handleOpenProductDetails = (product: ProductProps) => {
    setSelectedDetailProduct(product);

    if (productDetailRef.current) {
      productDetailRef.current.snapToIndex(0);
    } else {
      console.warn("ProductDetail BottomSheet ref is NULL");
    }
  };

  const openVariantSheet = (product: ProductProps) => {
    if (!product) return;

    if (product.cartCount) {
      setDuplicateProductId(product);
      duplicateVariantSheetRef.current?.snapToIndex(0);
    } else {
      setProduct((prevProduct) => prevProduct || product);
      variantSheetRef.current?.snapToIndex(0);
    }
  };

  const handleNewCustomization = (product: ProductProps | null) => {
    if (product?.productId) {
      setProduct(product);
      duplicateVariantSheetRef.current?.close();
      variantSheetRef.current?.snapToIndex(0);
    }
  };

  const handleBottomSheetClose = useCallback(() => {
    setTrigger((prev) => `${prev}-${Date.now()}`);
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        style={[props.style, commonStyles.backdrop]}
      />
    ),
    []
  );

  const renderItem = ({ item }: any) => {
    return (
      <Pressable
        style={[
          styles.filterItem,
          selectedFilter === item.value && styles.selectedFilter,
        ]}
        onPress={() => handleSelectFilter(item.value)}
      >
        <Typo
          size={13}
          color={
            selectedFilter === item.value ? colors.WHITE : colors.NEUTRAL900
          }
        >
          {item.label}
        </Typo>

        {selectedFilter === item.value && <XCircle size={20} color="white" />}
      </Pressable>
    );
  };

  const categories = useMemo(() => {
    return categoryData?.pages.flatMap((page) => page.data) || [];
  }, [categoryData]);

  const renderHeader = () => (
    <>
      <View style={styles.merchantOuter}>
        <Header title="Products" />

        <MerchantData
          merchantData={merchantData ? merchantData : null}
          openRating={() => ratingSheetRef.current?.snapToIndex(0)}
        />
      </View>

      <MerchantBanner merchantId={merchantId.toString()} />

      <View style={{ paddingHorizontal: scale(20) }}>
        <SearchView
          placeholder="Search Dishes / Products"
          onPress={() => router.push("/screens/universal/product-search")}
        />

        <FlatList
          data={productFilters}
          renderItem={renderItem}
          keyExtractor={(item) => item.value}
          horizontal
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ marginVertical: verticalScale(15) }}
        />
      </View>
    </>
  );

  const renderFooter = () => (
    <>
      {isFetchingNextCategoryPage && (
        <View style={styles.loadingContainer}>
          <SkeletonPlaceholder borderRadius={4}>
            <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
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
      )}

      <ProductFooter merchantData={merchantData ? merchantData : null} />

      {/* Add a Load More button as a fallback */}
      {/* {hasNextCategoryPage && !isFetchingNextCategoryPage && (
        <Pressable
          style={styles.loadMoreButton}
          onPress={() => fetchNextCategoryPage()}
        >
          <Typo size={14} color={colors.WHITE}>
            Load More Categories
          </Typo>
        </Pressable>
      )} */}
    </>
  );

  // Render each category with its own separate FlatList
  const renderCategory = ({ item }) => (
    <CategoryItem
      key={`category-${item.categoryId}`}
      category={item}
      openVariant={openVariantSheet}
      onProductPress={handleOpenProductDetails}
      trigger={trigger}
    />
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <StatusBar
          backgroundColor={colors.NEUTRAL200}
          style="dark"
          translucent={false}
        />

        {/* Main ScrollView that contains individual category FlatLists */}
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: verticalScale(80) }}
          onScroll={({ nativeEvent }) => {
            const { layoutMeasurement, contentOffset, contentSize } =
              nativeEvent;
            const paddingToBottom = 200;

            // Check if scrolled near to bottom
            if (
              layoutMeasurement.height + contentOffset.y >=
              contentSize.height - paddingToBottom
            ) {
              if (hasNextCategoryPage && !isFetchingNextCategoryPage) {
                fetchNextCategoryPage();
              }
            }
          }}
          scrollEventThrottle={16}
        >
          {renderHeader()}

          {/* Render each category independently */}
          {categories.map((category) => (
            <FlatList
              key={`category-flatlist-${category.categoryId}`}
              data={[category]} // Pass single category as an array
              renderItem={renderCategory}
              scrollEnabled={false} // Disable scrolling on nested FlatList
              showsVerticalScrollIndicator={false}
            />
          ))}

          {renderFooter()}
        </ScrollView>

        <FloatingCart onClearCart={() => clearCartSheetRef.current?.expand()} />

        <BottomSheet
          ref={variantSheetRef}
          index={-1}
          snapPoints={variantSheetSnapPoints}
          enableDynamicSizing={false}
          enablePanDownToClose
          onClose={() => setProduct(null)}
          backdropComponent={renderBackdrop}
        >
          <VariantSheet
            product={product ? product : null}
            onAddItem={() => {
              setTrigger((prev) => `${prev}-${new Date().getTime()}`);
              variantSheetRef.current?.close();
            }}
          />
        </BottomSheet>

        <BottomSheet
          ref={clearCartSheetRef}
          index={-1}
          snapPoints={clearCartSheetSnapPoints}
          enableDynamicSizing={false}
          enablePanDownToClose
          backdropComponent={renderBackdrop}
        >
          <ClearCartSheet
            closeClearCartSheet={() => {
              handleBottomSheetClose();
              clearCartSheetRef.current?.close();
            }}
          />
        </BottomSheet>

        <BottomSheet
          ref={duplicateVariantSheetRef}
          index={-1}
          snapPoints={duplicateSheetSnapPoints}
          enableDynamicSizing={false}
          enablePanDownToClose
          backdropComponent={renderBackdrop}
          onClose={handleBottomSheetClose}
        >
          <DuplicateVariantSheet
            product={duplicateProduct}
            onNewCustomization={handleNewCustomization}
            closeSheet={() => {
              setTrigger((prev) => `${prev}-${new Date().getTime()}`);
              duplicateVariantSheetRef.current?.close();
            }}
          />
        </BottomSheet>

        <BottomSheet
          ref={ratingSheetRef}
          index={-1}
          snapPoints={ratingSheetSnapPoints}
          enableDynamicSizing={false}
          enablePanDownToClose
          backdropComponent={renderBackdrop}
        >
          <MerchantRatingSheet
            merchantId={merchantId.toString()}
            rating={merchantData?.rating || 0}
            onPress={() => ratingSheetRef.current?.close()}
          />
        </BottomSheet>
        <BottomSheet
          ref={productDetailRef}
          index={-1}
          snapPoints={productDetailSnapPoints}
          enableDynamicSizing={false}
          enablePanDownToClose
          backdropComponent={renderBackdrop}
          onClose={() => {
            handleBottomSheetClose();
          }}
        >
          {selectedDetailProduct && (
            <ProductDetailSheet
              product={selectedDetailProduct}
              onClose={() => {
                productDetailRef.current?.close();
              }}
            />
          )}
        </BottomSheet>

        <BottomSheet
          ref={distanceWarningSheetRef}
          index={-1}
          snapPoints={distanceWarningSheetSnapPoints}
          enableDynamicSizing={false}
          enablePanDownToClose
          backdropComponent={renderBackdrop}
        >
          <DistanceWarning
            closeDistanceWarningSheet={() => {
              setTrigger((prev) => `${prev}-${Date.now()}`);
              distanceWarningSheetRef.current?.close();
            }}
          />
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
};

export default Product;

const styles = StyleSheet.create({
  merchantOuter: {
    backgroundColor: colors.NEUTRAL200,
    paddingTop: Platform.OS === "ios" ? height * scale(0.06) : scale(20),
    borderBottomLeftRadius: radius._30,
    borderBottomRightRadius: radius._30,
    paddingBottom: verticalScale(20),
  },
  filterItem: {
    padding: 10,
    paddingHorizontal: 15,
    marginHorizontal: 2,
    borderRadius: 5,
    backgroundColor: colors.NEUTRAL200,
    height: verticalScale(40),
    flexDirection: "row",
    gap: spacingX._5,
    marginRight: scale(15),
    alignItems: "center",
  },
  selectedFilter: {
    backgroundColor: colors.PRIMARY,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
    height: 100,
    marginVertical: verticalScale(10),
    paddingHorizontal: scale(20),
    backgroundColor: colors.WHITE,
  },
  loadMoreButton: {
    backgroundColor: colors.PRIMARY,
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(20),
    borderRadius: radius._10,
    alignItems: "center",
    marginHorizontal: scale(20),
    marginVertical: verticalScale(15),
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
