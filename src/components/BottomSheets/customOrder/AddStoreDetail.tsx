import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { BottomSheetScrollView, SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import Typo from "@/components/Typo";
import { colors } from "@/constants/theme";
import Button from "@/components/Button";
import { router } from "expo-router";
import { scale, verticalScale } from "@/utils/styling";
import Input from "@/components/Input";
import { useMutation } from "@tanstack/react-query";
import { addStoreDetail } from "@/service/customOrderService";

const AddStoreDetail = () => {
  const [storeData, setStoreData] = useState<{
    shopName: string;
    latitude: number;
    longitude: number;
    place: string;
    buyFromAnyWhere: boolean;
  }>({
    shopName: "",
    latitude: 0,
    longitude: 0,
    place: "",
    buyFromAnyWhere: false,
  });

  const handleAddStoreMutation = useMutation({
    mutationKey: ["add-store"],
    mutationFn: (storeData: any) => addStoreDetail(storeData),
    onSuccess: () => {
      router.push({
        pathname: "/screens/customOrder/CustomOrderCheckout",
        params: {
          storeName: storeData?.shopName,
          location: storeData?.place,
        },
      });
    },
  });

  return (
    <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerContainer}>
        <Typo size={15} fontFamily="SemiBold" color={colors.PRIMARY}>
          Add Store detail
        </Typo>
      </View>
      <View style={{ marginVertical: verticalScale(15), gap: scale(25) }}>
        <View
          style={{
            // flex: 1,
            flexDirection: "row",
            gap: scale(15),
            alignItems: "center",
          }}
        >
          <Typo size={13} color={colors.NEUTRAL800}>
            Store name
          </Typo>
          <Input
            value={storeData?.shopName}
            onChangeText={(text) =>
              setStoreData({ ...storeData, shopName: text })
            }
          />
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            gap: scale(15),
            alignItems: "center",
          }}
        >
          <Typo
            size={13}
            color={colors.NEUTRAL800}
            style={{ width: SCREEN_WIDTH * 0.2 }}
          >
            Location
          </Typo>
          <Input
            value={storeData?.place}
            onChangeText={(text) => setStoreData({ ...storeData, place: text })}
          />
        </View>
      </View>

      <Button
        title="Save"
        onPress={() => {
          handleAddStoreMutation.mutate(storeData);
        }}
        style={styles.buttonFromMap}
      />
    </BottomSheetScrollView>
  );
};

export default AddStoreDetail;

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
  buttonFromMap: {
    marginTop: scale(20),
    alignSelf: "center",
    width: SCREEN_WIDTH * 0.9,
  },
});
