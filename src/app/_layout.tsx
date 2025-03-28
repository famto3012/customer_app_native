import { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import * as Linking from "expo-linking";
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
import { resetAndNavigate } from "@/utils/navigation";
import { migrateData } from "@/utils/flutterMigration";

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
    primary: "#00CED1",
    onSurface: "#000000",
    surface: "#ffffff",
    backdrop: "rgba(0, 0, 0, 0.12)",
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
  const router = useRouter();

  useEffect(() => {
    migrateData();
  }, []);

  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      const { url } = event;
      const parsedUrl = Linking.parse(url);
      if (parsedUrl.queryParams?.code) {
        resetAndNavigate({
          pathname: "/auth",
          params: { code: parsedUrl.queryParams.code },
        });
        // router.replace(`/auth?code=${parsedUrl.queryParams.code}`);
      }
    };

    // Listen for deep links when the app is open
    const subscription = Linking.addEventListener("url", handleDeepLink);

    // Handle the initial deep link when the app is launched
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => {
      subscription.remove();
    };
  }, [router]);

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
