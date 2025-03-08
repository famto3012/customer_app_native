import {
  ActivityIndicator,
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

const Merchants = () => {
  const { businessCategory, businessCategoryId } = useLocalSearchParams();
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  const [merchants, setMerchants] = useState<MerchantCardProps[]>([]);
  const [query, setQuery] = useState<string>("");
  const [debounceQuery, setDebounceQuery] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);

  const { latitude, longitude } = useSafeLocation();

  const MERCHANT_LIMIT = 10;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useInfiniteQuery({
      queryKey: ["merchants", businessCategory, selectedFilter, query],
      queryFn: ({ pageParam = 1 }) =>
        getMerchants(
          latitude,
          longitude,
          businessCategoryId?.toString() || "",
          selectedFilter,
          query,
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
    await refetch(); // Fetch fresh data
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
          !isFetchingNextPage && merchants.length === 0 ? (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                height: SCREEN_HEIGHT - verticalScale(250),
              }}
            >
              <Typo>Coming Soon...</Typo>
            </View>
          ) : null
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={{ paddingVertical: 20, alignItems: "center" }}>
              <ActivityIndicator size="large" color={colors.PRIMARY} />
            </View>
          ) : null
        }
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
});
