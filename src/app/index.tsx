import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Modal,
  BackHandler,
  StyleSheet,
} from "react-native";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import * as LocalAuthentication from "expo-local-authentication";
import { useAuthStore } from "@/store/store";
import { resetAndNavigate } from "@/utils/navigation";
import Typo from "@/components/Typo";
import { colors } from "@/constants/theme";
import { Fingerprint } from "phosphor-react-native";

const Main = () => {
  const [loaded] = useFonts({
    Bold: require("../assets/fonts/Poppins.Bold.ttf"),
    Regular: require("../assets/fonts/Poppins.Regular.ttf"),
    Medium: require("../assets/fonts/Poppins.Medium.ttf"),
    Light: require("../assets/fonts/Poppins.Light.ttf"),
    SemiBold: require("../assets/fonts/Poppins.Semibold.ttf"),
  });

  const { token, newUser, setNewUser, biometricAuth } = useAuthStore.getState();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const authenticate = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to access Famto",
        disableDeviceFallback: false, // Allow PIN/Pattern fallback
      });

      if (result.success) {
        proceedNavigation();
      } else if (
        result.error === "user_cancel" ||
        result.error === "system_cancel"
      ) {
        setShowAuthModal(true); // Show custom unlock modal
      } else {
        fallbackToDeviceAuth();
      }
    } catch (error) {
      setShowAuthModal(true); // Show modal if error occurs
    }
  };

  const fallbackToDeviceAuth = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Enter Device Passcode",
        disableDeviceFallback: true, // Force PIN/Pattern instead of biometric
        fallbackLabel: "Use Passcode",
      });

      if (result.success) {
        proceedNavigation();
      } else if (
        result.error === "user_cancel" ||
        result.error === "system_cancel"
      ) {
        setShowAuthModal(true); // Show unlock modal
      } else {
        setShowAuthModal(true);
      }
    } catch (error) {
      setShowAuthModal(true); // Show modal if error occurs
    }
  };

  const proceedNavigation = () => {
    setTimeout(() => {
      if (token) {
        resetAndNavigate("/(tabs)");
      } else if (newUser) {
        setNewUser(false);
        resetAndNavigate("/notification-permission");
      } else {
        resetAndNavigate("/auth");
      }
    }, 2000);
  };

  useEffect(() => {
    if (loaded) {
      if (biometricAuth) {
        setTimeout(() => {
          authenticate(); // Ensure fresh authentication every time the app starts
        }, 500); // Delay to avoid UI glitches
      } else {
        proceedNavigation();
      }
    }
  }, [loaded]);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar hidden />
      <Image
        source={require("@/assets/images/splash-screen.png")}
        style={{ width: "100%", height: "100%" }}
        resizeMode="cover"
      />

      {/* Custom Authentication Modal */}
      <Modal
        animationType="fade"
        transparent
        visible={showAuthModal}
        onRequestClose={() => BackHandler.exitApp()} // Prevent user from dismissing without action
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Fingerprint size={32} color={colors.PRIMARY} />
            <Typo size={18} fontFamily="SemiBold" style={styles.modalTitle}>
              Famto is locked
            </Typo>
            <Typo size={12} fontFamily="Regular" style={styles.modalMessage}>
              For your security, you can only use Famto when its unlocked
            </Typo>

            {/* Buttons Row */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => BackHandler.exitApp()}
              >
                <Typo fontFamily="Medium" size={14} style={styles.cancelText}>
                  Cancel
                </Typo>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.unlockButton}
                onPress={() => {
                  setShowAuthModal(false);
                  authenticate();
                }}
              >
                <Typo fontFamily="Medium" size={14} style={styles.unlockText}>
                  Unlock
                </Typo>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Main;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "transparent", // Semi-transparent background
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 300,
    height: 200,
    backgroundColor: colors.NEUTRAL700,
    paddingTop: 20,
    paddingHorizontal: 20,
    borderRadius: 40,
    alignItems: "center",
  },
  modalTitle: {
    marginBottom: 15,
    marginTop: 5,
    color: colors.WHITE,
  },
  modalMessage: {
    color: colors.WHITE,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 14,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  unlockButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  cancelText: {
    color: colors.PRIMARY,
  },
  unlockText: {
    color: colors.PRIMARY,
  },
});
