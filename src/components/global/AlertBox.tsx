import { colors } from "@/constants/theme";
import { scale } from "@/utils/styling";
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import React, { useRef, useEffect, FC } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ViewStyle,
  TextStyle,
} from "react-native";
import Typo from "../Typo";

interface AlertBoxProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title?: string;
  body: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonStyle?: ViewStyle;
  cancelButtonStyle?: ViewStyle;
  titleStyle?: TextStyle;
  bodyStyle?: TextStyle;
  buttonTextStyle?: TextStyle;
}

const AlertBox: FC<AlertBoxProps> = ({
  isVisible,
  onClose,
  onConfirm,
  title = "Alert",
  body,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmButtonStyle,
  cancelButtonStyle,
  titleStyle,
  bodyStyle,
  buttonTextStyle,
}) => {
  // Animated value for fade and scale
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  // Animation effect
  useEffect(() => {
    if (isVisible) {
      // Animate modal in
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
      // Animate modal out
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
  }, [isVisible]);

  // If not visible, return null
  if (!isVisible) return null;

  return (
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
        {title && (
          <Typo
            fontFamily="Medium"
            color={colors.NEUTRAL700}
            size={16}
            style={[styles.title, titleStyle]}
          >
            {title}
          </Typo>
        )}

        <Typo
          fontFamily="Medium"
          size={14}
          color={colors.NEUTRAL700}
          style={[styles.body, bodyStyle]}
        >
          {body}
        </Typo>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.cancelButton, cancelButtonStyle]}
            onPress={onClose}
          >
            <Typo
              color={colors.WHITE}
              fontFamily="Medium"
              size={12}
              style={buttonTextStyle}
            >
              {cancelText}
            </Typo>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.confirmButton, confirmButtonStyle]}
            onPress={onConfirm}
          >
            <Typo
              color={colors.WHITE}
              fontFamily="Medium"
              size={12}
              style={buttonTextStyle}
            >
              {confirmText}
            </Typo>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  modalContainer: {
    width: SCREEN_WIDTH * 0.8,
    backgroundColor: colors.WHITE,
    borderRadius: scale(10),
    padding: scale(20),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    marginBottom: scale(20),
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
