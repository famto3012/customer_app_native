import { colors, radius } from "@/constants/theme";
import { useShowAlert } from "@/hooks/useShowAlert";
import { getBusinessCategories } from "@/service/universal";
import { useAuthStore } from "@/store/store";
import { BusinessCategoryProps } from "@/types";
import { useSafeLocation } from "@/utils/helpers";
import { scale, SCREEN_WIDTH, verticalScale } from "@/utils/styling";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { FC, useEffect, useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, View } from "react-native";
import BusinessCategoryLoader from "../Loader/BusinessCategoryLoader";
import Typo from "../Typo";

const BusinessCategories: FC<{ query: string }> = ({ query }) => {
  const [businessCategory, setBusinessCategory] = useState<
    BusinessCategoryProps[]
  >([]);
  const [isDataReady, setIsDataReady] = useState(false);

  const { token, setSelectedBusiness, outsideGeofence } =
    useAuthStore.getState();
  const { latitude, longitude } = useSafeLocation();
  const { showAlert } = useShowAlert();

  const { data } = useQuery({
    queryKey: ["business-category", latitude, longitude],
    queryFn: () => getBusinessCategories(latitude, longitude, query),
    enabled: !!latitude && !!longitude && !outsideGeofence,
  });

  useEffect(() => {
    if (data?.outside) {
      if (token) {
        router.push({
          pathname: "/(modals)/SelectAddress",
          params: {
            showActionButton: "false",
            setAsUserAddress: "true",
            mustSelectAddress: "true",
          },
        });
      } else {
        showAlert("Currently we don't deliver in this area", "Not deliverable");
      }
    } else {
      setBusinessCategory(data?.data as BusinessCategoryProps[]);
      setIsDataReady(true);
    }
  }, [data]);

  const renderItem = ({ item }: { item: BusinessCategoryProps }) => (
    <Pressable
      onPress={() => {
        setSelectedBusiness(item.id);
        router.push({
          pathname: "/screens/merchants",
          params: { businessCategory: item.title, businessCategoryId: item.id },
        });
      }}
      style={styles.itemContainer}
    >
      <Image
        source={{ uri: item.bannerImageURL }}
        style={styles.image}
        resizeMode="cover"
      />
      <Typo
        size={12}
        fontFamily="Medium"
        color={colors.NEUTRAL800}
        textProps={{ numberOfLines: 1 }}
      >
        {item.title}
      </Typo>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Typo size={15} fontFamily="SemiBold" color={colors.NEUTRAL900}>
        Categories
      </Typo>

      <FlatList
        data={businessCategory}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: verticalScale(15) }}>
            {!isDataReady ? (
              <BusinessCategoryLoader />
            ) : isDataReady && businessCategory?.length === 0 ? (
              <Typo size={14} color={colors.NEUTRAL900} fontFamily="Medium">
                Currently we don't deliver in this area!
              </Typo>
            ) : (
              <BusinessCategoryLoader />
            )}
          </View>
        }
        numColumns={3}
      />
    </View>
  );
};

export default BusinessCategories;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(20),
    marginTop: verticalScale(24),
  },
  itemContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.NEUTRAL100,
    paddingVertical: scale(10),
    borderRadius: radius._10,
    marginBottom: scale(15),
    marginEnd: scale(6),
    maxWidth: SCREEN_WIDTH / 3 - scale(15),
  },
  listContainer: {
    paddingBottom: verticalScale(10),
    marginTop: verticalScale(10),
  },
  image: {
    width: scale(65),
    height: scale(65),
    borderRadius: radius._15,
  },
});
