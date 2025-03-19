import { Text, TextStyle } from "react-native";
import { colors } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { TypoProps } from "@/types";

const Typo = ({
  size,
  color = colors.NEUTRAL500,
  fontWeight = "400",
  children,
  fontFamily = "Regular",
  style,
  textProps = {},
}: TypoProps) => {
  const textStyles: TextStyle = {
    fontSize: size ? verticalScale(size) : verticalScale(10),
    color,
    fontWeight,
    fontFamily,
  };

  return (
    <Text
      style={[textStyles, style, { marginBottom: -3 }]}
      {...textProps}
      allowFontScaling={false}
    >
      {children}
    </Text>
  );
};

export default Typo;
