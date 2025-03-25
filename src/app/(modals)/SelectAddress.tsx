import { Pressable, View } from "react-native";
import { scale, verticalScale } from "@/utils/styling";
import { CaretLeft } from "phosphor-react-native";
import { colors, radius } from "@/constants/theme";
import { FC } from "react";
import { router, useLocalSearchParams } from "expo-router";
import UserSavedAddress from "../screens/user/UserSavedAddress";

const SelectAddress: FC<{ onCloseModal: () => void }> = ({ onCloseModal }) => {
  const { setAsUserAddress, showActionButton, addressFor } =
    useLocalSearchParams();

  return (
    <View style={{ flex: 1, backgroundColor: colors.WHITE }}>
      <View
        style={{
          paddingHorizontal: scale(20),
          marginTop: verticalScale(30),
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={{
            padding: scale(5),
            backgroundColor: colors.WHITE,
            alignSelf: "flex-start",
            borderRadius: radius._3,
          }}
        >
          <CaretLeft size={scale(20)} color={colors.PRIMARY} weight="bold" />
        </Pressable>
      </View>

      <UserSavedAddress
        showActionButton={showActionButton === "true"}
        setAsUserAddress={setAsUserAddress === "true"}
        addressFor={addressFor as string}
      />
    </View>
  );
};

export default SelectAddress;
