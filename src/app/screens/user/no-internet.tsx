import { Alert, Image, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { scale, verticalScale } from "@/utils/styling";
import Typo from "@/components/Typo";
import Button from "@/components/Button";
import { useAuthStore } from "@/store/store";
import { resetAndNavigate } from "@/utils/navigation";
import { colors, spacingY } from "@/constants/theme";
import NetInfo from "@react-native-community/netinfo";

const NoInternet = () => {
  const { token, newUser } = useAuthStore.getState();
  const [checking, setChecking] = useState(false);

  const handleTryAgain = async () => {
    setChecking(true);
    const state = await NetInfo.fetch();

    if (state.isConnected) {
      token
        ? resetAndNavigate("/(tabs)")
        : newUser
        ? resetAndNavigate("/notification-permission")
        : resetAndNavigate("/auth");
    } else {
      Alert.alert("", "No internet connection. Please try again.");
    }

    setChecking(false);
  };

  return (
    <ScreenWrapper>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Image
          source={require("@/assets/images/no-connection.webp")}
          style={styles.image}
        />

        <View
          style={{
            width: "70%",
            gap: spacingY._10,
            marginTop: verticalScale(15),
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typo size={16} color={colors.NEUTRAL900} fontFamily="Medium">
            Ooops!
          </Typo>
          <Typo
            size={12}
            color={colors.NEUTRAL400}
            style={{ textAlign: "center" }}
          >
            Slow or no internet connection. Check your internet settings
          </Typo>
        </View>
      </View>

      <View style={{ padding: scale(20) }}>
        <Button
          title="Try Again"
          onPress={handleTryAgain}
          isLoading={checking}
        />
      </View>
    </ScreenWrapper>
  );
};

export default NoInternet;

const styles = StyleSheet.create({
  image: {
    width: scale(300),
    height: verticalScale(300),
    resizeMode: "cover",
  },
});
