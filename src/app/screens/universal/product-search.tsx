import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import Search from "@/components/Search";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { filterAndSearchProducts } from "@/service/universal";
import { useAuthStore } from "@/store/store";
import { scale, verticalScale } from "@/utils/styling";
import Typo from "@/components/Typo";
import FloatingCart from "@/components/universal/FloatingCart";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import ClearCartSheet from "@/components/BottomSheets/universal/ClearCartSheet";
import { commonStyles } from "@/constants/commonStyles";
import ProductItem from "@/components/universal/ProductScreen/ProductItem";
import VariantSheet from "@/components/BottomSheets/VariantSheet";
import DuplicateVariantSheet from "@/components/BottomSheets/universal/DuplicateVariantSheet";
import { colors } from "@/constants/theme";
import { useData } from "@/context/DataContext";

const ProductSearch = () => {
  const [query, setQuery] = useState<string>("");
  const [debounceQuery, setDebounceQuery] = useState<string>("");

  const { setProductCounts } = useData();

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
        useAuthStore.getState().selectedMerchant.merchantId as string,
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

      <View style={{ marginBottom: verticalScale(20) }}>
        <Search
          placeHolder="Search Products"
          onChangeText={(data: string) => setDebounceQuery(data)}
        />
      </View>

      <FlatList
        data={data || []}
        renderItem={({ item }) => (
          <ProductItem
            product={item}
            showAddCart
            openVariant={(count) =>
              count && count > 0
                ? duplicateVariantSheetRef.current?.expand()
                : variantSheetRef.current?.expand()
            }
          />
        )}
        contentContainerStyle={{
          paddingHorizontal: scale(20),
          marginTop: verticalScale(20),
          paddingBottom: setProductCounts.length
            ? verticalScale(100)
            : verticalScale(10),
        }}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator />
          ) : (
            <View style={{ alignSelf: "center" }}>
              {data?.length === 0 ? (
                <Typo size={16} color={colors.NEUTRAL700}>
                  No Items found !
                </Typo>
              ) : (
                <Typo size={16} color={colors.NEUTRAL700}>
                  Search your favourites...
                </Typo>
              )}
            </View>
          )
        }
        showsVerticalScrollIndicator={false}
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
    </ScreenWrapper>
  );
};

export default ProductSearch;

const styles = StyleSheet.create({});
