import React, { useEffect, useState } from "react";
import { View, Alert, Switch, StyleSheet } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import { useAuthStore } from "@/store/store";
import { colors } from "@/constants/theme";
import Typo from "@/components/Typo";

const Settings = () => {
  const [hasBiometric, setHasBiometry] = useState<boolean>(false);
  const [haveBiometric, setHaveBiometry] = useState<boolean>(false);
  const [fingerprintEnabled, setFingerprintEnabled] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const hardware = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();

      setHasBiometry(hardware);
      setHaveBiometry(enrolled);

      // Get stored biometric preference
      setFingerprintEnabled(useAuthStore.getState().biometricAuth);
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
      Alert.alert("Error", "Biometric authentication failed.");
      return false;
    }
  };

  // Handle Fingerprint Toggle
  const handleFingerprintToggle = async (enabled: boolean) => {
    if (!hasBiometric) {
      Alert.alert(
        "Error",
        "Your device does not support fingerprint authentication."
      );
      return;
    }

    if (!haveBiometric && enabled) {
      Alert.alert(
        "Set up Fingerprint",
        "You need to add a fingerprint in your device settings to use this feature.",
        [{ text: "OK", onPress: () => {} }]
      );
      return;
    }

    const success = await authenticate();
    if (success) {
      useAuthStore.getState().setBiometricAuth(enabled);
      setFingerprintEnabled(enabled);
    } else {
      Alert.alert("Failed", "Authentication not successful.");
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
            value={false}
            trackColor={{ false: "#D3D3D3", true: "#00D4FF" }}
            thumbColor={colors.NEUTRAL100}
            ios_backgroundColor="#D3D3D3"
            style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
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
            style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
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
