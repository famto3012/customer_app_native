import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Platform,
  Pressable,
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

const { height } = Dimensions.get("window");

const Product = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  const [product, setProduct] = useState<ProductProps | null>(null);
  const [duplicateProduct, setDuplicateProductId] =
    useState<ProductProps | null>(null);
  const [trigger, setTrigger] = useState<string>(`${new Date()}`);
  const [selectedDetailProduct, setSelectedDetailProduct] =
    useState<ProductProps | null>(null);

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
  const distanceWarningSheetSnapPoints = useMemo(() => ["50%"], []);

  const { merchantId } = useLocalSearchParams();
  const { selectedBusiness } = useAuthStore.getState();
  const { latitude, longitude } = useSafeLocation();

  const CATEGORY_LIMIT: number = 5;

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
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasNextPage ? allPages.length + 1 : undefined,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });

  const { data: merchantData } = useQuery<MerchantDataProps>({
    queryKey: ["merchant-data", merchantId],
    queryFn: () => getMerchantData(merchantId.toString(), latitude, longitude),
  });

  useEffect(() => {
    if (merchantData?.distanceWarning) {
      distanceWarningSheetRef.current?.snapToIndex(0);
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

  return (
    <GestureHandlerRootView>
      <View>
        <StatusBar
          backgroundColor={colors.NEUTRAL200}
          style="dark"
          translucent={false}
        />

        <FlatList
          data={categoryData?.pages.flatMap((page) => page.data) || []}
          renderItem={({ item }) => (
            <CategoryItem
              category={item}
              openVariant={openVariantSheet}
              onProductPress={handleOpenProductDetails}
              trigger={trigger}
            />
          )}
          keyExtractor={(item, index) => `category-${item.categoryId}-${index}`}
          onEndReached={() => hasNextCategoryPage && fetchNextCategoryPage()}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
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
          ListFooterComponent={
            isFetchingNextCategoryPage ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  width: SCREEN_WIDTH,
                  height: 30,
                }}
              >
                <ActivityIndicator size="small" />
              </View>
            ) : (
              <ProductFooter
                merchantData={merchantData ? merchantData : null}
              />
            )
          }
        />

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
              setTrigger((prev) => `${prev}-${new Date().getTime()}`); // Ensure unique value
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
  icon: {
    width: scale(24),
    height: verticalScale(24),
    resizeMode: "cover",
    marginEnd: scale(10),
  },
});
