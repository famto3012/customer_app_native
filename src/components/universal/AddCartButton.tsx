import { Pressable, StyleSheet, View } from "react-native";
import { FC } from "react";
import Typo from "../Typo";
import { colors, radius } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import { AddCartButtonProps } from "@/types";

const AddCartButton: FC<AddCartButtonProps> = ({
  customizable,
  onDecrement,
  onIncrement,
  onPress,
  count,
  inventory,
}) => {
  return (
    <>
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
            {/* Decrement Button */}
            <Pressable onPress={onDecrement} style={styles.button}>
              <Typo size={20} color={colors.PRIMARY} style={styles.text}>
                -
              </Typo>
            </Pressable>

            {/* Count */}
            <Typo size={14} color={colors.PRIMARY} style={styles.countText}>
              {count}
            </Typo>

            {/* Increment Button */}
            <Pressable onPress={onIncrement} style={styles.button}>
              <Typo size={20} color={colors.PRIMARY} style={styles.text}>
                +
              </Typo>
            </Pressable>
          </View>
        ) : (
          <Pressable
            style={{
              // backgroundColor: colors.RED,
              height: "100%",
              justifyContent: "center",
            }}
            onPress={onPress}
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

      {customizable && (
        <Typo
          style={{
            position: "absolute",
            bottom: verticalScale(-30),
            left: scale(15),
          }}
        >
          customizable*
        </Typo>
      )}
    </>
  );
};

export default AddCartButton;

const styles = StyleSheet.create({
  container: {
    height: verticalScale(38),
    alignSelf: "center",
    justifyContent: "center",
    width: "85%",
    borderRadius: radius._6,
    position: "absolute",
    bottom: scale(-15),
    borderWidth: 1,
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
    height: "100%",
    paddingHorizontal: scale(10),
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
