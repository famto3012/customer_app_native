import { FlatList, View } from "react-native";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { CategoryProps, MerchantDataProps, ProductProps } from "@/types";
import { useLocalSearchParams } from "expo-router";
import { useAuthStore } from "@/store/store";
import { useQuery } from "@tanstack/react-query";
import FloatingCart from "@/components/universal/FloatingCart";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import VariantSheet from "@/components/BottomSheets/VariantSheet";
import ClearCartSheet from "@/components/BottomSheets/universal/ClearCartSheet";
import DuplicateVariantSheet from "@/components/BottomSheets/universal/DuplicateVariantSheet";
import {
  fetchCategory,
  fetchProduct,
  getMerchantData,
} from "@/service/universal";
import { useSafeLocation } from "@/utils/helpers";
import HeaderComponent from "@/components/universal/ProductScreen/HeaderComponent";
import CategoryContainer from "@/components/universal/ProductScreen/CategoryContainer";
import EmptyComponent from "@/components/universal/ProductScreen/EmptyComponent";
import { commonStyles } from "@/constants/commonStyles";
import ProductDetailSheet from "@/components/BottomSheets/universal/ProductDetailSheet";
import MerchantRatingSheet from "@/components/BottomSheets/universal/MerchantRatingSheet";
import DistanceWarning from "@/components/BottomSheets/universal/DistanceWarning";
import ProductCategoryLoader from "@/components/Loader/ProductCategoryLoader";
import { verticalScale } from "@/utils/styling";

