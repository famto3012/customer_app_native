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
import { RefObject, useEffect, useState } from "react";
import { scale, verticalScale } from "@/utils/styling";
import { colors, spacingY } from "@/constants/theme";
import { BottomSheetScrollView, SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Typo from "@/components/Typo";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { UserAddressProps } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addAddressDetail } from "@/service/userService";
import { router } from "expo-router";
import { useAuthStore } from "@/store/store";
import { commonStyles } from "@/constants/commonStyles";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";

const EditAddressDetail = ({
  editAddressSheetRef,
  addressData,
}: {
  editAddressSheetRef: RefObject<BottomSheetMethods>;
  addressData: UserAddressProps;
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

  const queryClient = useQueryClient();

  useEffect(() => {
    if (addressData) {
      setAddressDetail({
        ...addressDetail,
        ...addressData,
      });
    }
  }, [addressData]);

  const handleSelectAddress = (type: string) => {
    setAddressDetail((prev) => ({ ...prev, type }));
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
        queryClient.invalidateQueries({ queryKey: ["customer-address"] });
        editAddressSheetRef?.current?.close();
        if (router.canGoBack()) {
          router.back();
        }
      }
    },
  });

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
            style={styles.headerText}
          >
            Enter complete address
          </Typo>

          <View style={styles.dataContainer}>
            <View style={styles.tabOptionContainer}>
              {["home", "work", "other"].map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => handleSelectAddress(type)}
                  style={[
                    styles.tabOption,
                    {
                      backgroundColor:
                        addressDetail.type === type
                          ? colors.PRIMARY
                          : colors.NEUTRAL200,
                    },
                  ]}
                >
                  <Typo
                    size={13}
                    fontFamily="Medium"
                    color={
                      addressDetail.type === type
                        ? colors.WHITE
                        : colors.NEUTRAL600
                    }
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Typo>
                </TouchableOpacity>
              ))}
            </View>

            {["fullName", "phoneNumber", "flat", "area", "landmark"].map(
              (field) => (
                <View key={field} style={commonStyles.flexRow}>
                  <Input
                    value={
                      typeof addressDetail?.[
                        field as keyof UserAddressProps
                      ] === "string"
                        ? (addressDetail[
                            field as keyof UserAddressProps
                          ] as string)
                        : ""
                    }
                    onChangeText={(text: string) =>
                      setAddressDetail((prev) => ({ ...prev, [field]: text }))
                    }
                    placeholder={field.replace(/([A-Z])/g, " $1").trim()}
                    style={styles.inputStyle}
                  />
                </View>
              )
            )}
          </View>

          <Button
            title="Save"
            onPress={() => {
              if (!addressDetail.coordinates?.length) {
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
              handleAddAddressMutation.mutate(addressDetail);
            }}
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
  headerText: {
    paddingBottom: verticalScale(10),
    borderBottomWidth: 1,
    borderBottomColor: colors.NEUTRAL350,
  },
  dataContainer: {
    marginVertical: verticalScale(15),
    gap: spacingY._15,
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
