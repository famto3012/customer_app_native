import { View, Image, Pressable } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import Button from "@/components/Button";
import Typo from "@/components/Typo";
import { colors } from "@/constants/theme";
import { SCREEN_HEIGHT, SCREEN_WIDTH, verticalScale } from "@/utils/styling";
import { router } from "expo-router";

const NotificationPermission = () => {
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
          width: "100%",
        }}
      >
        <Image
          source={require("@/assets/images/notification-permission.webp")}
          resizeMode="cover"
          style={{
            width: verticalScale(SCREEN_WIDTH * 0.8),
            height: verticalScale(SCREEN_HEIGHT * 0.4),
          }}
        />

        <Typo
          size={15}
          fontWeight={"bold"}
          color={colors.NEUTRAL900}
          style={{ textAlign: "center", marginVertical: 10 }}
        >
          Real-time updates of your order
        </Typo>
        <Typo
          size={13}
          fontWeight={300}
          style={{ textAlign: "center", width: "90%" }}
        >
          Allow push notifications to get real-time updates of your order status
        </Typo>
      </View>

      <View
        style={{
          marginHorizontal: 20,
          gap: 10,
          paddingBottom: verticalScale(40),
        }}
      >
        <Button title="Turn on notifications" onPress={() => {}} />
        <Pressable
          style={{ padding: 10 }}
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
