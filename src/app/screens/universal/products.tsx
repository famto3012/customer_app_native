import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { scale, SCREEN_WIDTH, verticalScale } from "@/utils/styling";
import { colors, radius, spacingX } from "@/constants/theme";
import Header from "@/components/Header";
import { StatusBar } from "expo-status-bar";
import Typo from "@/components/Typo";
import { CaretUp, Clock, Star, XCircle } from "phosphor-react-native";
import SearchView from "@/components/SearchView";
import { productFilters } from "@/utils/defaultData";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useAuthStore } from "@/store/store";
import {
  AddVariantProps,
  CategoryProps,
  MerchantDataProps,
  ProductProps,
} from "@/types";
import {
  addProductToCart,
  getAllCategory,
  getAllProducts,
  getCustomerCart,
  getMerchantBanners,
  getMerchantData,
  haveValidCart,
} from "@/service/universal";
import { useSafeLocation } from "@/utils/helpers";
import ProductCard from "@/components/universal/ProductCard";
import { Image } from "react-native";
import FloatingCart from "@/components/universal/FloatingCart";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import VariantSheet from "@/components/BottomSheets/VariantSheet";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useFocusEffect } from "@react-navigation/native";

const { height } = Dimensions.get("window");

const Product = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  const [category, setCategory] = useState<CategoryProps[]>([]);
  const [merchant, setMerchant] = useState<MerchantDataProps>(null);
  const [categoryPage, setCategoryPage] = useState<number>(1);
  const [categoryProducts, setCategoryProducts] = useState<{
    [key: string]: ProductProps[];
  }>({});
  const [loadingMore, setLoadingMore] = useState(false);
  const [banners, setBanners] = useState<{ imageURL: string }[]>([]);
  const [product, setProduct] = useState<ProductProps | null>(null);

  const variantSheetRef = useRef<BottomSheet>(null);

  const variantSheetSnapPoints = useMemo(() => ["60%"], []);

  const { merchantId } = useLocalSearchParams();
  const { selectedBusiness, userId } = useAuthStore.getState();
  const { latitude, longitude } = useSafeLocation();

  const CATEGORY_LIMIT: number = 5;
  const PRODUCT_LIMIT: number = 10;

  useEffect(() => {
    fetchMerchantBanners();
    fetchCategory();
  }, [merchantId, selectedBusiness]);

  useFocusEffect(
    useCallback(() => {
      category.forEach((item) => {
        fetchProduct(item.categoryId);
      });
    }, [category])
  );

  const fetchCategory = async () => {
    if (!merchantId || !selectedBusiness || loadingMore) return;

    setLoadingMore(true);

    const res = await getAllCategory(
      merchantId.toString(),
      selectedBusiness,
      categoryPage,
      CATEGORY_LIMIT
    );

    if (res.length > 0) {
      setCategory((prev) => [...prev, ...res]); // Append new categories
      setCategoryPage((prev) => prev + 1); // Increment page for next fetch
    }

    setLoadingMore(false);
  };

  const fetchProduct = async (categoryId: string) => {
    if (categoryProducts[categoryId]) return; // Avoid duplicate calls

    const res = await getAllProducts(
      categoryId,
      userId ? userId : "",
      1, // Always start with page 1 for products
      PRODUCT_LIMIT
    );
    console.log("Products fetched");
    setCategoryProducts((prev) => ({
      ...prev,
      [categoryId]: res,
    }));
  };

  const { data: merchantData } = useQuery({
    queryKey: ["merchant-data", merchantId],
    queryFn: () => getMerchantData(merchantId.toString(), latitude, longitude),
  });

  useEffect(() => {
    setMerchant(merchantData);
  }, [merchantData]);

  const fetchMerchantBanners = async () => {
    const res = await getMerchantBanners(merchantId.toString());
    setBanners(res);
  };

  const handleSelectFilter = (value: string) => {
    if (value === selectedFilter) {
      setSelectedFilter("");
    } else {
      setSelectedFilter(value);
    }
  };

  const onViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: { item: CategoryProps }[];
  }) => {
    viewableItems.forEach(({ item }) => {
      fetchProduct(item.categoryId);
    });
  };

  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };

  const openVariantSheet = (product: ProductProps) => {
    if (product) {
      setProduct(product);
      variantSheetRef.current?.snapToIndex(0);
    }
  };

  const onAddItem = async (data: AddVariantProps) => {
    const quantity = data.quantity ?? 0;
    const res = await addProductToCart(
      data.productId,
      quantity,
      data.variantTypeId
    );

    if (res) {
      const floatingCartRes = await haveValidCart();

      useAuthStore.setState({
        cart: {
          showCart: floatingCartRes.haveCart,
          merchant: floatingCartRes.merchant,
          cartId: floatingCartRes.cartId,
        },
      });

      setCategoryProducts((prev) => {
        const updatedProducts = { ...prev };
        for (const categoryId in updatedProducts) {
          updatedProducts[categoryId] = updatedProducts[categoryId].map(
            (product) => {
              if (product.productId === data.productId) {
                return {
                  ...product,
                  cartCount: (product.cartCount || 0) + data.quantity,
                };
              }
              return product;
            }
          );
        }

        return updatedProducts;
      });

      variantSheetRef.current?.close();
    }
  };

  const handleClearCart = () => {
    setCategoryProducts((prev) => {
      const updatedProducts = JSON.parse(JSON.stringify(prev)); // Deep copy to trigger re-render

      for (const categoryId in updatedProducts) {
        updatedProducts[categoryId] = updatedProducts[categoryId].map(
          (product: ProductProps) => ({
            ...product,
            cartCount: 0,
          })
        );
      }

      return updatedProducts;
    });

    // Also update FloatingCart state to hide it
    useAuthStore.setState({
      cart: {
        showCart: false,
        merchant: "",
        cartId: "",
      },
    });
  };

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        style={[props.style, styles.backdrop]}
        // onPress={handleClosePress}
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

  return (
    <GestureHandlerRootView>
      <View>
        <StatusBar
          backgroundColor={colors.NEUTRAL200}
          style="dark"
          translucent={false}
        />

        <FlatList
          data={category}
          ListHeaderComponent={
            <>
              <View style={styles.merchantOuter}>
                <Header title="Products" />

                <View style={styles.merchantData}>
                  <View style={{ gap: scale(10) }}>
                    <Typo size={20} color={colors.NEUTRAL900} fontWeight="bold">
                      {merchant?.merchantName}
                    </Typo>

                    <View style={styles.labels}>
                      <Clock size={scale(15)} />
                      <Typo
                        size={12}
                        color={colors.NEUTRAL600}
                        fontFamily="Medium"
                      >
                        {merchant?.deliveryTime} min •
                      </Typo>
                      <Typo
                        size={12}
                        color={colors.NEUTRAL600}
                        fontFamily="Medium"
                      >
                        {merchant?.distanceInKM} km •
                      </Typo>
                      <Typo
                        size={12}
                        color={colors.NEUTRAL600}
                        fontFamily="Medium"
                      >
                        {merchant?.displayAddress}
                      </Typo>
                    </View>

                    <Typo size={12} color={colors.NEUTRAL600}>
                      {merchant?.description}
                    </Typo>
                  </View>

                  <View>
                    <Pressable style={styles.rating}>
                      <Star
                        size={scale(15)}
                        color={colors.WHITE}
                        weight="fill"
                      />
                      <Typo size={14} color={colors.WHITE}>
                        {merchant?.rating}
                      </Typo>
                    </Pressable>
                  </View>
                </View>
              </View>

              <FlatList
                data={banners}
                horizontal
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                  <View
                    style={{
                      height: verticalScale(120),
                      width: SCREEN_WIDTH - 40,
                      backgroundColor: "transparent",
                    }}
                  >
                    <Image
                      source={{
                        uri: item.imageURL,
                      }}
                      style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: "transparent",
                      }}
                      resizeMode="cover"
                    />
                  </View>
                )}
                contentContainerStyle={{
                  paddingHorizontal: scale(20),
                  marginTop: verticalScale(15),
                }}
                showsHorizontalScrollIndicator={false}
              />

              <View style={{ paddingHorizontal: scale(20) }}>
                <SearchView
                  placeholder="Search Dishes / Products"
                  onPress={() =>
                    router.push("/screens/universal/product-search")
                  }
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
          }
          renderItem={({ item }) => (
            <View style={styles.categoryContainer}>
              <Pressable
                style={{
                  paddingTop: verticalScale(24),
                  paddingBottom: verticalScale(32),
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typo size={16} color={colors.NEUTRAL900} fontFamily="SemiBold">
                  {item.categoryName}
                </Typo>

                <View
                  style={{
                    marginEnd: scale(10),
                    borderWidth: 1,
                    borderRadius: radius._6,
                    padding: scale(2),
                  }}
                >
                  <CaretUp size={16} />
                </View>
              </Pressable>

              <FlatList
                data={categoryProducts[item.categoryId] || []}
                keyExtractor={(item, index) =>
                  `product-${item.productId}-${index}`
                }
                renderItem={({ item }) => (
                  <ProductCard
                    item={item}
                    openVariant={openVariantSheet}
                    cartCount={item?.cartCount || null}
                    showAddCart={true}
                  />
                )}
                scrollEnabled={false}
              />
            </View>
          )}
          keyExtractor={(item, index) => `category-${item.categoryId}-${index}`}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          onEndReached={fetchCategory}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator size="large" color={colors.PRIMARY} />
            ) : (
              <View
                style={{
                  paddingBottom: verticalScale(100),
                  paddingHorizontal: scale(20),
                }}
              >
                <View>
                  <Typo>FSSAI</Typo>
                  <Typo>FSSAI123456</Typo>
                </View>
                <View>
                  <Typo>Phone</Typo>
                  <Typo>+91 987465122</Typo>
                </View>
              </View>
            )
          }
        />

        <FloatingCart onClearCart={handleClearCart} />

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
            onAddItem={onAddItem}
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
  merchantData: {
    marginHorizontal: scale(20),
    marginTop: verticalScale(30),
    backgroundColor: colors.WHITE,
    padding: scale(15),
    borderRadius: radius._10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  labels: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._3,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._7,
    backgroundColor: colors.PRIMARY,
    paddingHorizontal: scale(8),
    paddingVertical: scale(2),
    borderRadius: radius._3,
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
  categoryContainer: {
    marginVertical: verticalScale(10),
    backgroundColor: colors.WHITE,
    paddingBottom: verticalScale(10),
    paddingHorizontal: scale(7),
    marginHorizontal: scale(10),
    borderRadius: radius._10,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: verticalScale(5),
  },
  productItem: {
    paddingVertical: verticalScale(5),
    borderBottomWidth: 0.5,
    borderBottomColor: colors.NEUTRAL300,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 1)",
  },
});