const Products = () => {
  // Combined data structure for categories and their products
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [categoryProducts, setCategoryProducts] = useState<{
    [key: string]: ProductProps[];
  }>({});

  // State for tracking various loading states
  const [isLoading, setIsLoading] = useState(false);
  const [categoryPage, setCategoryPage] = useState(1);
  const [hasMoreCategories, setHasMoreCategories] = useState(true);

  const variantSheetRef = useRef<BottomSheet>(null);
  const clearCartSheetRef = useRef<BottomSheet>(null);
  const duplicateVariantSheetRef = useRef<BottomSheet>(null);
  const productDetailRef = useRef<BottomSheet>(null);
  const ratingSheetRef = useRef<BottomSheet>(null);
  const distanceWarningSheetRef = useRef<BottomSheet>(null);

  const variantSheetSnapPoints = useMemo(() => ["60%"], []);
  const clearCartSheetSnapPoints = useMemo(() => ["28%"], []);
  const duplicateSheetSnapPoints = useMemo(() => ["40%"], []);
  const productDetailSnapPoints = useMemo(() => ["55%"], []);
  const ratingSheetSnapPoints = useMemo(() => ["45%"], []);
  const distanceWarningSheetSnapPoints = useMemo(() => ["50%"], []);

  // Refs for checking screen fill
  const listRef = useRef<FlatList>(null);
  const containerHeightRef = useRef(0);
  const contentHeightRef = useRef(0);
  const loadingTimestampRef = useRef<number | null>(null);

  // Get params and state
  const { merchantId } = useLocalSearchParams<{ merchantId: string }>();
  const { selectedBusiness } = useAuthStore.getState();
  const { latitude, longitude } = useSafeLocation();
  const showCart = useAuthStore((state) => state.cart.showCart);

  const { data: merchantData, isLoading: merchantDataLoading } =
    useQuery<MerchantDataProps>({
      queryKey: ["merchant-data", merchantId],
      queryFn: () => getMerchantData(merchantId as string, latitude, longitude),
    });

  useEffect(() => {
    if (merchantData?.distanceWarning) {
      distanceWarningSheetRef.current?.expand();
    }
  }, [merchantData]);

  // Reset state when merchant or business changes
  useEffect(() => {
    setCategories([]);
    setCategoryProducts({});
    setCategoryPage(1);
    setHasMoreCategories(true);
    loadingTimestampRef.current = null;

    // Start the fetch sequence if we have valid inputs
    if (merchantId && selectedBusiness) {
      fetchNextCategoryWithProducts();
    }
  }, [merchantId, selectedBusiness]);

  // Function to fetch a category and all its products
  const fetchNextCategoryWithProducts = async () => {
    if (isLoading || !hasMoreCategories || !merchantId || !selectedBusiness)
      return;

    setIsLoading(true);

    // Set a timestamp to identify this loading operation
    loadingTimestampRef.current = Date.now();

    try {
      // Fetch the next category
      const { data: category, hasNextPage } = await fetchCategory(
        merchantId,
        selectedBusiness as string,
        categoryPage
      );

      if (category) {
        // Update state for new category
        setCategoryPage((prev) => prev + 1);
        setHasMoreCategories(hasNextPage);
        setCategories((prev) => {
          const uniqueCategories = new Set(prev.map((cat) => cat.categoryId));
          if (!uniqueCategories.has(category.categoryId)) {
            return [...prev, category];
          }
          return prev;
        });

        // Keep fetching products until there are no more
        let hasNext = true;
        let currentPage = 0;
        let allProducts: ProductProps[] = [];

        while (hasNext) {
          const nextPage = currentPage + 1;

          const { data, hasNextPage } = await fetchProduct(
            category.categoryId,
            merchantId,
            nextPage
          );

          // Filter out duplicates from new products
          const existingProductIds = new Set(
            allProducts.map((p) => p.productId)
          );
          const newProducts = data.filter(
            (product: ProductProps) =>
              !existingProductIds.has(product.productId)
          );

          // Add new products to our collection
          allProducts = [...allProducts, ...newProducts];

          hasNext = hasNextPage;
          currentPage = nextPage;
        }

        // Update products state for this category
        setCategoryProducts((prev) => ({
          ...prev,
          [category.categoryId]: allProducts,
        }));

        // Check if we need to fetch more categories to fill the screen
        setTimeout(checkIfMoreCategoriesNeeded, 300);
      } else {
        setHasMoreCategories(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
      loadingTimestampRef.current = null;
    }
  };

  // Function to check if we need to load more categories to fill the screen
  const checkIfMoreCategoriesNeeded = useCallback(() => {
    if (
      containerHeightRef.current > contentHeightRef.current &&
      hasMoreCategories &&
      !isLoading
    ) {
      // If the container height is greater than the content height, we need more content
      fetchNextCategoryWithProducts();
    }
  }, [hasMoreCategories, isLoading]);

  // Track layout measurements to determine if screen is filled
  const onContainerLayout = useCallback(
    (event: any) => {
      containerHeightRef.current = event.nativeEvent.layout.height;
      checkIfMoreCategoriesNeeded();
    },
    [checkIfMoreCategoriesNeeded]
  );

  const onContentSizeChange = useCallback(
    (width: number, height: number) => {
      contentHeightRef.current = height;
      checkIfMoreCategoriesNeeded();
    },
    [checkIfMoreCategoriesNeeded]
  );

  // Prepare data for the FlatList by combining categories and loading indicator
  const getListData = useCallback(() => {
    // Create items for categories with their products
    const categoryItems = categories.map((category) => ({
      type: "category" as const,
      id: "category-" + category.categoryId,
      category,
      products: categoryProducts[category.categoryId] || [],
    }));

    // Add loading indicator at the end if needed
    if (isLoading) {
      return [
        ...categoryItems,
        {
          type: "loading" as const,
          id: "loading-" + (loadingTimestampRef.current || Date.now()),
        },
      ];
    }

    return categoryItems;
  }, [categories, categoryProducts, isLoading]);

  // Optimized renderItem function that uses memoized components
  const renderItem = useCallback(
    ({
      item,
    }: {
      item: {
        type: string;
        category?: CategoryProps;
        products?: ProductProps[];
      };
    }) => {
      if (item.type === "loading") {
        return <ProductCategoryLoader />;
      }

      if (item.category && item.products) {
        return (
          <CategoryContainer
            category={item.category}
            products={item.products}
            openVariant={(count?: number) => {
              count && count > 0
                ? duplicateVariantSheetRef.current?.expand()
                : variantSheetRef.current?.expand();
            }}
            openDetail={() => productDetailRef.current?.expand()}
          />
        );
      }

      return null;
    },
    []
  );

  // Memoized key extractor that creates truly unique keys
  const keyExtractor = useCallback((item: any, index: number) => item.id, []);

  const getItemLayout = useCallback((data: any, index: number) => {
    const itemHeight = 180; // Approximate height of each category item
    return {
      length: itemHeight,
      offset: itemHeight * index,
      index,
    };
  }, []);

  const listData = useMemo(
    () => getListData(),
    [categories, categoryProducts, isLoading]
  );

  // Optimized empty component
  const ListEmptyComponent = useCallback(() => {
    return <EmptyComponent isLoading={isLoading} />;
  }, [isLoading]);

  // Memoized onEndReached handler
  const handleEndReached = useCallback(() => {
    if (!isLoading && hasMoreCategories) {
      fetchNextCategoryWithProducts();
    }
  }, [isLoading, hasMoreCategories]);

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

  return (
    <>
      <View style={{ flex: 1 }} onLayout={onContainerLayout}>
        <FlatList
          ref={listRef}
          data={listData}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          onContentSizeChange={onContentSizeChange}
          ListEmptyComponent={ListEmptyComponent}
          ListHeaderComponent={() => (
            <HeaderComponent
              merchantData={merchantData ? merchantData : null}
              merchantDataLoading={merchantDataLoading}
              merchantId={merchantId}
              openRating={() => ratingSheetRef.current?.expand()}
            />
          )}
          contentContainerStyle={{
            paddingBottom: showCart ? verticalScale(60) : 0,
          }}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5} // Increase this value
          maxToRenderPerBatch={4} // Reduce this value
          updateCellsBatchingPeriod={100} // Increase this value
          windowSize={3} // Reduce window size
          removeClippedSubviews={true}
          initialNumToRender={3} // Reduce initial render count
          showsVerticalScrollIndicator={false}
          legacyImplementation={true}
          getItemLayout={getItemLayout}
        />
      </View>

      <FloatingCart onClearCart={() => clearCartSheetRef.current?.expand()} />

      <BottomSheet
        ref={variantSheetRef}
        index={-1}
        snapPoints={variantSheetSnapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <VariantSheet
          onAddItem={() => {
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
      >
        <DuplicateVariantSheet
          onNewCustomization={() => {
            duplicateVariantSheetRef.current?.close();
            variantSheetRef.current?.expand();
          }}
          closeSheet={() => {
            duplicateVariantSheetRef.current?.close();
          }}
        />
      </BottomSheet>

      <BottomSheet
        ref={productDetailRef}
        index={-1}
        snapPoints={productDetailSnapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <ProductDetailSheet />
      </BottomSheet>

      <BottomSheet
        ref={ratingSheetRef}
        index={-1}
        snapPoints={ratingSheetSnapPoints}
        enableDynamicSizing
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <MerchantRatingSheet
          merchantId={merchantId as string}
          rating={merchantData?.rating || 0}
          onPress={() => ratingSheetRef.current?.close()}
        />
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
            distanceWarningSheetRef.current?.close();
          }}
        />
      </BottomSheet>
    </>
  );
};

export default Products;
