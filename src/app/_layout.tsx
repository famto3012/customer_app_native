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
import { DataProvider } from "@/context/DataContext";

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

const Layout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="(modals)/SelectAddress"
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
          gestureEnabled: true,
          gestureDirection: "vertical",
        }}
      />
    </Stack>
  );
};

const RootLayout = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView>
        <DataProvider>
          <SocketProvider>
            <PaperProvider theme={theme}>
              <Layout />
            </PaperProvider>
          </SocketProvider>
        </DataProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
};

export default gestureHandlerRootHOC(RootLayout);
