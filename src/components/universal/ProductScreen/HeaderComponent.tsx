import Header from "@/components/Header";
import SearchView from "@/components/SearchView";
import Typo from "@/components/Typo";
import { colors, radius, spacingX } from "@/constants/theme";
import { useData } from "@/context/DataContext";
import {
  getFiltersFromBusinessCategory,
  getMerchantAvailability,
} from "@/service/universal";
import { useAuthStore } from "@/store/store";
import { MerchantDataProps } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { WarningCircle, XCircle } from "phosphor-react-native";
import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import MerchantBanner from "../MerchantBanner";
import MerchantData from "../MerchantData";

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
  const [filteredProductFilters, setFilteredProductFilters] = useState<
    { label: string; value: string }[]
  >([]);

  const { productFilter, setProductFilter } = useData();
  const { selectedBusiness } = useAuthStore.getState();

  const showClosingSoonModalRef = useRef(false);
  const [showClosingSoonModal, setShowClosingSoonModal] = useState(false);
  const countdownTimeRef = useRef(600); // in seconds
  const [countdownTime, setCountdownTime] = useState(600);

  // CHANGE: Added animation value for countdown
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const { data: merchantAvailabilityData } = useQuery<MerchantDataProps>({
    queryKey: ["merchant-availability", merchantId],
    queryFn: () => getMerchantAvailability(merchantId as string),
  });

  const getCurrentTimeInIST = () => {
    const now = new Date();
    // IST is UTC+5:30
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    return new Date(utc + 5.5 * 60 * 60 * 1000);
  };

  const { data: productFilters } = useQuery<string[]>({
    queryKey: ["product-filter", selectedBusiness],
    queryFn: () =>
      getFiltersFromBusinessCategory(
        selectedBusiness as string,
        "productFilters"
      ),
  });

  useEffect(() => {
    if (productFilters && productFilters.length > 0) {
      setFilteredProductFilters(
        productFilters.map((filter) => ({
          label: filter.charAt(0).toUpperCase() + filter.slice(1),
          value: filter,
        }))
      );
    } else {
      setFilteredProductFilters([]);
    }
  }, [productFilters]);

  useEffect(() => {
    if (
      !merchantAvailabilityData?.todayAvailability ||
      merchantAvailabilityData?.type !== "Specific-time"
    ) {
      return;
    }

    const interval = setInterval(() => {
      const nowIST = getCurrentTimeInIST();

      const [endHour, endMin] =
        merchantAvailabilityData.todayAvailability.endTime
          .split(":")
          .map(Number);

      const endTimeIST = new Date(nowIST);
      endTimeIST.setHours(endHour, endMin, 0, 0);

      const diffMs = endTimeIST.getTime() - nowIST.getTime();
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffSeconds = Math.floor(diffMs / 1000);

      if (diffMinutes <= 10 && diffMinutes > 0) {
        countdownTimeRef.current = diffSeconds;

        // Only update the state if the visibility is changing
        if (!showClosingSoonModalRef.current) {
          showClosingSoonModalRef.current = true;
          setShowClosingSoonModal(true);
          setCountdownTime(diffSeconds);
        } else {
          // Update only every minute to prevent frequent rerenders
          if (diffSeconds % 60 === 0) {
            setCountdownTime(diffSeconds);
          }
        }
      } else {
        if (showClosingSoonModalRef.current) {
          showClosingSoonModalRef.current = false;
          setShowClosingSoonModal(false);
        }
      }
    }, 1000); // Check every minute

    return () => clearInterval(interval);
  }, [merchantAvailabilityData]);

  // CHANGE: Separate effect for countdown that doesn't cause main component to re-render
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (showClosingSoonModal && countdownTimeRef.current > 0) {
      // Update the countdown display without causing full component re-renders
      const updateCountdown = () => {
        if (countdownTimeRef.current <= 1) {
          clearInterval(timer);
          showClosingSoonModalRef.current = false;
          setShowClosingSoonModal(false);
          countdownTimeRef.current = 0;
        } else {
          countdownTimeRef.current -= 1;

          // Only update the visible state every 5 seconds to reduce re-renders
          // if (countdownTimeRef.current % 5 === 0) {
          setCountdownTime(countdownTimeRef.current);
          // }
        }
      };

      timer = setInterval(updateCountdown, 1000);

      return () => clearInterval(timer);
    }
  }, [showClosingSoonModal]);

  const renderItem = ({ item }: { item: { label: string; value: string } }) => {
    const isSelected = productFilter === item.value;

    return (
      <Pressable
        style={[styles.filterItem, isSelected && styles.selectedFilter]}
        onPress={() => setProductFilter(item.value)}
      >
        <Typo size={13} color={isSelected ? colors.WHITE : colors.NEUTRAL900}>
          {item.label}
        </Typo>

        {isSelected && (
          <Pressable onPress={() => setProductFilter("All")}>
            <XCircle size={20} color="white" />
          </Pressable>
        )}
      </Pressable>
    );
  };

  // const CountdownTimer = useMemo(() => {
  //   if (!showClosingSoonModal) return null;

  //   const minutes = Math.floor(countdownTime / 60);
  //   const seconds = countdownTime % 60;

  //   return (
  //     <Animated.View
  //       style={{
  //         padding: scale(3),
  //         borderRadius: 10,
  //         alignItems: "center",
  //         width: SCREEN_WIDTH * 0.35,
  //         backgroundColor: "rgba(0, 0, 0, 0.43)",
  //         height: SCREEN_WIDTH * 0.1,
  //         marginBottom: scale(-14),
  //         opacity: fadeAnim,
  //         position: "absolute",
  //         bottom: 0,
  //         alignSelf: "center",
  //         zIndex: 1000,
  //       }}
  //     >
  //       <Typo size={12} color={colors.WHITE} fontFamily="SemiBold">
  //         <WarningCircle size={26} weight="fill" color={colors.PRIMARY} /> Shop
  //         closes in
  //       </Typo>
  //       <Typo size={12} color={colors.WHITE} fontFamily="SemiBold">
  //         {minutes}m {seconds}s
  //       </Typo>
  //     </Animated.View>
  //   );
  // }, [showClosingSoonModal, countdownTime, fadeAnim]);

  const CountdownTimer = useMemo(() => {
    if (!showClosingSoonModal) return null;

    const minutes = Math.floor(countdownTime / 60);
    const seconds = countdownTime % 60;

    return (
      <Animated.View
        style={{
          flexDirection: "row", // row for icon + text
          alignItems: "center",
          justifyContent: "center",
          padding: scale(8),
          borderRadius: 10,
          width: SCREEN_WIDTH * 0.35,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          position: "absolute",
          bottom: -10,
          alignSelf: "center",
          zIndex: 1000,
          opacity: fadeAnim,
        }}
      >
        <WarningCircle
          size={22}
          weight="fill"
          color={colors.PRIMARY}
          style={{ marginRight: scale(8) }}
        />
        <View>
          <Typo size={12} color={colors.WHITE} fontFamily="SemiBold">
            Shop closes in
          </Typo>
          <Typo size={12} color={colors.WHITE} fontFamily="SemiBold" style={{marginLeft: scale(17)}}>
            {minutes}m {seconds}s
          </Typo>
        </View>
      </Animated.View>
    );
  }, [showClosingSoonModal, countdownTime, fadeAnim]);

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

      <View style={{ paddingHorizontal: scale(20), marginBottom: showClosingSoonModal? scale(30): 0 }}>
        <SearchView
          placeholder="Search Dishes / Products"
          onPress={() => router.push("/screens/universal/product-search")}
        />

        <FlatList
          data={filteredProductFilters}
          renderItem={renderItem}
          keyExtractor={(item) => item.value}
          horizontal
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ marginVertical: verticalScale(15) }}
        />
      </View>
      {CountdownTimer}
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
    paddingTop: Platform.OS === "ios" ? scale(20) : scale(20),
    borderBottomLeftRadius: radius._30,
    borderBottomRightRadius: radius._30,
    paddingBottom: verticalScale(20),
  },
  selectedFilter: {
    backgroundColor: colors.PRIMARY,
  },
});
