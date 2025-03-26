import { Image, Pressable, StyleSheet, View, Linking } from "react-native";
import ScreenWrapper from "@/components/ScreenWrapper";
import {
  scale,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  verticalScale,
} from "@/utils/styling";
import Typo from "@/components/Typo";
import { colors, radius, spacingY } from "@/constants/theme";
import { CaretLeft } from "phosphor-react-native";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { requestLocationPermission } from "@/utils/helpers";
import { resetAndNavigate } from "@/utils/navigation";

const InitialLocationMark = () => {
  const [askPermission, setAskPermission] = useState<boolean>(false);

  const openAppSettings = () => {
    setAskPermission(true);
    Linking.openSettings().catch(() => {
      console.error("Failed to open app settings");
    });
  };

  useFocusEffect(
    useCallback(() => {
      const fetchLocation = async () => {
        const permission = await requestLocationPermission();

        permission ? resetAndNavigate("/(tabs)") : setAskPermission(false);
      };

      if (askPermission) fetchLocation();
    }, [])
  );

  return (
    <ScreenWrapper>
      <Pressable onPress={() => router.back()} style={{ padding: scale(20) }}>
        <CaretLeft color={colors.PRIMARY} weight="bold" />
      </Pressable>

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Image
          source={require("@/assets/images/location-permission.webp")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.button, { backgroundColor: colors.PRIMARY }]}
          onPress={openAppSettings}
        >
          <Typo size={14} color={colors.WHITE}>
            Enable Location
          </Typo>
        </Pressable>
        <Pressable
          onPress={() => router.push("/screens/common/add-address")}
          style={[
            styles.button,
            { borderWidth: 1, borderColor: colors.PRIMARY },
          ]}
        >
          <Typo size={14} color={colors.PRIMARY}>
            Locate Manually
          </Typo>
        </Pressable>
      </View>
    </ScreenWrapper>
  );
};

export default InitialLocationMark;

const styles = StyleSheet.create({
  image: {
    height: SCREEN_HEIGHT * 0.8,
    width: SCREEN_WIDTH * 0.8,
  },
  buttonContainer: {
    marginBottom: verticalScale(40),
    paddingHorizontal: scale(20),
    flexDirection: "column",
    gap: spacingY._10,
  },
  button: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: scale(15),
    borderRadius: radius._10,
  },
});
