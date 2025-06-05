import { DataProvider } from "@/context/DataContext";
import { SocketProvider } from "@/service/socketProvider";
import { resetAndNavigate } from "@/utils/navigation";
import NetInfo from "@react-native-community/netinfo";
import "@react-native-firebase/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  gestureHandlerRootHOC,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";

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
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  const router = useRouter();

  // useEffect(() => {
  //   if (Platform.OS === "android") {
  //     migrateData();
  //   }
  // }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    // Check the initial network state
    NetInfo.fetch().then((state) => {
      setIsConnected(state.isConnected);
      if (!state.isConnected) resetAndNavigate("/screens/user/no-internet");
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isConnected === false) {
      resetAndNavigate("/screens/user/no-internet");
    }
  }, [isConnected]);

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
    // <SafeAreaView style={{ flex: 1, backgroundColor: colors.WHITE }}>
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
    // </SafeAreaView>
  );
};

export default gestureHandlerRootHOC(RootLayout);
