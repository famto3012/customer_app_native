import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { scale, SCREEN_WIDTH, verticalScale } from "@/utils/styling";
import { colors, spacingY } from "@/constants/theme";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Typo from "@/components/Typo";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { UserAddressProps } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addAddressDetail } from "@/service/userService";
import { router } from "expo-router";
import { useAuthStore } from "@/store/store";

const AddAddressDetail = ({
  addAddressSheetRef,
  addressData,
}: {
  addAddressSheetRef: any;
  addressData: any;
}) => {
  const [addressDetail, setAddressDetail] = useState<UserAddressProps>({
    type: "",
    fullName: "",
    phoneNumber: "",
    flat: "",
    area: "",
    landmark: "",
    coordinates: [],
  });
  const [selected, setSelected] = useState("");

  const queryClient = useQueryClient();

  useEffect(() => {
    if (addressData) {
      setAddressDetail({
        ...addressDetail,
        area: addressData.area,
        coordinates: [addressData.latitude, addressData.longitude],
      });
    }
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
        addAddressSheetRef.current.close();
        router.back();
      }
    },
  });

  const handleSave = () => {
    if (addressDetail?.coordinates?.length !== 2) {
      if (Platform.OS === "android") {
        ToastAndroid.showWithGravity(
          "Please select a location",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
      } else {
        Alert.alert("Error", "Please select a location");
      }

      return;
    }
    if (
      !addressDetail.fullName ||
      !addressDetail.phoneNumber ||
      !addressDetail.flat ||
      !addressDetail.area ||
      !addressDetail.type
    ) {
      if (Platform.OS === "android") {
        ToastAndroid.showWithGravity(
          "Please fill all details",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
      } else {
        Alert.alert("Error", "Please fill all details");
      }

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

export default AddAddressDetail;

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
