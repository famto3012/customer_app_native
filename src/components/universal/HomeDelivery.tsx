import { useAuthStore } from "@/store/store";
import { CartProps, SelectedAddress } from "@/types";
import { FC, useEffect } from "react";
import { View } from "react-native";
import Instructions from "../common/Instructions";
import UserSelectedAddress from "../common/UserSelectedAddress";
import ItemList from "./ItemList";

interface HomeDeliveryProps {
  items: CartProps["items"];
  onAgentVoice: (data: string) => void;
  onAgentInstruction: (data: string) => void;
  onMerchantVoice: (data: string) => void;
  onMerchantInstruction: (data: string) => void;
  onAddressSelect: (type: string, otherId?: string) => void;
}

const HomeDelivery: FC<HomeDeliveryProps> = ({
  items,
  onAgentVoice,
  onAgentInstruction,
  onMerchantVoice,
  onMerchantInstruction,
  onAddressSelect,
}) => {
  const { userAddress } = useAuthStore.getState();

  useEffect(() => {
    if (onAddressSelect) {
      onAddressSelect(userAddress.type, userAddress.otherId);
    }
  }, [userAddress]);

  return (
    <View>
      <UserSelectedAddress
        deliveryMode="Universal"
        onSelect={(type: string, address: SelectedAddress) => {
          onAddressSelect(address.type, address.otherId);
        }}
      />

      <Instructions
        placeholder="Instructions (if any)"
        onRecordComplete={(data) => {
          onAgentVoice(data);
        }}
        onChangeText={(data) => onAgentInstruction(data)}
      />

      <ItemList items={items} />

      <Instructions
        placeholder="Instruction to merchant"
        onRecordComplete={(data) => onMerchantVoice(data)}
        onChangeText={(data) => onMerchantInstruction(data)}
      />
    </View>
  );
};

export default HomeDelivery;
