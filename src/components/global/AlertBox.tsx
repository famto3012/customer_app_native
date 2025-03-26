import { colors } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import React, { useRef, useEffect, FC } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from "react-native";
import Typo from "../Typo";
import { Portal } from "react-native-paper";
import { useData } from "@/context/DataContext";

interface AlertBoxProps {
  onConfirm: () => void;
  isLoading?: boolean;
  confirmButtonStyle?: ViewStyle;
  cancelButtonStyle?: ViewStyle;
}

const AlertBox: FC<AlertBoxProps> = ({
  onConfirm,
  isLoading,
  confirmButtonStyle,
  cancelButtonStyle,
}) => {
  // Animated value for fade and scale
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  const { showAlert, setShowAlert, alertData, setAlertData } = useData();

  useEffect(() => {
    if (showAlert) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showAlert]);

  if (!showAlert) return null;

  return (
    <Portal>
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {alertData?.title && (
            <Typo
              fontFamily="Medium"
              color={colors.NEUTRAL700}
              size={16}
              style={styles.title}
            >
              {alertData.title}
            </Typo>
          )}

          <Typo
            fontFamily="Medium"
            size={13}
            color={colors.NEUTRAL700}
            style={styles.body}
          >
            {alertData.body}
          </Typo>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.cancelButton, cancelButtonStyle]}
              onPress={() => {
                setShowAlert(false);
                setAlertData({
                  title: "",
                  body: "",
                  cancelText: "",
                  confirmText: "",
                });
              }}
            >
              <Typo color={colors.NEUTRAL800} fontFamily="Medium" size={12}>
                {alertData.cancelText}
              </Typo>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.confirmButton, confirmButtonStyle]}
              onPress={onConfirm}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={colors.WHITE} />
              ) : (
                <Typo color={colors.WHITE} fontFamily="Medium" size={12}>
                  {alertData.confirmText}
                </Typo>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Portal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: Math.min(SCREEN_WIDTH * 0.8, scale(400)),
    backgroundColor: colors.WHITE,
    borderRadius: scale(10),
    padding: scale(20),
    alignItems: "center",
  },
  title: {
    paddingBottom: scale(15),
  },
  body: {
    textAlign: "center",
    paddingBottom: verticalScale(5),
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: scale(20),
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.NEUTRAL300,
    padding: scale(10),
    borderRadius: scale(10),
    marginRight: scale(10),
    alignItems: "center",
  },
  confirmButton: {
    flex: 1,
    backgroundColor: colors.PRIMARY,
    padding: scale(10),
    borderRadius: scale(10),
    alignItems: "center",
  },
});

export default AlertBox;
