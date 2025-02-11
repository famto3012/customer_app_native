import { View, Text, Pressable, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { verticalScale } from "@/utils/styling";
import * as Icon from "phosphor-react-native";
import { colors } from "@/constants/theme";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const TabBarButton = ({
  onPress,
  onLongPress,
  isFocused,
  routeName,
  color,
  label,
}: {
  onPress: Function;
  onLongPress: Function;
  isFocused: boolean;
  routeName: string;
  color: string;
  label: string;
}) => {
  const tabBarIcons: any = {
    index: (isFocused: boolean) => (
      <Icon.House
        size={verticalScale(28)}
        weight={isFocused ? "fill" : "regular"}
        color={isFocused ? colors.TEXT : colors.NEUTRAL400}
      />
    ),
    order: (isFocused: boolean) => (
      <Icon.HandbagSimple
        size={verticalScale(28)}
        weight={isFocused ? "fill" : "regular"}
        color={isFocused ? colors.TEXT : colors.NEUTRAL400}
      />
    ),
    wallet: (isFocused: boolean) => (
      <Icon.Wallet
        size={verticalScale(28)}
        weight={isFocused ? "fill" : "regular"}
        color={isFocused ? colors.TEXT : colors.NEUTRAL400}
      />
    ),
  };

  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(
      typeof isFocused === "boolean" ? (isFocused ? 1 : 0) : isFocused,
      { duration: 350 }
    );
  }, [scale, isFocused]);

  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [0, 1], [1, 0]);
    return { opacity };
  });

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2]);

    const top = interpolate(scale.value, [0, 1], [0, 9]);

    return {
      transform: [
        {
          scale: scaleValue,
        },
      ],
      top,
    };
  });

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabBarItems}
    >
      <Animated.View style={animatedIconStyle}>
        {tabBarIcons[routeName] && tabBarIcons[routeName](isFocused)}
      </Animated.View>
      <Animated.Text
        style={[
          {
            color: isFocused ? colors.PRIMARY : colors.NEUTRAL400,
            fontSize: 12,
          },
          animatedTextStyle,
        ]}
      >
        {label}
      </Animated.Text>
    </Pressable>
  );
};

export default TabBarButton;

const styles = StyleSheet.create({
  tabBarItems: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
});
