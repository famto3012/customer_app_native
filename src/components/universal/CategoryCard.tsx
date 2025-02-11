import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { FC, useState } from "react";
import { CategoryProps } from "@/types";
import Typo from "../Typo";
import { CaretDown, CaretUp } from "phosphor-react-native";
import { scale, verticalScale } from "@/utils/styling";
import { colors, radius } from "@/constants/theme";

const CategoryCard: FC<{ item: CategoryProps }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <View
      style={{
        marginBottom: verticalScale(25),
        backgroundColor: colors.NEUTRAL100,
        padding: scale(10),
        borderRadius: radius._10,
      }}
    >
      <Pressable
        onPress={() => setIsOpen(!isOpen)}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typo
          size={15}
          fontWeight="bold"
          color={colors.NEUTRAL900}
          style={{ maxWidth: "85%" }}
        >
          {item.categoryName}
        </Typo>

        <View
          style={{
            borderWidth: 1,
            borderRadius: radius._6,
            marginEnd: scale(2),
          }}
        >
          {isOpen ? (
            <CaretDown size={scale(20)} />
          ) : (
            <CaretUp size={scale(20)} />
          )}
        </View>
      </Pressable>
    </View>
  );
};

export default CategoryCard;

const styles = StyleSheet.create({});
