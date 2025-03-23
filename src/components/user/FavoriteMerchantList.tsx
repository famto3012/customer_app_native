import { FlatList, Image, RefreshControl, View } from "react-native";
import { useCallback, useState } from "react";
import { useAuthStore } from "@/store/store";
import { useQuery } from "@tanstack/react-query";
import { getFavoriteMerchants } from "@/service/userService";
import MerchantCard from "@/components/universal/MerchantCard";
import { SCREEN_HEIGHT } from "@gorhom/bottom-sheet";
import { scale, verticalScale } from "@/utils/styling";
import MerchantCardLoader from "@/components/Loader/MerchantCardLoader";
import { commonStyles } from "@/constants/commonStyles";
import { MerchantCardProps } from "@/types";

const FavoriteMerchantList = () => {
  const [refreshing, setRefreshing] = useState(false);

  const { token } = useAuthStore.getState();

  const { data, isLoading, refetch } = useQuery<{
    success: boolean;
    data: MerchantCardProps[];
  }>({
    queryKey: ["favorite-merchant-list"],
    queryFn: () => getFavoriteMerchants(),
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
        data={data?.data ?? []}
        renderItem={({ item }) => <MerchantCard item={item} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          isLoading ? (
            <MerchantCardLoader />
          ) : data?.data?.length === 0 ? (
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
            </View>
          ) : null
        }
        contentContainerStyle={{
          paddingHorizontal: scale(20),
          marginTop: verticalScale(20),
          paddingBottom: verticalScale(20),
        }}
      />
    </>
  );
};

export default FavoriteMerchantList;
