import Header from "@/components/Header";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors } from "@/constants/theme";
import { useAuthStore } from "@/store/store";
import { requestNotificationPermission } from "@/utils/helpers";
import * as LocalAuthentication from "expo-local-authentication";
import * as Notifications from "expo-notifications";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Switch,
  ToastAndroid,
  View,
} from "react-native";

const Settings = () => {
  const [hasBiometric, setHasBiometry] = useState<boolean>(false);
  const [haveBiometric, setHaveBiometry] = useState<boolean>(false);
  const [fingerprintEnabled, setFingerprintEnabled] = useState<boolean>(false);
  const [notificationsEnabled, setNotificationsEnabled] =
    useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const hardware = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();

      setHasBiometry(hardware);
      setHaveBiometry(enrolled);

      // Get stored biometric preference
      setFingerprintEnabled(useAuthStore.getState().biometricAuth);

      const { status } = await Notifications.getPermissionsAsync();
      setNotificationsEnabled(status === "granted");
    })();
  }, []);

  // Authenticate User with Biometrics
  const authenticate = async (): Promise<boolean> => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate with Fingerprint",
        disableDeviceFallback: true,
      });

      return result.success;
    } catch (error) {
      if (Platform.OS === "android") {
        ToastAndroid.showWithGravity(
          "Biometric authentication failed.",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
      } else {
        Alert.alert("Error", "Biometric authentication failed.");
      }

      return false;
    }
  };

  // Handle Fingerprint Toggle
  const handleFingerprintToggle = async (enabled: boolean) => {
    if (!hasBiometric) {
      if (Platform.OS === "android") {
        ToastAndroid.showWithGravity(
          "Your device does not support fingerprint authentication.",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
      } else {
        Alert.alert(
          "Error",
          "Your device does not support fingerprint authentication."
        );
      }

      return;
    }

    if (!haveBiometric && enabled) {
      if (Platform.OS === "android") {
        ToastAndroid.showWithGravity(
          "You need to add a fingerprint in your device settings to use this feature.",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
      } else {
        Alert.alert(
          "Set up Fingerprint",
          "You need to add a fingerprint in your device settings to use this feature.",
          [{ text: "OK", onPress: () => {} }]
        );
      }

      return;
    }

    const success = await authenticate();
    if (success) {
      useAuthStore.getState().setBiometricAuth(enabled);
      setFingerprintEnabled(enabled);
    } else {
      if (Platform.OS === "android") {
        ToastAndroid.showWithGravity(
          "Authentication not successful.",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
      } else {
        Alert.alert("Failed", "Authentication not successful.");
      }
    }
  };

  return (
    <ScreenWrapper>
      <Header title="Settings" />

      {/* Notification Settings */}
      <View style={styles.section}>
        <Typo
          size={15}
          fontFamily="SemiBold"
          style={styles.sectionTitle}
          color={colors.NEUTRAL900}
        >
          Notification settings
        </Typo>
        <View style={styles.row}>
          <Typo size={13} color={colors.NEUTRAL500}>
            Activate all notifications
          </Typo>
          <Switch
            value={notificationsEnabled}
            trackColor={{ false: "#D3D3D3", true: "#00D4FF" }}
            thumbColor={colors.NEUTRAL100}
            ios_backgroundColor="#D3D3D3"
            style={{
              transform: [
                { scaleX: Platform.OS === "ios" ? 1 : 1.2 },
                { scaleY: Platform.OS === "ios" ? 1 : 1.2 },
              ],
            }}
            onValueChange={requestNotificationPermission}
          />
        </View>
      </View>

      {/* Security Settings */}
      <View style={styles.section}>
        <Typo
          size={15}
          fontFamily="SemiBold"
          style={styles.sectionTitle}
          color={colors.NEUTRAL900}
        >
          Security
        </Typo>
        <View style={styles.row}>
          <Typo size={13} color={colors.NEUTRAL500}>
            Login with fingerprint
          </Typo>
          <Switch
            value={fingerprintEnabled}
            trackColor={{ false: "#D3D3D3", true: "#00D4FF" }}
            thumbColor={colors.NEUTRAL100}
            ios_backgroundColor="#D3D3D3"
            style={{
              transform: [
                { scaleX: Platform.OS === "ios" ? 1 : 1.2 },
                { scaleY: Platform.OS === "ios" ? 1 : 1.2 },
              ],
            }}
            onValueChange={handleFingerprintToggle}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Settings;

const styles = StyleSheet.create({
  section: {
    marginTop: 30,
    paddingHorizontal: 25,
  },
  sectionTitle: {
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
});
