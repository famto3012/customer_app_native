import { SOCKET_URL } from "@/constants/links";
import { useAuthStore } from "@/store/store";
import React, { createContext, FC, useContext, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import messaging from "@react-native-firebase/messaging";
import notifee, { AndroidImportance, EventType } from "@notifee/react-native";
import { Platform } from "react-native";

interface SocketService {
  emit: (event: string, data: any) => void;
  on: (event: string, cb: (data: any) => void) => void;
  off: (event: string) => void;
  removeListener: (listenerName: string) => void;
  disconnect: () => void;
}

const SocketContext = createContext<SocketService | undefined>(undefined);

export const SocketProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const socket = useRef<Socket | null>(null);
  const initialized = useRef(false);
  const authStore = useAuthStore.getState();

  useEffect(() => {
    const unsubscribe = useAuthStore.subscribe((state) => {
      const { userId, fcmToken } = state;
      // console.log("userId", userId, fcmToken);
      if (!userId || !fcmToken || initialized.current) return;

      console.log("Initializing socket with:", { userId, fcmToken });

      if (socket.current) {
        socket.current.disconnect();
      }

      socket.current = io(SOCKET_URL, {
        query: { userId, fcmToken },
        autoConnect: true,
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
      });

      socket.current.on("connect", () => {
        console.log("Socket connected successfully!");
      });

      socket.current.on("connect_error", (err) => {
        console.log(`Connection error: ${err.message}`);
      });

      initialized.current = true;
    });

    return () => {
      unsubscribe();
      socket.current?.disconnect();
      initialized.current = false;
    };
  }, []);

  const createNotificationChannel = async () => {
    if (Platform.OS === "android") {
      const channelId = await notifee.createChannel({
        id: "default",
        name: "Default Channel",
        importance: AndroidImportance.HIGH,
        sound: "default",
        vibration: true,
        vibrationPattern: [300, 500, 300, 500],
      });
      console.log("✅ Notifee Android Channel created:", channelId);
      return channelId;
    }
    return null;
  };

  const requestNotificationPermission = async () => {
    if (Platform.OS === "ios") {
      const settings = await notifee.requestPermission({
        sound: true,
        alert: true,
        badge: true,
      });
      return settings.authorizationStatus >= 1;
    } else {
      return true;
    }
  };

  const displayForegroundNotification = async (remoteMessage: any) => {
    try {
      const permissionGranted = await requestNotificationPermission();
      if (!permissionGranted) {
        console.log("🚫 Notification permission not granted");
        return;
      }

      const channelId = await createNotificationChannel();

      const title = remoteMessage?.notification?.title || "New Notification";
      const body =
        remoteMessage?.notification?.body || "You have a new message.";
      const imageUrl =
        remoteMessage?.notification?.android?.imageUrl ||
        remoteMessage?.data?.imageUrl ||
        remoteMessage?.notification?.imageUrl ||
        "";

      const notificationContent = {
        title,
        body,
        android: {
          channelId: channelId || "default",
          smallIcon: "notification_icon",
          sound: "default",
          pressAction: {
            id: "default",
          },
          importance: AndroidImportance.HIGH,
          showTimestamp: true,
          ...(imageUrl ? { largeIcon: imageUrl } : {}),
        },
        ios: {
          sound: "default",
          critical: true,
          foregroundPresentationOptions: {
            badge: true,
            sound: true,
            banner: true,
            list: true,
          },
        },
        data: remoteMessage.data,
      };

      await notifee.displayNotification(notificationContent);
      console.log("🎉 Notifee notification displayed with sound & popup!");
    } catch (error) {
      console.error("❌ Error displaying notification:", error);
    }
  };

  useEffect(() => {
    // Set up foreground message handler
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log("📩 Foreground Message Received:", remoteMessage);
      await displayForegroundNotification(remoteMessage);
    });

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("📩 Background message received:", remoteMessage);
      await displayForegroundNotification(remoteMessage);
    });

    const notifeeUnsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        console.log("👆 User pressed notification:", detail.notification);
      }
    });

    notifee.onBackgroundEvent(async ({ type, detail }) => {
      if (type === EventType.PRESS) {
        console.log(
          "📩 User interacted with notification in background:",
          detail.notification
        );
        // Handle navigation or other logic when user taps on notification
      }
    });

    const bootstrap = async () => {
      await createNotificationChannel();
    };
    bootstrap().catch(console.error);

    return () => {
      unsubscribe();
      notifeeUnsubscribe();
    };
  }, []);

  const emit = (event: string, data: any = {}) => {
    socket.current?.emit(event, data);
  };

  const on = (event: string, cb: (data: any) => void) => {
    socket.current?.on(event, cb);
  };

  const off = (event: string) => {
    socket.current?.off(event);
  };

  const removeListener = (listenerName: string) => {
    socket.current?.removeListener(listenerName);
  };

  const disconnect = () => {
    if (socket.current) {
      socket.current.disconnect();
      socket.current = null;
      initialized.current = false;
    }
  };

  return (
    <SocketContext.Provider
      value={{ emit, on, off, disconnect, removeListener }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketService => {
  const socketService = useContext(SocketContext);
  if (!socketService)
    throw new Error("useSocket must be used within a SocketProvider");
  return socketService;
};
