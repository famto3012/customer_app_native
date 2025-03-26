import { BackHandler, Pressable, View } from "react-native";
import { useEffect } from "react";
import { scale, verticalScale } from "@/utils/styling";
import { CaretLeft } from "phosphor-react-native";
import { colors, radius } from "@/constants/theme";
import { router, useLocalSearchParams } from "expo-router";
import UserSavedAddress from "../screens/user/UserSavedAddress";

const SelectAddress = () => {
  const { setAsUserAddress, showActionButton, addressFor, mustSelectAddress } =
    useLocalSearchParams();

  const handleBackPress = () => {
    if (mustSelectAddress === "true") {
      console.log("mustSelectAddress is true, exiting app...");
      BackHandler.exitApp();
      return true;
    } else if (router.canGoBack()) {
      router.back();
      return true;
    }
    return false;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );

    return () => backHandler.remove();
  }, [mustSelectAddress]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.WHITE }}>
      <View
        style={{
          paddingHorizontal: scale(20),
          marginTop: verticalScale(30),
        }}
      >
        {mustSelectAddress !== "true" && (
          <Pressable
            onPress={handleBackPress}
            style={{
              padding: scale(5),
              backgroundColor: colors.WHITE,
              alignSelf: "flex-start",
              borderRadius: radius._3,
            }}
          >
            <CaretLeft size={scale(20)} color={colors.PRIMARY} weight="bold" />
          </Pressable>
        )}
      </View>

      <UserSavedAddress
        showActionButton={showActionButton === "true"}
        setAsUserAddress={setAsUserAddress === "true"}
        addressFor={
          ["pick", "drop"].includes(addressFor as string)
            ? (addressFor as "pick" | "drop")
            : undefined
        }
      />
    </View>
  );
};

export default SelectAddress;
