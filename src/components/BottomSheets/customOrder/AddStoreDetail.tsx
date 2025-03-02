import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  Alert,
} from "react-native";
import { useState, useEffect, useMemo } from "react";
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

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const AddStoreDetail = ({ addStoreSheetRef }: { addStoreSheetRef: any }) => {
  const [storeData, setStoreData] = useState<AddCustomStoreProps>({
    latitude: null,
    longitude: null,
    shopName: "",
    place: "",
    buyFromAnyWhere: false,
  });

  useEffect(() => {
    setStoreData({ ...storeData, latitude: 8.565349, longitude: 76.876014 });
  }, []);

  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [dynamicSnapPoints, setDynamicSnapPoints] = useState(["38%"]); // Default snap points

  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      "keyboardDidShow",
      (event) => {
        const height = event.endCoordinates.height;
        setKeyboardHeight(height);

        // Set new snap points when keyboard appears
        const newSnapPoints = ["38%", `${SCREEN_HEIGHT - height - 40}px`];
        setDynamicSnapPoints(newSnapPoints);

        setTimeout(() => {
          if (addStoreSheetRef?.current && newSnapPoints.length > 1) {
            addStoreSheetRef.current.snapToIndex(1); // Move up only if valid snap points exist
          }
        }, 100);
      }
    );

    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);

      // Reset snap points when keyboard is hidden
      setDynamicSnapPoints(["38%"]);

      setTimeout(() => {
        if (addStoreSheetRef?.current) {
          addStoreSheetRef.current.snapToIndex(0); // Move down
        }
      }, 100);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleAddStoreMutation = useMutation<
    AddStoreResponse | null,
    Error,
    void
  >({
    mutationKey: ["add-store"],
    mutationFn: () => addStoreDetail(storeData),
    onSuccess: (data) => {
      if (data?.shopName) {
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
      Alert.alert("Error", "Please select a location");
      return;
    }
    if (!storeData.shopName || !storeData.place) {
      Alert.alert("Error", "Please fill all details");
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
