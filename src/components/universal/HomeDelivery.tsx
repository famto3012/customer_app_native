import { StyleSheet, View } from "react-native";
import { verticalScale } from "@/utils/styling";
import Address from "../common/Address";
import Instructions from "../common/Instructions";
import ItemList from "./ItemList";

const HomeDelivery = () => {
  return (
    <View style={styles.container}>
      <Address />

      <Instructions placeholder="Instructions (if any)" />

      <ItemList />

      <Instructions placeholder="Instruction to merchant" />
    </View>
  );
};

export default HomeDelivery;

const styles = StyleSheet.create({
  container: {
    marginTop: verticalScale(15),
  },
});
