import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { Dimensions, StatusBar, View } from "react-native";

import { ScreenWrapperProps } from "@/types";

import { colors } from "@/constants/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { height } = Dimensions.get("window");

const ScreenWrapper = ({ style, children }: ScreenWrapperProps) => {
  const insets = useSafeAreaInsets();
  // let paddingTop = Platform.OS === "ios" ? height * scale(0.06) : scale(20);
  let paddingTop = insets.top;
  // let paddingBottom = insets.bottom + 10;
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
