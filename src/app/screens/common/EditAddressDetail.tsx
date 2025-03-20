import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { scale, verticalScale } from "@/utils/styling";
import { colors, spacingY } from "@/constants/theme";
import {
  BottomSheetScrollView,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from "@gorhom/bottom-sheet";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Typo from "@/components/Typo";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { UserAddressProps } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addAddressDetail } from "@/service/userService";
import { router } from "expo-router";
import { useAuthStore } from "@/store/store";

const EditAddressDetail = ({
  editAddressSheetRef,
  addressData,
}: {
  editAddressSheetRef: any;
  addressData: any;
}) => {
  const [addressDetail, setAddressDetail] = useState<UserAddressProps>({
    id: "",
    type: "",
    fullName: "",
    phoneNumber: "",
    flat: "",
    area: "",
    landmark: "",
    coordinates: [],
  });
  const [selected, setSelected] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [dynamicSnapPoints, setDynamicSnapPoints] = useState(["58%"]);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (addressData) {
      console.log("Address data: ", addressData);
      setSelected(addressData.type);
      setAddressDetail({
        ...addressDetail,
        area: addressData.area,
        flat: addressData.flat,
        fullName: addressData.fullName,
        id: addressData.id,
        landmark: addressData.landmark,
        phoneNumber: addressData.phoneNumber,
        type: addressData.type,
        coordinates: addressData.coordinates,
      });
    }
  }, [addressData]);

  // useEffect(() => {
  //   const showSubscription = Keyboard.addListener(
  //     "keyboardDidShow",
  //     (event) => {
  //       const height = event.endCoordinates.height;
  //       setKeyboardHeight(height);

  //       // Set new snap points when keyboard appears
  //       const newSnapPoints = ["38%", `${SCREEN_HEIGHT - height - 40}px`];
  //       setDynamicSnapPoints(newSnapPoints);

  //       setTimeout(() => {
  //         if (addAddressSheetRef?.current && newSnapPoints.length > 1) {
  //           console.log(
  //             "Bottom sheet opened with snap points:",
  //             dynamicSnapPoints
  //           );

  //           addAddressSheetRef.current.snapToIndex(1);
  //         }
  //       }, 100);
  //     }
  //   );

  //   const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
  //     setKeyboardHeight(0);

  //     // Reset snap points when keyboard is hidden
  //     setDynamicSnapPoints(["38%"]);

  //     setTimeout(() => {
  //       if (addAddressSheetRef?.current) {
  //         addAddressSheetRef.current.snapToIndex(0); // Move down
  //       }
  //     }, 100);
  //   });

  //   return () => {
  //     showSubscription.remove();
  //     hideSubscription.remove();
  //   };
  // }, []);

  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      "keyboardDidShow",
      (event) => {
        const height = event.endCoordinates.height;
        setKeyboardHeight(height);

        // Ensure snap points only update if it's a real keyboard interaction
        if (!addressData) {
          const newSnapPoints = ["58%", `${SCREEN_HEIGHT - height - 40}px`];
          setDynamicSnapPoints(newSnapPoints);

          setTimeout(() => {
            if (editAddressSheetRef?.current && newSnapPoints.length > 1) {
              editAddressSheetRef.current.snapToIndex(1);
            }
          }, 100);
        }
      }
    );

    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);

      // Reset snap points only if the keyboard was actually open before
      if (!addressData) {
        setDynamicSnapPoints(["58%"]);

        setTimeout(() => {
          if (editAddressSheetRef?.current) {
            editAddressSheetRef.current.snapToIndex(0);
          }
        }, 100);
      }
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [addressData]);

  const handleSelectAddress = (type: string) => {
    setSelected(type);
    setAddressDetail({
      ...addressDetail,
      type,
    });
  };

  const handleAddAddressMutation = useMutation({
    mutationKey: ["add-address-detail"],
    mutationFn: (data: UserAddressProps) => addAddressDetail(data),
    onSuccess: (data) => {
      if (data.success) {
        const address = `${data.address?.flat}, ${data.address?.area}, ${data.address?.landmark}`;
        useAuthStore.setState({
          userAddress: {
            type: data.address?.type as string,
            otherId: data.address?.id as string,
            address,
          },
        });
        setAddressDetail({
          type: "",
          fullName: "",
          phoneNumber: "",
          flat: "",
          area: "",
          landmark: "",
          coordinates: [],
        });
        queryClient.invalidateQueries({ queryKey: ["customer-address"] });
        editAddressSheetRef.current.close();
        router.back();
      }
    },
  });

  const handleSave = () => {
    if (addressDetail?.coordinates?.length !== 2) {
      Alert.alert("Error", "Please select a location");
      return;
    }
    if (
      !addressDetail.fullName ||
      !addressDetail.phoneNumber ||
      !addressDetail.flat ||
      !addressDetail.area ||
      !addressDetail.type
    ) {
      Alert.alert("Error", "Please fill all details");
      return;
    }

    // Ensure it sends as an array
    handleAddAddressMutation.mutate(addressDetail);
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
            Enter complete address
          </Typo>

          <View style={styles.dataContainer}>
            <View style={styles.tabOptionContainer}>
              <TouchableOpacity
                onPress={() => handleSelectAddress("home")}
                style={[
                  styles.tabOption,
                  {
                    backgroundColor:
                      selected === "home" ? colors.PRIMARY : colors.NEUTRAL200,
                  },
                ]}
              >
                <Typo
                  size={13}
                  fontFamily="Medium"
                  color={selected === "home" ? colors.WHITE : colors.NEUTRAL600}
                >
                  Home
                </Typo>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleSelectAddress("work")}
                style={[
                  styles.tabOption,
                  {
                    backgroundColor:
                      selected === "work" ? colors.PRIMARY : colors.NEUTRAL200,
                  },
                ]}
              >
                <Typo
                  size={13}
                  fontFamily="Medium"
                  color={selected === "work" ? colors.WHITE : colors.NEUTRAL600}
                >
                  Work
                </Typo>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleSelectAddress("other")}
                style={[
                  styles.tabOption,
                  {
                    backgroundColor:
                      selected === "other" ? colors.PRIMARY : colors.NEUTRAL200,
                  },
                ]}
              >
                <Typo
                  size={13}
                  fontFamily="Medium"
                  color={
                    selected === "other" ? colors.WHITE : colors.NEUTRAL600
                  }
                >
                  Others
                </Typo>
              </TouchableOpacity>
            </View>
            <View style={styles.data}>
              <Input
                value={addressDetail?.fullName || ""}
                onChangeText={(text: string) =>
                  setAddressDetail({ ...addressDetail, fullName: text })
                }
                placeholder="Full Name"
                style={styles.inputStyle}
              />
            </View>
            <View style={styles.data}>
              <Input
                value={addressDetail?.phoneNumber || ""}
                onChangeText={(text: string) =>
                  setAddressDetail({ ...addressDetail, phoneNumber: text })
                }
                placeholder="Phone Number"
                style={styles.inputStyle}
              />
            </View>
            <View style={styles.data}>
              <Input
                value={addressDetail?.flat || ""}
                onChangeText={(text: string) =>
                  setAddressDetail({ ...addressDetail, flat: text })
                }
                placeholder="Flat/House no/Floor/Building"
                style={styles.inputStyle}
              />
            </View>
            <View style={styles.data}>
              <Input
                value={addressDetail?.area || ""}
                onChangeText={(text: string) =>
                  setAddressDetail({ ...addressDetail, area: text })
                }
                placeholder="Area / Sector / Locality"
                style={styles.inputStyle}
              />
            </View>
            <View style={styles.data}>
              <Input
                value={addressDetail?.landmark || ""}
                onChangeText={(text: string) =>
                  setAddressDetail({ ...addressDetail, landmark: text })
                }
                placeholder="Nearby landmark (optional)"
                style={styles.inputStyle}
              />
            </View>
          </View>

          <Button
            title="Save"
            onPress={handleSave}
            isLoading={handleAddAddressMutation.isPending}
            style={styles.buttonFromMap}
          />
        </BottomSheetScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default EditAddressDetail;

const styles = StyleSheet.create({
  contentContainer: {
    padding: scale(20),
    flexGrow: 1,
  },
  dataContainer: {
    marginVertical: verticalScale(15),
    gap: spacingY._15,
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
  tabOptionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 10,
  },
  tabOption: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    height: 40,
  },
});
