import { StyleSheet, TouchableOpacity, View } from "react-native";
import { scale, verticalScale } from "@/utils/styling";
import Typo from "../Typo";
import { colors, radius } from "@/constants/theme";
import { router } from "expo-router";

const ItemList = () => {
  return (
    <View style={styles.container}>
      <Typo size={14} fontFamily="SemiBold" color={colors.NEUTRAL800}>
        Added Items
      </Typo>

      <View style={styles.itemContainer}>
        <View>
          <Typo size={13} color={colors.NEUTRAL900}>
            Chicken Mandi
          </Typo>
          <Typo size={14} color={colors.NEUTRAL900} fontFamily="SemiBold">
            ₹ 250
          </Typo>
        </View>

        <View style={[styles.actionBtn]}>
          <TouchableOpacity style={styles.btn}>
            <Typo size={14} color={colors.PRIMARY}>
              -
            </Typo>
          </TouchableOpacity>
          <Typo size={16} color={colors.PRIMARY} fontFamily="Medium">
            2
          </Typo>
          <TouchableOpacity style={styles.btn}>
            <Typo size={14} color={colors.PRIMARY}>
              +
            </Typo>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity onPress={() => router.back()} style={styles.addBtn}>
        <Typo size={14} color={colors.PRIMARY}>
          Add More
        </Typo>
      </TouchableOpacity>
    </View>
  );
};

export default ItemList;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(20),
    marginVertical: verticalScale(10),
  },
  itemContainer: {
    marginVertical: verticalScale(10),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actionBtn: {
    backgroundColor: colors.WHITE,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    height: verticalScale(34),
    borderRadius: radius._6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  btn: {
    paddingHorizontal: scale(18),
  },
  addBtn: {
    backgroundColor: colors.PRIMARY_LIGHT,
    justifyContent: "center",
    alignItems: "center",
    height: verticalScale(45),
    marginVertical: verticalScale(15),
    borderRadius: radius._10,
  },
});
