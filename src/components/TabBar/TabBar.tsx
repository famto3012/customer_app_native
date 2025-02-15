import { View, StyleSheet, LayoutChangeEvent } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { colors } from "@/constants/theme";
import TabBarButton from "./TabBarButton";
import { useEffect, useState } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const [dimensions, setDimensions] = useState({ height: 20, width: 100 });

  const buttonWidth = dimensions.width / state.routes.length;
  const buttonSize = buttonWidth * 0.4;
  const marginHorizontal = (buttonWidth - buttonSize) / 2;

  const onTabBarLayout = (e: LayoutChangeEvent) => {
    setDimensions({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width,
    });
  };

  const tabPositionX = useSharedValue(buttonWidth * state.index);

  useEffect(() => {
    tabPositionX.value = withSpring(buttonWidth * state.index, {
      damping: 15,
      stiffness: 120,
    });
  }, [state.index]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabPositionX.value }],
    };
  });

  return (
    <View style={styles.tabBarContainer}>
      {/* Fake Shadow View */}
      <LinearGradient
        colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.38)"]} // Transparent at top, dark at bottom
        start={{ x: 0, y: 0 }} // Start from bottom
        end={{ x: 0, y: 1 }} // End at top (transparent)
        style={styles.shadowView}
      />

      {/* Actual Tab Bar */}
      <View onLayout={onTabBarLayout} style={styles.tabBar}>
        <Animated.View
          style={[
            animatedStyle,
            {
              position: "absolute",
              backgroundColor: colors.PRIMARY,
              marginHorizontal: marginHorizontal,
              borderRadius: buttonSize / 2,
              height: buttonSize,
              width: buttonSize,
            },
          ]}
        />
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            typeof options.tabBarLabel === "string"
              ? options.tabBarLabel
              : typeof options.title === "string"
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            tabPositionX.value = withSpring(buttonWidth * index, {
              duration: 2500,
            });

            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TabBarButton
              key={route.name}
              onPress={onPress}
              onLongPress={onLongPress}
              isFocused={isFocused}
              routeName={route.name}
              color={isFocused ? colors.TEXT : colors.NEUTRAL400}
              label={label}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    backgroundColor: "#fff",
  },
  shadowView: {
    position: "absolute",
    top: -25,
    left: 0,
    right: 0,
    height: 190,
  },
  tabBar: {
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 15,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 }, // Small negative height moves shadow above
    shadowOpacity: 0.15, // Subtle but visible
    shadowRadius: 10,
    elevation: 0, // Remove default bottom shadow
  },
});
