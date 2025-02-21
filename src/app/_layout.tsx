import { Stack } from "expo-router";
import {
  gestureHandlerRootHOC,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  PaperProvider,
  MD3LightTheme as DefaultTheme,
} from "react-native-paper";

const queryClient = new QueryClient();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#00CED1", // ✅ Change selection color to blue
    onSurface: "#000000", // ✅ Text color inside the calendar
    surface: "#ffffff", // ✅ Background of the calendar
    backdrop: "rgba(0, 0, 0, 0.12)", // ✅ Background overlay color
    primaryContainer: "rgba(4, 255, 242, 0.4)",
    onPrimaryContainer: "rgba(4, 255, 242, 0.37)",
    secondaryContainer: "#fff",
    surfaceVariant: "#fff",
  },
};

const RootLayout = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView>
        <PaperProvider theme={theme}>
          <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
            <Stack.Screen name="index" />
          </Stack>
        </PaperProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
};

export default gestureHandlerRootHOC(RootLayout);
