import { Pressable, ScrollView, View } from "react-native";
import Address from "@/components/common/Address";
import { scale, verticalScale } from "@/utils/styling";
import Button from "@/components/Button";
import { CaretLeft } from "phosphor-react-native";
import { colors, radius } from "@/constants/theme";
import { FC, useState } from "react";
import { useAuthStore } from "@/store/store";

const SelectAddress: FC<{ onCloseModal: () => void }> = ({ onCloseModal }) => {
  const [address, setAddress] = useState<{
    type: string;
    otherId: string;
    address: string;
  }>({
    type: "",
    otherId: "",
    address: "",
  });

  const { setUserAddress } = useAuthStore.getState();

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{ paddingHorizontal: scale(20), marginTop: verticalScale(30) }}
      >
        <Pressable
          onPress={onCloseModal}
          style={{
            padding: scale(5),
            backgroundColor: colors.NEUTRAL300,
            alignSelf: "flex-start",
            borderRadius: radius._3,
          }}
        >
          <CaretLeft size={scale(20)} color={colors.BLACK} weight="bold" />
        </Pressable>
      </View>

      <ScrollView style={{ marginTop: verticalScale(20) }}>
        <Address
          alreadySelect
          onSelect={(type, otherId, address) =>
            setAddress({
              type,
              otherId: otherId as string,
              address: address as string,
            })
          }
        />
      </ScrollView>

      <View
        style={{
          marginTop: "auto",
          padding: verticalScale(20),
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -10 },
          elevation: 20,
          shadowRadius: 25,
          shadowOpacity: 0.25,
        }}
      >
        <Button
          title="Continue"
          onPress={() => {
            setUserAddress(address);
            onCloseModal();
          }}
        />
      </View>
    </View>
  );
};

export default SelectAddress;
