import { View, Image, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import Button from "@/components/Button";
import Typo from "@/components/Typo";
import { colors } from "@/constants/theme";
import { verticalScale, scale } from "@/utils/styling";
import { router } from "expo-router";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import {
  generateFcmToken,
  requestNotificationPermission,
} from "@/utils/helpers";
import { resetAndNavigate } from "@/utils/navigation";
import * as Notifications from "expo-notifications";

const NotificationPermission = () => {
  const [permissionChecked, setPermissionChecked] = useState(false);

  const checkNotificationPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();

    if (status === "granted") {
      resetAndNavigate("/delivery-ad");
      generateFcmToken();
    } else {
      setPermissionChecked(true);
    }
  };

  const handlePermissionRequest = async () => {
    await requestNotificationPermission();
    resetAndNavigate("/delivery-ad");
  };

  useEffect(() => {
    checkNotificationPermission();
  }, []);

  // If permission was already granted, user will be navigated, so no need to render UI
  if (!permissionChecked) return null;

  return (
    <ScreenWrapper>
      <Header
        iconSize={20}
        showLeftIcon={false}
        showRightIcon={false}
        title="Push Notification"
      />

      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          width: SCREEN_WIDTH,
        }}
      >
        <Image
          source={require("@/assets/images/notification-permission.webp")}
          resizeMode="cover"
          style={{
            width: SCREEN_WIDTH * 0.8,
            height: SCREEN_HEIGHT * 0.4,
          }}
        />

        <Typo
          size={15}
          fontWeight={"bold"}
          color={colors.NEUTRAL900}
          style={{ textAlign: "center", marginVertical: scale(10) }}
        >
          Real-time updates of your order
        </Typo>
        <Typo
          size={13}
          fontWeight={300}
          style={{ textAlign: "center", width: SCREEN_WIDTH * 0.8 }}
        >
          Allow push notifications to get real-time updates of your order status
        </Typo>
      </View>

      <View
        style={{
          marginHorizontal: scale(20),
          gap: 10,
          paddingBottom: verticalScale(30),
        }}
      >
        <Button
          title="Turn on notifications"
          onPress={handlePermissionRequest}
        />
        <Pressable
          style={{ padding: scale(10) }}
          onPress={() => router.push("/delivery-ad")}
        >
          <Typo
            size={16}
            color={colors.PRIMARY}
            style={{ textAlign: "center" }}
          >
            Not now
          </Typo>
        </Pressable>
      </View>
    </ScreenWrapper>
  );
};

export default NotificationPermission;
