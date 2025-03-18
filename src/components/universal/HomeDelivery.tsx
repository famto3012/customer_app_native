import { Modal, View } from "react-native";
import Instructions from "../common/Instructions";
import ItemList from "./ItemList";
import { FC, useEffect, useState } from "react";
import { CartProps } from "@/types";
import { useAuthStore } from "@/store/store";
import { Portal } from "react-native-paper";
import SelectAddress from "../BottomSheets/user/SelectAddress";
import UserSelectedAddress from "../common/UserSelectedAddress";

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
  const [show, setShow] = useState<boolean>(false);

  const { userAddress } = useAuthStore.getState();

  useEffect(() => {
    if (onAddressSelect) {
      onAddressSelect(userAddress.type, userAddress.otherId);
    }
  }, [userAddress]);

  return (
    <View>
      <UserSelectedAddress onPress={() => setShow(true)} />

      <Instructions
        placeholder="Instructions (if any)"
        onRecordComplete={(data) => onAgentVoice(data)}
        onChangeText={(data) => onAgentInstruction(data)}
      />

      <ItemList items={items} />

      <Instructions
        placeholder="Instruction to merchant"
        onRecordComplete={(data) => onMerchantVoice(data)}
        onChangeText={(data) => onMerchantInstruction(data)}
      />

      <Portal>
        <Modal
          visible={show}
          onDismiss={() => setShow(false)}
          onRequestClose={() => setShow(false)}
          animationType="slide"
        >
          <SelectAddress onCloseModal={() => setShow(false)} />
        </Modal>
      </Portal>
    </View>
  );
};

export default HomeDelivery;
