import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Image,
  RefreshControl,
} from "react-native";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchTransactionHistory } from "@/service/userService";
import { scale, verticalScale } from "@/utils/styling";
import Typo from "@/components/Typo";
import { colors, spacingY } from "@/constants/theme";
import { useAuthStore } from "@/store/store";

interface TransactionProps {
  transactionAmount: number;
  transactionType: string;
  type: string;
  transactionDate: string;
  transactionTime: string;
}

const Transaction = () => {
  const { token } = useAuthStore.getState();

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["transaction-history"],
    queryFn: ({ pageParam = 1 }) => fetchTransactionHistory(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 20 ? allPages.length + 1 : undefined;
    },
    enabled: !!token,
  });

  const transactions = data?.pages.flat() || [];

  const renderItem = ({ item }: { item: TransactionProps }) => (
    <View style={styles.transactionItem}>
      <Image
        source={require("@/assets/icons/rupee.webp")}
        style={styles.image}
      />

      <View style={{ flex: 1, marginStart: scale(10) }}>
        <Typo size={15} fontFamily="Medium" color={colors.NEUTRAL900}>
          {item.transactionType}
        </Typo>
        <Typo size={13} color={colors.NEUTRAL500}>
          {item.transactionDate}, {item.transactionTime}
        </Typo>
      </View>

      <Typo
        size={13}
        color={item.type === "Debit" ? colors.RED : colors.GREEN}
        fontFamily="SemiBold"
      >
        {item.type === "Debit" ? "-" : "+"} ₹ {item.transactionAmount}
      </Typo>
    </View>
  );

  if (isLoading) {
    return (
      <ScreenWrapper>
        <Header title="Transaction History" />
        <ActivityIndicator size="large" color={colors.PRIMARY} />
      </ScreenWrapper>
    );
  }

  if (isError) {
    return (
      <ScreenWrapper>
        <Header title="Transaction History" />
        <Text>Error loading transactions.</Text>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper style={{ gap: spacingY._15 }}>
      <Header title="Transaction History" />

      {transactions.length > 0 ? (
        <FlatList
          data={transactions}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: scale(20),
            paddingBottom: verticalScale(20),
          }}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refetch} />
          }
          onEndReached={() => {
            if (hasNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator size="small" color={colors.PRIMARY} />
            ) : null
          }
        />
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={require("@/assets/images/transactions.webp")}
            style={{
              height: verticalScale(249),
              width: scale(273),
              resizeMode: "cover",
              marginBottom: verticalScale(30),
            }}
          />
          <Typo size={15} fontFamily="SemiBold" color={colors.NEUTRAL900}>
            No transactions found
          </Typo>
          <Typo size={13} color={colors.NEUTRAL400}>
            Transaction history is empty!
          </Typo>
        </View>
      )}
    </ScreenWrapper>
  );
};

export default Transaction;

const styles = StyleSheet.create({
  transactionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.NEUTRAL200,
    flexDirection: "row",
    alignItems: "center",
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: "bold",
  },
  image: {
    width: scale(60),
    height: verticalScale(60),
    resizeMode: "cover",
  },
});
