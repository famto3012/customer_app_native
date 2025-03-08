import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { FC, memo } from "react";
import { colors, radius } from "@/constants/theme";
import Typo from "../Typo";
import { CategoryProps, ProductProps } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { getAllProducts } from "@/service/universal";
import ProductCard from "./ProductCard";
import { useAuthStore } from "@/store/store";
import Animated, {
  FadeInUp,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import { useFocusEffect } from "@react-navigation/native";

const useProducts = (categoryId: string, userId: string) => {
  return useInfiniteQuery({
    queryKey: ["products", categoryId],
    queryFn: ({ pageParam = 1 }) =>
      getAllProducts(categoryId, userId, pageParam, 10),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasNextPage ? allPages.length + 1 : undefined,
    enabled: !!categoryId,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });
};

const ProductList: FC<{
  categoryId: string;
  openVariant: (product: ProductProps) => void;
  trigger: string;
}> = ({ categoryId, openVariant, trigger }) => {
  const { userId } = useAuthStore.getState();
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useProducts(categoryId, userId || "");

  useFocusEffect(
    useCallback(() => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }, [])
  );

  if (isLoading) return <ActivityIndicator size="small" />;
  if (isError) return <Text>Error loading products.</Text>;

  const products = Array.from(
    new Map(
      data?.pages
        .flatMap((page) => page.data)
        .map((item) => [item.productId, item])
    ).values()
  );

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.productId}
      renderItem={({ item }) => (
        <ProductCard
          item={item}
          openVariant={(product: ProductProps) => openVariant(product)}
          cartCount={item?.cartCount || null}
          showAddCart={true}
          trigger={trigger}
        />
      )}
      onEndReached={() => hasNextPage && fetchNextPage()}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? <ActivityIndicator size="small" /> : null
      }
      ItemSeparatorComponent={() => (
        <View style={{ height: verticalScale(15) }} />
      )}
      windowSize={10}
      initialNumToRender={5}
      maxToRenderPerBatch={5}
      scrollEnabled={false}
    />
  );
};

const CategoryItem: FC<{
  category: CategoryProps;
  openVariant: (product: ProductProps) => void;
  trigger: string;
}> = ({ category, openVariant, trigger }) => {
  const [isExpanded, setIsExpanded] = useState(category.status);

  return (
    <Animated.View
      style={[
        styles.categoryContainer,
        { paddingBottom: isExpanded ? verticalScale(10) : verticalScale(0) },
      ]}
      layout={LinearTransition.damping(10)}
    >
      <Pressable
        style={styles.categoryBtn}
        onPress={() => setIsExpanded((prev) => !prev)}
      >
        <Typo size={16} color={colors.NEUTRAL900} fontFamily="SemiBold">
          {category.categoryName}
        </Typo>

        <Animated.Image
          source={require("@/assets/icons/arrow-square-up.webp")}
          style={{
            height: verticalScale(24),
            width: scale(24),
            resizeMode: "cover",
            marginRight: scale(10),
            transform: [{ rotate: isExpanded ? "180deg" : "0deg" }],
          }}
        />
      </Pressable>

      {isExpanded && (
        <Animated.View
          entering={FadeInUp.springify().damping(12).stiffness(100)}
          exiting={FadeOut.springify().damping(10).stiffness(80)}
        >
          <ProductList
            categoryId={category.categoryId}
            openVariant={(product: ProductProps) => openVariant(product)}
            trigger={trigger}
          />
        </Animated.View>
      )}
    </Animated.View>
  );
};

export default memo(CategoryItem);

const styles = StyleSheet.create({
  categoryContainer: {
    marginVertical: verticalScale(10),
    backgroundColor: colors.WHITE,
    paddingHorizontal: scale(7),
    marginHorizontal: scale(10),
    borderRadius: radius._10,
  },
  categoryBtn: {
    paddingTop: verticalScale(24),
    paddingBottom: verticalScale(24),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
