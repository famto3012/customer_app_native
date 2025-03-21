import { Pressable, StyleSheet, View } from "react-native";
import { FC, useEffect } from "react";
import Typo from "../Typo";
import { colors, radius } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import { AddCartButtonProps } from "@/types";

const AddCartButton: FC<AddCartButtonProps> = ({
  onDecrement,
  onIncrement,
  onPress,
  count,
  inventory,
}) => {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            count > 0
              ? colors.WHITE
              : inventory
              ? colors.PRIMARY
              : colors.WHITE,
          borderColor: inventory ? colors.PRIMARY : colors.NEUTRAL500,
        },
      ]}
    >
      {count > 0 ? (
        <View style={styles.counterContainer}>
          {/* Decrement Button with improved hitSlop */}
          <Pressable
            onPress={onDecrement}
            style={styles.button}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Typo size={14} color={colors.PRIMARY} style={styles.text}>
              -
            </Typo>
          </Pressable>

          {/* Count */}
          <Typo size={14} color={colors.PRIMARY} style={styles.countText}>
            {count}
          </Typo>

          {/* Increment Button with improved hitSlop */}
          <Pressable
            onPress={onIncrement}
            style={styles.button}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Typo size={14} color={colors.PRIMARY} style={styles.text}>
              +
            </Typo>
          </Pressable>
        </View>
      ) : (
        <Pressable
          onPress={onPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Typo
            size={inventory ? 14 : 13}
            color={inventory ? colors.WHITE : colors.NEUTRAL900}
            style={styles.text}
          >
            {inventory ? "Add" : "Not Available"}
          </Typo>
        </Pressable>
      )}
    </View>
  );
};

export default AddCartButton;

const styles = StyleSheet.create({
  container: {
    height: verticalScale(35),
    alignSelf: "center",
    justifyContent: "center",
    width: "80%",
    borderRadius: radius._6,
    borderWidth: 1,
    // Shadow for better visibility
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 3,
    // elevation: 3,
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
    height: verticalScale(30),
  },
  text: {
    textAlign: "center",
    zIndex: 1,
  },
  countText: {
    minWidth: 30,
    textAlign: "center",
  },
});
