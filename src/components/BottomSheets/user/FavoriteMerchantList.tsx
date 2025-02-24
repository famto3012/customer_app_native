import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/store/store";
import { MerchantCardProps } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { getFavoriteMerchants } from "@/service/userService";
import { useFocusEffect } from "@react-navigation/native";
import MerchantCard from "@/components/universal/MerchantCard";
import { SCREEN_HEIGHT } from "@gorhom/bottom-sheet";
import { scale, verticalScale } from "@/utils/styling";
import Typo from "@/components/Typo";
import { spacingX } from "@/constants/theme";

const FavoriteMerchantList = () => {
  const [favoriteMerchantList, setFavoriteMerchantList] = useState<
    MerchantCardProps[]
  >([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isScreenActive, setIsScreenActive] = useState(true);

  const { token } = useAuthStore.getState();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["favoriteMerchantList"],
    queryFn: () => getFavoriteMerchants(),
    enabled: !!token,
  });

  useEffect(() => {
    if (data) setFavoriteMerchantList(data);
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
    return <MerchantCard item={item} />;
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={isScreenActive ? favoriteMerchantList : []}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          !isLoading && !favoriteMerchantList?.length ? (
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
                style={styles.merchantImage}
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
    </View>
  );
};

export default FavoriteMerchantList;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacingX._15,
    marginVertical: verticalScale(20),
  },
  merchantImage: {
    width: scale(340),
    height: scale(340),
  },
});
