import { Tabs } from "expo-router";
import { TabBar } from "@/components/TabBar/TabBar";

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{ headerShown: false, animation: "fade" }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ tabBarLabel: "Home" }} />
      <Tabs.Screen name="order" options={{ tabBarLabel: "Orders" }} />
      <Tabs.Screen name="wallet" options={{ tabBarLabel: "Wallet" }} />
    </Tabs>
  );
};

export default TabLayout;
