import { colors } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { LayoutChangeEvent, Platform, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import TabBarButton from "./TabBarButton";

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
    <>
      <View style={styles.tabBarContainer}>
        {Platform.OS === "android" && (
          <LinearGradient
            colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.38)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.shadowView}
          />
        )}

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
    </>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    bottom: Platform.OS === "android" ? 0 : -1,
    left: 0,
    right: 0,
    height: Platform.OS === "android" ? verticalScale(75) : verticalScale(90),
    width: SCREEN_WIDTH,
    backgroundColor: colors.WHITE,
    zIndex: 10,
    elevation: 10,
  },
  shadowView: {
    position: "absolute",
    top: -15,
    left: 0,
    right: 0,
    height: 190,
  },
  tabBar: {
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    borderCurve: "continuous",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.WHITE,
    paddingVertical: 15,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -8 }, // Negative height = top shadow
    shadowOpacity: 0.1,
    shadowRadius: 8,

    // elevation: 0,
  },
});
