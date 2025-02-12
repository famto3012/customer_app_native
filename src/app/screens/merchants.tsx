import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import Search from "@/components/Search";
import { useLocalSearchParams } from "expo-router";
import { XCircle } from "phosphor-react-native";
import { merchantFilters } from "@/utils/defaultData";
import { scale, verticalScale } from "@/utils/styling";
import { colors, spacingX } from "@/constants/theme";
import Typo from "@/components/Typo";
import MerchantCard from "@/components/universal/MerchantCard";
import { MerchantCardProps } from "@/types";
import { getMerchants } from "@/service/universal";
import { useSafeLocation } from "@/utils/helpers";
import { useQuery } from "@tanstack/react-query";

const Merchants = () => {
  const { businessCategory, businessCategoryId } = useLocalSearchParams();
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  const [merchants, setMerchants] = useState<MerchantCardProps[]>([]);
  const [query, setQuery] = useState<string>("");
  const [debounceQuery, setDebounceQuery] = useState<string>("");

  const { latitude, longitude } = useSafeLocation();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["merchants", businessCategory, selectedFilter, query],
    queryFn: () =>
      getMerchants(
        latitude,
        longitude,
        businessCategoryId.toString(),
        selectedFilter,
        query
      ),
  });

  useEffect(() => {
    setMerchants(data);
  }, [data]);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setQuery(debounceQuery);
    }, 500);

    return () => clearTimeout(timeOut);
  }, [debounceQuery]);

  const handleSelectFilter = (value: string) => {
    if (value === selectedFilter) {
      setSelectedFilter("");
    } else {
      setSelectedFilter(value);
    }
  };

  const renderItem = ({ item }: any) => {
    return (
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
    );
  };

  return (
    <ScreenWrapper>
      <Header title={businessCategory.toString()} />

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
          renderItem={renderItem}
          keyExtractor={(item) => item.value}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <FlatList
        data={merchants}
        renderItem={({ item }) => <MerchantCard item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: scale(20),
          marginTop: verticalScale(15),
          paddingBottom: verticalScale(30),
          backgroundColor: colors.WHITE,
        }}
        showsVerticalScrollIndicator={false}
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
});
