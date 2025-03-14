import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
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
import { AddAddressDetailProps } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addAddressDetail } from "@/service/userService";
import { useNavigation } from "@react-navigation/native";

const AddAddressDetail = ({
  addAddressSheetRef,
  addressData,
}: {
  addAddressSheetRef: any;
  addressData: any;
}) => {
  const [addressDetail, setAddressDetail] = useState<AddAddressDetailProps>([
    {
      type: "",
      fullName: "",
      phoneNumber: "",
      flat: "",
      area: "",
      landmark: "",
      coordinates: [],
    },
  ]);
  const [selected, setSelected] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [dynamicSnapPoints, setDynamicSnapPoints] = useState(["58%"]);

  const queryClient = useQueryClient();
  const navigation = useNavigation();

  useEffect(() => {
    if (addressData) {
      setAddressDetail((prevState) => [
        {
          ...prevState[0], // Ensure we modify the first object in the array
          area: addressData.area,
          coordinates: [addressData.latitude, addressData.longitude],
        },
      ]);
    }
  }, [addressData]);

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
          if (addAddressSheetRef?.current && newSnapPoints.length > 1) {
            addAddressSheetRef.current.snapToIndex(1); // Move up only if valid snap points exist
          }
        }, 100);
      }
    );

    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);

      // Reset snap points when keyboard is hidden
      setDynamicSnapPoints(["38%"]);

      setTimeout(() => {
        if (addAddressSheetRef?.current) {
          addAddressSheetRef.current.snapToIndex(0); // Move down
        }
      }, 100);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleSelectAddress = (type: string) => {
    setSelected(type);
    setAddressDetail((prevState) => [
      {
        ...prevState[0],
        type,
      },
    ]);
  };

  const handleAddAddressMutation = useMutation({
    mutationKey: ["add-address-detail"],
    mutationFn: (data: { addresses: AddAddressDetailProps }) =>
      addAddressDetail(data),
    onSuccess: () => {
      setAddressDetail([
        {
          type: "",
          fullName: "",
          phoneNumber: "",
          flat: "",
          area: "",
          landmark: "",
          coordinates: [],
        },
      ]);
      queryClient.invalidateQueries({ queryKey: ["customer-address"] });
      addAddressSheetRef.current.close();
      navigation.goBack();
    },
  });

  const handleSave = () => {
    if (
      !addressDetail[0].coordinates ||
      addressDetail[0].coordinates.length === 0
    ) {
      Alert.alert("Error", "Please select a location");
      return;
    }
    if (
      !addressDetail[0].fullName ||
      !addressDetail[0].phoneNumber ||
      !addressDetail[0].flat ||
      !addressDetail[0].area
    ) {
      Alert.alert("Error", "Please fill all details");
      return;
    }

    // Ensure it sends as an array
    handleAddAddressMutation.mutate({ addresses: addressDetail });
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
                value={addressDetail[0]?.fullName || ""}
                onChangeText={(text: string) =>
                  setAddressDetail([{ ...addressDetail[0], fullName: text }])
                }
                placeholder="Full Name"
                style={styles.inputStyle}
              />
            </View>
            <View style={styles.data}>
              <Input
                value={addressDetail[0]?.phoneNumber || ""}
                onChangeText={(text: string) =>
                  setAddressDetail([{ ...addressDetail[0], phoneNumber: text }])
                }
                placeholder="Phone Number"
                style={styles.inputStyle}
              />
            </View>
            <View style={styles.data}>
              <Input
                value={addressDetail[0]?.flat || ""}
                onChangeText={(text: string) =>
                  setAddressDetail([{ ...addressDetail[0], flat: text }])
                }
                placeholder="Flat/House no/Floor/Building"
                style={styles.inputStyle}
              />
            </View>
            <View style={styles.data}>
              <Input
                value={addressDetail[0]?.area || ""}
                onChangeText={(text: string) =>
                  setAddressDetail([{ ...addressDetail[0], area: text }])
                }
                placeholder="Area / Sector / Locality"
                style={styles.inputStyle}
              />
            </View>
            <View style={styles.data}>
              <Input
                value={addressDetail[0]?.landmark || ""}
                onChangeText={(text: string) =>
                  setAddressDetail([{ ...addressDetail[0], landmark: text }])
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
