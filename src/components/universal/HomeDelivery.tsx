import { StyleSheet, View } from "react-native";
import { verticalScale } from "@/utils/styling";
import Address from "../common/Address";
import Instructions from "../common/Instructions";
import ItemList from "./ItemList";
import { FC } from "react";

interface HomeDeliveryProps {
  onAgentVoice: (data: string) => void;
  onAgentInstruction: (data: string) => void;
  onMerchantVoice: (data: string) => void;
  onMerchantInstruction: (data: string) => void;
  onAddressSelect: (type: string, otherId?: string) => void;
}

const HomeDelivery: FC<HomeDeliveryProps> = ({
  onAgentVoice,
  onAgentInstruction,
  onMerchantVoice,
  onMerchantInstruction,
  onAddressSelect,
}) => {
  return (
    <View style={styles.container}>
      <Address
        onSelect={(type, otherId) => {
          if (onAddressSelect) {
            onAddressSelect(type, otherId);
          }
        }}
      />

      <Instructions
        placeholder="Instructions (if any)"
        onRecordComplete={(data) => onAgentVoice(data)}
        onChangeText={(data) => onAgentInstruction(data)}
      />

      <ItemList />

      <Instructions
        placeholder="Instruction to merchant"
        onRecordComplete={(data) => onMerchantVoice(data)}
        onChangeText={(data) => onMerchantInstruction(data)}
      />
    </View>
  );
};

export default HomeDelivery;

const styles = StyleSheet.create({
  container: {
    marginTop: verticalScale(15),
  },
});
