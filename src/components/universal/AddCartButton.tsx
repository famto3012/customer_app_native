import { Pressable, StyleSheet, View } from "react-native";
import { FC } from "react";
import Typo from "../Typo";
import { colors, radius } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import { AddCartButtonProps } from "@/types";

const AddCartButton: FC<AddCartButtonProps> = ({
  onDecrement,
  onIncrement,
  onPress,
  count,
}) => {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: count > 0 ? colors.WHITE : colors.PRIMARY,
        },
      ]}
    >
      {count > 0 ? (
        <View style={styles.counterContainer}>
          {/* Decrement Button */}
          <Pressable onPress={onDecrement} style={styles.button}>
            <Typo size={14} color={colors.PRIMARY} style={styles.text}>
              -
            </Typo>
          </Pressable>

          {/* Count */}
          <Typo size={14} color={colors.PRIMARY} style={styles.countText}>
            {count}
          </Typo>

          {/* Increment Button */}
          <Pressable onPress={onIncrement} style={styles.button}>
            <Typo size={14} color={colors.PRIMARY} style={styles.text}>
              +
            </Typo>
          </Pressable>
        </View>
      ) : (
        <Pressable onPress={onPress}>
          <Typo size={14} color={colors.WHITE} style={styles.text}>
            Add
          </Typo>
        </Pressable>
      )}
    </View>
  );
};

export default AddCartButton;

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    paddingVertical: verticalScale(5),
    width: "80%",
    borderRadius: radius._6,
    position: "absolute",
    bottom: scale(-15),
    borderWidth: 1,
    borderColor: colors.PRIMARY,
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    textAlign: "center",
  },
  countText: {
    minWidth: 30,
    textAlign: "center",
  },
});
