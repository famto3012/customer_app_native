import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/store";
import { getFavoriteProducts } from "@/service/userService";
import { ProductProps } from "@/types";
import { useFocusEffect } from "@react-navigation/native";
import FavoriteProductCard from "./FavoriteProductCard";
import { SCREEN_HEIGHT } from "@gorhom/bottom-sheet";
import { scale, verticalScale } from "@/utils/styling";
import Typo from "@/components/Typo";

const FavoriteProductList = () => {
  const [favoriteProductList, setFavoriteProductList] = useState<
    ProductProps[]
  >([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isScreenActive, setIsScreenActive] = useState(true);

  const { token } = useAuthStore.getState();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["favoriteProductList"],
    queryFn: () => getFavoriteProducts(),
    enabled: !!token,
  });

  useEffect(() => {
    if (data) setFavoriteProductList(data);
  }, [data]);

  useFocusEffect(
    useCallback(() => {
      setIsScreenActive(true);
      return () => setIsScreenActive(false);
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (token) await refetch();
    setRefreshing(false);
  }, [refetch]);

  const renderItem = ({ item }: any) => {
    return <FavoriteProductCard item={item} />;
  };

  return (
    <>
      <FlatList
        data={isScreenActive ? favoriteProductList : []}
        renderItem={renderItem}
        keyExtractor={(item) => item.productId}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          !isLoading && !favoriteProductList?.length ? (
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
                resizeMode="contain"
                style={styles.productImage}
              />
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                height: SCREEN_HEIGHT - verticalScale(250),
              }}
            >
              <Typo>Loading...</Typo>
            </View>
          )
        }
      />
    </>
  );
};

export default FavoriteProductList;

const styles = StyleSheet.create({
  productImage: {
    width: scale(340),
    height: scale(340),
  },
});
