import { Tabs } from "expo-router";
import CustomTabBar from "@/components/CustomTabBar";

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{ headerShown: false, animation: "fade" }}
      tabBar={CustomTabBar}
    >
      <Tabs.Screen name="index" options={{ tabBarLabel: "Home" }} />
      <Tabs.Screen name="order" options={{ tabBarLabel: "Orders" }} />
      <Tabs.Screen name="wallet" options={{ tabBarLabel: "Wallet" }} />
    </Tabs>
  );
};

export default TabLayout;
