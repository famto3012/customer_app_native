import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { BottomSheetScrollView, SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import Typo from "@/components/Typo";
import { colors } from "@/constants/theme";
import Button from "@/components/Button";
import { scale } from "@/utils/styling";
import { router } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { addStoreDetail } from "@/service/customOrderService";

const CustomOrderLocationBottomSheet = () => {
  const [storeData, setStoreData] = useState<{
    buyFromAnyWhere: boolean;
  }>({
    buyFromAnyWhere: true,
  });

  const handleAddStoreMutation = useMutation({
    mutationKey: ["add-store"],
    mutationFn: (storeData: any) => addStoreDetail(storeData),
    onSuccess: () => {
      router.push({
        pathname: "/screens/customOrder/CustomOrderCheckout",
        params: {
          storeName: "Buy from any store",
        },
      });
    },
  });

  return (
    <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerContainer}>
        <Typo size={15} fontFamily="SemiBold" color={colors.NEUTRAL900}>
          Custom Order
        </Typo>
      </View>

      <Typo size={13} color={colors.NEUTRAL400} style={styles.text}>
        Where do you need the product from?
      </Typo>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Button
          title="Any Store"
          onPress={() => {
            // setStoreData({ ...storeData, buyFromAnyWhere: true });
            handleAddStoreMutation.mutate(storeData);
          }}
          style={styles.buttonAnyStore}
        />
        <Button
          title="Select from map"
          onPress={() => {
            router.push({
              pathname: "/screens/customOrder/CustomOrderMap",
            });
          }}
          style={styles.buttonFromMap}
        />
      </View>
    </BottomSheetScrollView>
  );
};

export default CustomOrderLocationBottomSheet;

const styles = StyleSheet.create({
  contentContainer: {
    padding: scale(20),
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: scale(5),
  },
  text: {
    lineHeight: 28,
  },
  buttonAnyStore: {
    marginTop: scale(20),
    alignSelf: "center",
    width: SCREEN_WIDTH * 0.4,
    backgroundColor: colors.PRIMARY_LIGHT,
    color: colors.PRIMARY,
  },
  buttonFromMap: {
    marginTop: scale(20),
    alignSelf: "center",
    width: SCREEN_WIDTH * 0.4,
  },
});
