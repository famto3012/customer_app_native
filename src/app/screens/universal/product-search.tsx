import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import Search from "@/components/Search";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { filterAndSearchProducts } from "@/service/universal";
import { useAuthStore } from "@/store/store";
import ProductCard from "@/components/universal/ProductCard";
import { scale, verticalScale } from "@/utils/styling";
import Typo from "@/components/Typo";
import FloatingCart from "@/components/universal/FloatingCart";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import ClearCartSheet from "@/components/BottomSheets/universal/ClearCartSheet";
import { commonStyles } from "@/constants/commonStyles";
import { ProductProps } from "@/types";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const ProductSearch = () => {
  const [query, setQuery] = useState<string>("");
  const [debounceQuery, setDebounceQuery] = useState<string>("");
  const [product, setProduct] = useState<ProductProps | null>(null);
  const [duplicateProduct, setDuplicateProductId] =
    useState<ProductProps | null>(null);

  const clearCartSheetRef = useRef<BottomSheet>(null);
  const variantSheetRef = useRef<BottomSheet>(null);
  const duplicateVariantSheetRef = useRef<BottomSheet>(null);

  const clearCartSheetSnapPoints = useMemo(() => ["28%"], []);
  const variantSheetSnapPoints = useMemo(() => ["60%"], []);
  const duplicateSheetSnapPoints = useMemo(() => ["40%"], []);

  useEffect(() => {
    setTimeout(() => {
      setQuery(debounceQuery);
    }, 500);
  }, [debounceQuery]);

  const { data, isLoading } = useQuery({
    queryKey: ["search-products", query],
    queryFn: () =>
      filterAndSearchProducts(
        useAuthStore.getState().selectedMerchant.merchantId || "",
        "",
        query
      ),
    enabled: !!query,
  });

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
    <ScreenWrapper>
      <Header title="Search Products" />

      <Search
        placeHolder="Search Products"
        onChangeText={(data: string) => setDebounceQuery(data)}
      />

      <FlatList
        data={data || []}
        renderItem={({ item }) => <ProductCard item={item} showAddCart />}
        contentContainerStyle={{
          paddingHorizontal: scale(20),
          marginTop: verticalScale(20),
        }}
        ListEmptyComponent={
          isLoading ? (
            <View
              style={{
                paddingVertical: scale(20),
                paddingHorizontal: scale(10),
                justifyContent: "center",
                alignItems: "flex-start",
                gap: scale(20),
              }}
            >
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
          ) : (
            <View>
              <Typo>No Items found !</Typo>
            </View>
          )
        }
      />

      <FloatingCart onClearCart={() => clearCartSheetRef.current?.expand()} />

      <BottomSheet
        ref={clearCartSheetRef}
        index={-1}
        snapPoints={clearCartSheetSnapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <ClearCartSheet
          closeClearCartSheet={() => clearCartSheetRef.current?.close()}
        />
      </BottomSheet>
    </ScreenWrapper>
  );
};

export default ProductSearch;

const styles = StyleSheet.create({});
