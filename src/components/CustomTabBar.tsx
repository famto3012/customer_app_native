import { colors, radius, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import * as Icon from "phosphor-react-native";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const tabBarIcons: any = {
    index: (isFocused: boolean) => (
      <Icon.House
        size={verticalScale(30)}
        weight={isFocused ? "fill" : "regular"}
        color={isFocused ? colors.PRIMARY : colors.NEUTRAL400}
      />
    ),
    order: (isFocused: boolean) => (
      <Icon.HandbagSimple
        size={verticalScale(30)}
        weight={isFocused ? "fill" : "regular"}
        color={isFocused ? colors.PRIMARY : colors.NEUTRAL400}
      />
    ),
    wallet: (isFocused: boolean) => (
      <Icon.Wallet
        size={verticalScale(30)}
        weight={isFocused ? "fill" : "regular"}
        color={isFocused ? colors.PRIMARY : colors.NEUTRAL400}
      />
    ),
  };

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label: any =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <TouchableOpacity
            key={route.name}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            style={styles.tabBarItem}
          >
            {tabBarIcons[route.name] && tabBarIcons[route.name](isFocused)}

            {/* <Typo
              size={12}
              fontWeight={isFocused ? "500" : "100"}
              style={{ color: isFocused ? colors.PRIMARY : colors.NEUTRAL600 }}
            >
              {label}
            </Typo> */}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    width: "100%",
    height: Platform.OS === "ios" ? verticalScale(73) : verticalScale(55),
    backgroundColor: colors.WHITE,
    justifyContent: "space-around",
    alignItems: "center",
    borderTopRightRadius: radius._30,
    borderTopLeftRadius: radius._30,
    overflow: "hidden",
  },
  tabBarItem: {
    marginBottom: Platform.OS === "ios" ? spacingY._10 : spacingY._5,
    justifyContent: "center",
    alignItems: "center",
  },
});
