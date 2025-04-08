import {
  FlatList,
  Pressable,
  StyleSheet,
  View,
  RefreshControl,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import Search from "@/components/Search";
import { useLocalSearchParams } from "expo-router";
import { XCircle } from "phosphor-react-native";
import { merchantFilters } from "@/utils/defaultData";
import { scale, SCREEN_HEIGHT, verticalScale } from "@/utils/styling";
import { colors, spacingX } from "@/constants/theme";
import Typo from "@/components/Typo";
import MerchantCard from "@/components/universal/MerchantCard";
import { MerchantCardProps } from "@/types";
import { getMerchants } from "@/service/universal";
import { useSafeLocation } from "@/utils/helpers";
import { useInfiniteQuery } from "@tanstack/react-query";
import MerchantCardLoader from "@/components/Loader/MerchantCardLoader";

const Merchants = () => {
  const { businessCategory, businessCategoryId, productName, merchantId } =
    useLocalSearchParams();
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  const [merchants, setMerchants] = useState<MerchantCardProps[]>([]);
  const [query, setQuery] = useState<string>("");
  const [debounceQuery, setDebounceQuery] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);

  const { latitude, longitude } = useSafeLocation();

  const MERCHANT_LIMIT = 10;

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: [
      "merchants",
      businessCategory,
      selectedFilter,
      query,
      productName,
      merchantId,
    ],
    queryFn: ({ pageParam = 1 }) =>
      getMerchants(
        latitude,
        longitude,
        businessCategoryId?.toString() || "",
        selectedFilter,
        query,
        productName?.toString(),
        merchantId as string,
        pageParam,
        MERCHANT_LIMIT
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage?.hasNextPage ? allPages.length + 1 : undefined,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (data?.pages) {
      setMerchants((prev) => {
        const newMerchants = data.pages.flatMap((page) => page.data);
        return JSON.stringify(prev) !== JSON.stringify(newMerchants)
          ? newMerchants
          : prev;
      });
    }
  }, [data]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setQuery(debounceQuery);
    }, 500);
    return () => clearTimeout(timeOut);
  }, [debounceQuery]);

  const handleSelectFilter = (value: string) => {
    setSelectedFilter((prev) => (prev === value ? "" : value));
  };

  const renderFilterItem = useCallback(
    ({ item }: any) => (
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
    ),
    [selectedFilter]
  );

  return (
    <ScreenWrapper>
      <Header title={businessCategory?.toString() || "Merchants"} />

      {merchants.length > 0 && (
        <>
          <Search
            placeHolder="Search Restaurants/Dishes/Products"
            onChangeText={(value) => setDebounceQuery(value)}
          />

          <View
            style={{
              paddingHorizontal: scale(20),
              marginVertical: verticalScale(16),
            }}
          >
            <FlatList
              data={merchantFilters}
              renderItem={renderFilterItem}
              keyExtractor={(item) => item.value}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </>
      )}

      <FlatList
        data={merchants}
        renderItem={({ item }) => <MerchantCard item={item} />}
        keyExtractor={(item) => item.id}
        initialNumToRender={5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.PRIMARY]}
          />
        }
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          isLoading ? (
            <MerchantCardLoader />
          ) : !isLoading && merchants.length === 0 ? (
            <View
              style={{
                flex: 1,
                height: SCREEN_HEIGHT - verticalScale(100),
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typo size={16} color={colors.NEUTRAL800} fontFamily="SemiBold">
                Coming soon...!
              </Typo>
            </View>
          ) : null
        }
        ListFooterComponent={isFetchingNextPage ? <MerchantCardLoader /> : null}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.4}
      />
    </ScreenWrapper>
  );
};

export default Merchants;

const styles = StyleSheet.create({
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
  container: {
    paddingHorizontal: scale(20),
    marginTop: verticalScale(15),
    paddingBottom: verticalScale(30),
    backgroundColor: colors.WHITE,
  },
  shadowContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: scale(5),
    marginBottom: verticalScale(20),
    paddingVertical: verticalScale(10),
  },
});
