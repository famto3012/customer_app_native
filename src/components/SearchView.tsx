import { View, Pressable, ViewStyle } from "react-native";
import React, { FC } from "react";
import { verticalScale } from "@/utils/styling";
import { MagnifyingGlass } from "phosphor-react-native";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import Typo from "./Typo";

const SearchView: FC<{
  style?: ViewStyle;
  placeholder: string;
  onPress: () => void;
}> = ({ style, placeholder, onPress }) => {
  return (
    <View style={[{ marginTop: verticalScale(16) }, style]}>
      <Pressable
        onPress={onPress}
        style={{
          flexDirection: "row",
          alignItems: "center",
          alignSelf: "flex-start",
          gap: spacingX._10,
          backgroundColor: colors.WHITE,
          width: "100%",
          height: verticalScale(45),
          borderRadius: radius._10,
          paddingHorizontal: spacingX._10,
          paddingVertical: spacingY._10,
        }}
      >
        <MagnifyingGlass size={24} color={colors.PRIMARY} />

        <Typo size={14}>{placeholder}</Typo>
      </Pressable>
    </View>
  );
};

export default SearchView;
