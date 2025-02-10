import { Stack } from "expo-router";
import {
  gestureHandlerRootHOC,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

const RootLayout = () => {
  return (
    <GestureHandlerRootView>
      <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
        <Stack.Screen name="index" />
      </Stack>
    </GestureHandlerRootView>
  );
};

export default gestureHandlerRootHOC(RootLayout);
