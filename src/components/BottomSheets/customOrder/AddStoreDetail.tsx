import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useState, useEffect } from "react";
import { BottomSheetScrollView, SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import Typo from "@/components/Typo";
import { colors, spacingY } from "@/constants/theme";
import Button from "@/components/Button";
import { router } from "expo-router";
import { scale, verticalScale } from "@/utils/styling";
import Input from "@/components/Input";
import { useMutation } from "@tanstack/react-query";
import { addStoreDetail } from "@/service/customOrderService";
import { AddCustomStoreProps, AddStoreResponse } from "@/types";
import { useShowAlert } from "@/hooks/useShowAlert";

const AddStoreDetail = ({
  shopData,
}: {
  addStoreSheetRef: any;
  shopData: any;
}) => {
  const [storeData, setStoreData] = useState<AddCustomStoreProps>({
    latitude: shopData?.latitude || null,
    longitude: shopData?.longitude || null,
    shopName: shopData?.shopName.split(",")[0] || "",
    place: shopData?.place || "",
    buyFromAnyWhere: false,
  });

  const { showAlert } = useShowAlert();

  useEffect(() => {
    if (shopData) {
      setStoreData((prevState) => ({
        ...prevState,
        latitude: shopData.latitude,
        longitude: shopData.longitude,
        shopName: shopData.shopName.split(",")[0],
        place: shopData.place,
      }));
    }
  }, [shopData]);

  const handleAddStoreMutation = useMutation<
    AddStoreResponse | null,
    Error,
    void
  >({
    mutationKey: ["add-store"],
    mutationFn: () => addStoreDetail(storeData),
    onSuccess: (data) => {
      if (data?.shopName && data.cartId) {
        router.push({
          pathname: "/screens/customOrder/CustomOrderCheckout",
          params: {
            cartId: data.cartId,
            storeName: data.shopName,
            location: data.place,
          },
        });
      }
    },
  });

  const handleSave = () => {
    if (!storeData.latitude || !storeData.longitude) {
      showAlert("Please select a location");
      return;
    }

    if (!storeData.shopName || !storeData.place) {
      showAlert("Please fill all details");
      return;
    }

    handleAddStoreMutation.mutate();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <BottomSheetScrollView
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Typo
            size={15}
            fontFamily="SemiBold"
            color={colors.PRIMARY}
            style={{
              paddingBottom: verticalScale(10),
              borderBottomWidth: 1,
              borderBottomColor: colors.NEUTRAL350,
            }}
          >
            Add Store Detail
          </Typo>

          <View style={styles.dataContainer}>
            <View style={styles.data}>
              <Typo
                size={13}
                color={colors.NEUTRAL800}
                style={styles.labelStyle}
              >
                Store name
              </Typo>
              <Input
                value={storeData?.shopName}
                onChangeText={(text) =>
                  setStoreData({ ...storeData, shopName: text })
                }
                style={styles.inputStyle}
              />
            </View>

            <View style={styles.data}>
              <Typo
                size={13}
                color={colors.NEUTRAL800}
                style={styles.labelStyle}
              >
                Location
              </Typo>
              <Input
                value={storeData?.place}
                onChangeText={(text) =>
                  setStoreData({ ...storeData, place: text })
                }
                style={styles.inputStyle}
              />
            </View>
          </View>

          <Button
            title="Save"
            onPress={handleSave}
            isLoading={handleAddStoreMutation.isPending}
            style={styles.buttonFromMap}
          />
        </BottomSheetScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default AddStoreDetail;

const styles = StyleSheet.create({
  contentContainer: {
    padding: scale(20),
    flexGrow: 1,
  },
  dataContainer: {
    marginVertical: verticalScale(15),
    gap: spacingY._20,
  },
  data: {
    flexDirection: "row",
    alignItems: "center",
  },
  labelStyle: {
    width: scale(100),
  },
  inputStyle: {
    flex: 1,
  },
  buttonFromMap: {
    marginTop: scale(10),
    alignSelf: "center",
    width: SCREEN_WIDTH * 0.9,
  },
});
