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
import { SocketProvider } from "@/service/socketProvider";
import { Portal } from "react-native-paper"; // ✅ Use this

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: true,
    },
  },
});

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
        <SocketProvider>
          <PaperProvider theme={theme}>
            {/* <Portal.Host> */}
            <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
              <Stack.Screen name="index" />
            </Stack>
            {/* </Portal.Host> */}
          </PaperProvider>
        </SocketProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
};

export default gestureHandlerRootHOC(RootLayout);
