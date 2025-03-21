import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Input from "@/components/Input";
import { scale, verticalScale } from "@/utils/styling";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import Header from "@/components/Header";
import { colors, radius } from "@/constants/theme";
import Typo from "@/components/Typo";
import { Star } from "phosphor-react-native";
import { useAuthStore } from "@/store/store";
import { router } from "expo-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { searchMerchantAndProducts } from "@/service/userService";

const useHomeSearch = (query: string) => {
  return useInfiniteQuery({
    queryKey: ["home-search", query],
    queryFn: ({ pageParam = 1 }) =>
      query
        ? searchMerchantAndProducts(query, pageParam, 10)
        : Promise.resolve({ data: [], hasNextPage: false }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    enabled: query.length > 0, // Only run query when search has content
  });
};

const HomeSearch = () => {
  const [query, setQuery] = useState<string>("");
  const { setSelectedBusiness } = useAuthStore.getState();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useHomeSearch(query);

  // Flatten the pages data properly
  const results = data?.pages.flatMap((page) => page.data) || [];

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  // Handle item rendering
  const renderItem = ({ item }: { item: any }) => {
    if (item?.type === "dish") {
      return (
        <Pressable
          onPress={() => {
            setSelectedBusiness(item.businessCategoryId);
            router.push({
              pathname: "/screens/merchants",
              params: {
                businessCategory: item?.businessCategoryName,
                businessCategoryId: item?.businessCategoryId,
                productName: item?.name,
              },
            });
          }}
          style={styles.productContainer}
        >
          <Image
            source={{ uri: item?.image }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.textContainer}>
            <Typo size={14} fontFamily="Medium" color={colors.NEUTRAL900}>
              {truncateText(item?.name, 30)}
            </Typo>
            <Typo size={13} color={colors.NEUTRAL500}>
              {item?.type}
            </Typo>
          </View>
        </Pressable>
      );
    } else {
      return (
        <Pressable
          onPress={() => {
            setSelectedBusiness(item.businessCategoryId);
            router.push({
              pathname: "/screens/merchants",
              params: {
                businessCategory: item.businessCategoryForPush,
                businessCategoryId: item.businessCategoryId,
                merchantId: item?._id,
              },
            });
          }}
          style={styles.productContainer}
        >
          <Image
            source={{ uri: item?.image }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.textContainer}>
            <View style={styles.nameTypeContainer}>
              <Typo size={14} color={colors.NEUTRAL900} fontFamily="Medium">
                {truncateText(item?.name, 30)}
              </Typo>
              {/* <Typo
                size={13}
                color={colors.NEUTRAL500}
                fontFamily="Medium"
                style={{ marginHorizontal: scale(40) }}
              >
                {item?.type}
              </Typo> */}
              <View style={styles.ratingContainer}>
                {item?.averageRating >= 3 && (
                  <>
                    <Star color={colors.YELLOW} size={24} weight="fill" />
                    <Typo size={13} color={colors.NEUTRAL500}>
                      {item?.averageRating}
                    </Typo>
                  </>
                )}
                <Typo
                  size={13}
                  color={colors.NEUTRAL500}
                  style={
                    item?.averageRating >= 3
                      ? { marginHorizontal: scale(10) }
                      : {}
                  }
                >
                  {item?.address}
                </Typo>
              </View>
            </View>
          </View>
        </Pressable>
      );
    }
  };

  // Handle loading and error states
  if (isLoading && query.length > 0) {
    return (
      <ScreenWrapper>
        <Header title="Search " />
        <View style={styles.inputContainer}>
          <Input
            placeholder="Search for dishes, restaurants & groceries"
            value={query}
            onChangeText={setQuery}
          />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.PRIMARY} />
        </View>
      </ScreenWrapper>
    );
  }

  if (isError) {
    return (
      <ScreenWrapper>
        <Header title="Search " />
        <View style={styles.inputContainer}>
          <Input
            placeholder="Search for dishes, restaurants & groceries"
            value={query}
            onChangeText={setQuery}
          />
        </View>
        <View style={styles.errorContainer}>
          <Typo size={16} color={colors.RED}>
            Error loading results for "{query}"
          </Typo>
        </View>
      </ScreenWrapper>
    );
  }

  // Handle pagination loading
  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footerLoading}>
        <ActivityIndicator size="small" color={colors.PRIMARY} />
      </View>
    );
  };

  return (
    <ScreenWrapper>
      <Header title="Search " />
      <View style={styles.inputContainer}>
        <Input
          placeholder="Search for dishes, restaurants & groceries"
          value={query}
          onChangeText={setQuery}
        />
      </View>
      <FlatList
        data={results}
        keyExtractor={(item, index) => `search-item-${index}`}
        renderItem={renderItem}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        ItemSeparatorComponent={() => (
          <View style={{ height: verticalScale(5) }} />
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          query.length > 0 ? (
            <View style={styles.emptyContainer}>
              <Typo size={16} color={colors.NEUTRAL500}>
                No results found for "{query}"
              </Typo>
            </View>
          ) : null
        }
      />
    </ScreenWrapper>
  );
};

export default HomeSearch;

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: scale(15),
    marginHorizontal: scale(20),
    height: SCREEN_HEIGHT * 0.06,
  },
  productContainer: {
    flexDirection: "row",
    alignItems: "center", // Centers items in row
    padding: scale(10), // Add padding
    marginHorizontal: scale(20),
    marginBottom: scale(2),
    backgroundColor: colors.WHITE,
    borderRadius: scale(10), // Round corners
    elevation: 5,
    height: SCREEN_HEIGHT * 0.1, // Adjusted height
  },
  image: {
    width: scale(60),
    height: scale(60),
    borderRadius: radius._15, // Make image look smoother
  },
  textContainer: {
    marginLeft: scale(10), // Space between image & text
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  nameTypeContainer: {
    flex: 1,
    // flexDirection: "row",
    justifyContent: "center",
  },
  ratingContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    maxHeight: scale(25),
  },
  listContainer: {
    paddingBottom: scale(20),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: scale(20),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: scale(50),
  },
  footerLoading: {
    paddingVertical: scale(20),
    justifyContent: "center",
    alignItems: "center",
  },
});
