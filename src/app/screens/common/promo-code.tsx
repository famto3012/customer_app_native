import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import Search from "@/components/Search";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { applyPromo, getAvailablePromoCodes } from "@/service/userService";
import Typo from "@/components/Typo";
import { scale, verticalScale } from "@/utils/styling";
import { colors, radius, spacingY } from "@/constants/theme";
import { useAuthStore } from "@/store/store";
import { useEffect, useMemo, useRef, useState } from "react";
import { Grayscale } from "react-native-color-matrix-image-filters";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import PromoDetail from "@/components/BottomSheets/common/PromoDetail";
import { PromoCodeProps } from "@/types";

const PromoCodeList = () => {
  const {
    deliveryMode,
    merchantId,
    orderAmount,
    cartId,
  }: {
    deliveryMode: string;
    merchantId: string;
    orderAmount: string;
    cartId: string;
  } = useLocalSearchParams();
  const [query, setQuery] = useState<string>("");
  const [debounceQuery, setDebounceQuery] = useState<string>("");
  const [selectedPromoCode, setSelectedPromoCode] =
    useState<PromoCodeProps | null>(null);

  const detailSheetRef = useRef<BottomSheet>(null);

  const detailSheetSnapPoints = useMemo(() => ["40%"], []);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<PromoCodeProps[]>({
    queryKey: ["promo-code", deliveryMode, merchantId, query],
    queryFn: () =>
      getAvailablePromoCodes(
        deliveryMode.toString(),
        merchantId?.toString() || "",
        query
      ),
  });

  useEffect(() => {
    setTimeout(() => {
      setQuery(debounceQuery);
    }, 500);
  }, [debounceQuery]);

  const applyPromoMutation = useMutation({
    mutationKey: ["apply-promo-code"],
    mutationFn: ({
      cartId,
      promoCode,
      deliveryMode,
    }: {
      cartId: string;
      promoCode: string;
      deliveryMode: string;
    }) => applyPromo(cartId, promoCode, deliveryMode),
    onSuccess: ({ success }, variables) => {
      if (success) {
        queryClient.clear();

        useAuthStore.setState({
          promoCode: {
            ...useAuthStore.getState().promoCode,
            universal: ["Take Away", "Home Delivery"].includes(
              variables.deliveryMode
            )
              ? variables.promoCode
              : null,
            customOrder:
              variables.deliveryMode === "Custom Order"
                ? variables.promoCode
                : null,
            pickAndDrop:
              variables.deliveryMode === "Pick and Drop"
                ? variables.promoCode
                : null,
          },
        });

        router.back();
      }
    },
  });

  const handleApplyPromoCode = (item: PromoCodeProps) => {
    applyPromoMutation.mutate({
      cartId: cartId,
      promoCode: item.promoCode,
      deliveryMode: deliveryMode,
    });
  };

  const renderItem = ({ item }: { item: PromoCodeProps }) => {
    return (
      <Pressable
        onPress={() => {
          setSelectedPromoCode(item);
          detailSheetRef.current?.expand();
        }}
        style={styles.container}
      >
        {!item.status || Number(orderAmount) < item.minOrderAmount ? (
          <Grayscale>
            <Image source={{ uri: item.imageURL }} style={styles.image} />
          </Grayscale>
        ) : (
          <Image source={{ uri: item.imageURL }} style={styles.image} />
        )}

        <View style={styles.border}></View>

        <View style={{ flex: 1, marginLeft: scale(15), gap: spacingY._5 }}>
          <Typo size={16} color={colors.NEUTRAL900} fontFamily="Medium">
            {item.promoCode}
          </Typo>
          <Typo size={11} color={colors.NEUTRAL400}>
            Valid upto {item.validUpTo}
          </Typo>
        </View>

        <Pressable
          onPress={() => handleApplyPromoCode(item)}
          style={styles.actionContainer}
        >
          <Image
            source={require("@/assets/icons/direct-inbox.webp")}
            style={styles.actionImage}
          />
        </Pressable>
      </Pressable>
    );
  };

  return (
    <>
      <ScreenWrapper>
        <Header title="Apply promo code" />

        <Search
          placeHolder="Search promo code"
          onChangeText={(data) => setDebounceQuery(data)}
          capitalize
        />

        <FlatList
          data={data || []}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ marginVertical: verticalScale(25) }}
          ListEmptyComponent={
            isLoading ? (
              <ActivityIndicator size="large" color={colors.PRIMARY} />
            ) : !data || data.length === 0 ? (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typo>No promo codes available</Typo>
              </View>
            ) : null
          }
        />
      </ScreenWrapper>

      <BottomSheet
        ref={detailSheetRef}
        index={-1}
        snapPoints={detailSheetSnapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            opacity={0.6}
          />
        )}
        onClose={() => setSelectedPromoCode(null)}
      >
        <PromoDetail data={selectedPromoCode!} />
      </BottomSheet>
    </>
  );
};

export default PromoCodeList;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: scale(20),
    marginBottom: verticalScale(20),
    backgroundColor: colors.WHITE,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: radius._10,
    height: verticalScale(120),
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: scale(40),
    height: verticalScale(40),
    resizeMode: "cover",
    marginHorizontal: scale(20),
  },
  border: {
    height: "70%",
    borderWidth: 0.6,
    borderStyle: "dashed",
    borderColor: colors.NEUTRAL300,
    position: "relative",
  },
  actionContainer: {
    backgroundColor: colors.NEUTRAL200,
    height: "100%",
    paddingHorizontal: scale(15),
    alignItems: "center",
    justifyContent: "center",
    borderTopEndRadius: radius._10,
    borderBottomEndRadius: radius._10,
  },
  actionImage: {
    width: scale(20),
    height: verticalScale(20),
    resizeMode: "cover",
  },
});
