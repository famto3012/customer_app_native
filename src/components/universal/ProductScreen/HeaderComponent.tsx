import {
  Dimensions,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import React, { FC, useEffect, useState } from "react";
import { router } from "expo-router";
import { scale, verticalScale } from "@/utils/styling";
import { MerchantDataProps } from "@/types";
import { colors, radius, spacingX } from "@/constants/theme";
import { XCircle } from "phosphor-react-native";
import { productFilters } from "@/utils/defaultData";
import Header from "@/components/Header";
import MerchantData from "../MerchantData";
import MerchantBanner from "../MerchantBanner";
import SearchView from "@/components/SearchView";
import Typo from "@/components/Typo";
import { useData } from "@/context/DataContext";

const { height } = Dimensions.get("window");

interface ListHeaderProps {
  merchantData: MerchantDataProps | null;
  openRating: () => void;
  merchantId: string;
  merchantDataLoading: boolean;
}

const HeaderComponent: FC<ListHeaderProps> = ({
  merchantData,
  openRating,
  merchantId,
  merchantDataLoading,
}) => {
  const { productFilter, setProductFilter } = useData();

  const renderItem = ({ item }: any) => {
    const isSelected = productFilter === item.value;

    return (
      <Pressable
        style={[styles.filterItem, isSelected && styles.selectedFilter]}
        onPress={() => setProductFilter(item.value)} // Directly update context state
      >
        <Typo size={13} color={isSelected ? colors.WHITE : colors.NEUTRAL900}>
          {item.label}
        </Typo>

        {isSelected && <XCircle size={20} color="white" />}
      </Pressable>
    );
  };

  return (
    <>
      <View style={styles.merchantOuter}>
        <Header title="Products" />

        <MerchantData
          merchantDataLoading={merchantDataLoading}
          merchantData={merchantData}
          openRating={openRating}
        />
      </View>

      <MerchantBanner merchantId={merchantId} />

      <View style={{ paddingHorizontal: scale(20) }}>
        <SearchView
          placeholder="Search Dishes / Products"
          onPress={() => router.push("/screens/universal/product-search")}
        />

        {/* <FlatList
          data={productFilters}
          renderItem={renderItem}
          keyExtractor={(item) => item.value}
          horizontal
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ marginVertical: verticalScale(15) }}
        /> */}
      </View>
    </>
  );
};

export default HeaderComponent;

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
  merchantOuter: {
    backgroundColor: colors.NEUTRAL200,
    paddingTop: Platform.OS === "ios" ? height * scale(0.06) : scale(20),
    borderBottomLeftRadius: radius._30,
    borderBottomRightRadius: radius._30,
    paddingBottom: verticalScale(20),
  },
  selectedFilter: {
    backgroundColor: colors.PRIMARY,
  },
});
