import { View, Pressable, Alert, Platform, ToastAndroid } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { CaretLeft } from "phosphor-react-native";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { router, useLocalSearchParams } from "expo-router";
import Typo from "@/components/Typo";
import Button from "@/components/Button";
import { OtpInput } from "react-native-otp-entry";
import { StyleSheet } from "react-native";
import { signIn } from "@/service/authService";
import { useSafeLocation } from "@/utils/helpers";
import auth from "@react-native-firebase/auth";

const VerifyOTP = () => {
  const [count, setCount] = useState(30);
  const [otp, setOtp] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    verificationId,
    phoneNumber,
  }: { verificationId: string; phoneNumber: string } = useLocalSearchParams();

  const { latitude, longitude } = useSafeLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      if (count > 0) {
        setCount((prev) => prev - 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [count]);

  const handleVerifyOTP = async (otp: string) => {
    // if (!verificationId) {
    // if (Platform.OS === "android") {
    //         ToastAndroid.showWithGravity(
    //           "Verification ID is missing. Please try again.",
    //           ToastAndroid.SHORT,
    //           ToastAndroid.CENTER
    //         );
    //       } else {
    //         Alert.alert("Error", "Verification ID is missing. Please try again.");
    //       }

    setIsLoading(true);
    try {
      // const credential = auth.PhoneAuthProvider.credential(verificationId, otp);
      // const userCredential = await auth().signInWithCredential(credential);

      // if (userCredential.user) {
      const payload = {
        phoneNumber: phoneNumber.toString(),
        latitude: latitude || 0,
        longitude: longitude || 0,
        platform: Platform.OS,
      };

      await signIn(payload);
      // }
    } catch (error: any) {
      if (Platform.OS === "android") {
        ToastAndroid.showWithGravity(
          "Something went wrong. Please try again.",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
      } else {
        Alert.alert(
          "Authentication Failed",
          "Something went wrong. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendSMS = async () => {
    try {
      await auth().signInWithPhoneNumber(phoneNumber);
      setCount(30);
      if (Platform.OS === "android") {
        ToastAndroid.showWithGravity(
          "OTP sent again!",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
      } else {
        Alert.alert("Success", "OTP sent again!");
      }
    } catch (error: any) {
      // Alert.alert("Error", error.message);
    }
  };

  return (
    <ScreenWrapper>
      <View style={{ marginHorizontal: 10 }}>
        <Pressable onPress={() => router.back()} style={{ padding: 10 }}>
          <CaretLeft color={colors.NEUTRAL800} size={verticalScale(24)} />
        </Pressable>
      </View>

      <View
        style={{ marginHorizontal: 20, marginTop: verticalScale(30), flex: 1 }}
      >
        <Typo size={16} color={colors.PRIMARY} fontFamily="Medium">
          Verify your account
        </Typo>
        <View
          style={{
            marginTop: verticalScale(16),
            marginBottom: verticalScale(32),
          }}
        >
          <Typo size={14}>
            Enter the OTP that we have sent to your mobile number
            <Typo
              size={14}
              fontWeight={"700"}
              color={colors.NEUTRAL700}
              style={{ paddingLeft: 4 }}
            >
              {"  "}
              +91 {phoneNumber}
            </Typo>
          </Typo>
        </View>

        <OtpInput
          numberOfDigits={6}
          focusColor={colors.PRIMARY}
          autoFocus
          hideStick
          blurOnFilled
          type="numeric"
          focusStickBlinkingDuration={500}
          onFilled={(text) => {
            setOtp(text);
            handleVerifyOTP(text);
          }}
          textInputProps={{
            accessibilityLabel: "One-Time Password",
          }}
          theme={{
            containerStyle: styles.otpContainer,
          }}
        />
      </View>

      <View
        style={{
          marginBottom: verticalScale(40),
          marginHorizontal: 20,
          gap: spacingY._10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacingX._5,
            alignSelf: "center",
          }}
        >
          <Typo size={13}>Didn't receive the OTP?</Typo>
          {count > 0 ? (
            <Typo size={13} color={colors.PRIMARY} fontFamily="Medium">
              Resend SMS in {count}s
            </Typo>
          ) : (
            <Pressable onPress={handleResendSMS}>
              <Typo size={13} color={colors.PRIMARY} fontFamily="Medium">
                Resend SMS
              </Typo>
            </Pressable>
          )}
        </View>

        <Button
          title="Verify and Continue"
          onPress={() => handleVerifyOTP(otp)}
          isLoading={isLoading}
        />
      </View>
    </ScreenWrapper>
  );
};

export default VerifyOTP;

const styles = StyleSheet.create({
  otpContainer: { marginTop: verticalScale(10) },
});
