import { FlatList, Image, RefreshControl, View } from "react-native";
import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/store";
import { getFavoriteProducts } from "@/service/userService";
import { SCREEN_HEIGHT } from "@gorhom/bottom-sheet";
import { scale, verticalScale } from "@/utils/styling";
import ProductItem from "@/components/universal/ProductScreen/ProductItem";
import ProductCategoryLoader from "@/components/Loader/ProductCategoryLoader";
import { commonStyles } from "@/constants/commonStyles";
import { colors } from "@/constants/theme";
import Typo from "../Typo";

const FavoriteProductList = () => {
  const [refreshing, setRefreshing] = useState(false);

  const { token } = useAuthStore.getState();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["favorite-product-list"],
    queryFn: () => getFavoriteProducts(),
    enabled: !!token,
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (token) await refetch();
    setRefreshing(false);
  }, [refetch]);

  return (
    <>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <ProductItem product={item} navigateToMerchant />
        )}
        keyExtractor={(item) => item.productId}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          isLoading ? (
            <ProductCategoryLoader />
          ) : data?.length === 0 ? (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                height: SCREEN_HEIGHT - verticalScale(300),
              }}
            >
              <Image
                source={require("@/assets/images/favorite-list.webp")}
                style={commonStyles.emptyFavoriteListImage}
              />

              <Typo size={15} fontFamily="SemiBold" color={colors.NEUTRAL900}>
                Your favourite list is empty
              </Typo>
            </View>
          ) : null
        }
        contentContainerStyle={{
          paddingHorizontal: data?.length > 0 ? scale(20) : 0,
          marginTop: verticalScale(20),
        }}
      />
    </>
  );
};

export default FavoriteProductList;
