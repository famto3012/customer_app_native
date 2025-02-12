import { StyleSheet, View } from "react-native";
import Typo from "../Typo";
import { colors, radius } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import ItemList from "./ItemList";
import Instructions from "../common/Instructions";

const TakeAway = () => {
  return (
    <>
      <View style={styles.addressContainer}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Typo size={14} fontFamily="Medium" color={colors.NEUTRAL800}>
              Burj Al Mandi
            </Typo>
            <Typo size={13} color={colors.NEUTRAL800}>
              +91 9778438763
            </Typo>
          </View>

          <View
            style={{
              backgroundColor: colors.PRIMARY,
              paddingVertical: verticalScale(5),
              paddingHorizontal: scale(10),
              borderRadius: radius._30,
            }}
          >
            <Typo size={13} color={colors.WHITE}>
              Collect from
            </Typo>
          </View>
        </View>

        <View>
          <Typo size={12} style={{ paddingTop: verticalScale(10) }}>
            Revathi, A18, Lekshmi Nagar, Kesavadasapuram, Trivandrum, Kerala
            695004
          </Typo>
        </View>
      </View>

      <ItemList />

      <Instructions placeholder="Instruction to merchant" />
    </>
  );
};

export default TakeAway;

const styles = StyleSheet.create({
  addressContainer: {
    backgroundColor: colors.PRIMARY_LIGHT,
    marginHorizontal: scale(20),
    marginTop: verticalScale(20),
    padding: scale(10),
    borderWidth: 1,
    borderColor: colors.PRIMARY,
    borderRadius: radius._6,
  },
});
