import { Dimensions, Platform, StatusBar, View } from "react-native";
import { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

import { ScreenWrapperProps } from "@/types";

import { colors } from "@/constants/theme";
import { scale } from "@/utils/styling";

const { height } = Dimensions.get("window");

const ScreenWrapper = ({ style, children }: ScreenWrapperProps) => {
  let paddingTop = Platform.OS === "ios" ? height * scale(0.06) : scale(20);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setHidden(false);
      StatusBar.setBarStyle("dark-content");
    }, [])
  );

  return (
    <View
      style={[style, { paddingTop, flex: 1, backgroundColor: colors.WHITE }]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.WHITE}
        translucent={false}
      />

      {children}
    </View>
  );
};

export default ScreenWrapper;
