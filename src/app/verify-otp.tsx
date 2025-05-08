import { View, Pressable, Alert, Platform, ToastAndroid } from "react-native";
import React, { useEffect, useState, useRef } from "react";
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
import { useShowAlert } from "@/hooks/useShowAlert";

type SearchParam = {
  verificationId: string;
  phoneNumber: string;
  referralCode?: string;
};

const VerifyOTP = () => {
  const [count, setCount] = useState(30);
  const [otp, setOtp] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [otpVerificationId, setVerificationId] = useState<string>("");
  const otpVerified = useRef(false);

  const { verificationId, phoneNumber, referralCode }: SearchParam =
    useLocalSearchParams();

  const { latitude, longitude } = useSafeLocation();
  const { showAlert } = useShowAlert();

  useEffect(() => {
    setVerificationId(verificationId);

    // Set up SMS Retriever API listener for auto-retrieval
    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (user && !otpVerified.current) {
        otpVerified.current = true;
        setOtp("123456");
        handleSuccessfulAuth();
      }
    });

    return () => unsubscribe();
  }, [verificationId]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (count > 0) {
        setCount((prev) => prev - 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [count]);

  const handleSuccessfulAuth = async () => {
    try {
      const payload = {
        phoneNumber: phoneNumber.toString(),
        latitude: latitude || 0,
        longitude: longitude || 0,
        platform: Platform.OS,
        referralCode,
      };

      await signIn(payload);
    } catch (error) {
      showAlert("Error during sign-in process. Please try again.");
      otpVerified.current = false;
    }
  };

  const handleVerifyOTP = async (otpCode: string) => {
    if (otpVerified.current) return;

    if (!otpVerificationId) {
      showAlert("Verification ID is missing. Please try again.");
      return;
    }

    setIsLoading(true);
    try {
      // let verificationIdToUse;
      // try {
      //   const parsedData = JSON.parse(otpVerificationId);
      //   verificationIdToUse =
      //     parsedData._verificationId || parsedData.verificationId;
      // } catch (e) {
      //   // If parsing fails, use the value directly
      //   verificationIdToUse = otpVerificationId;
      // }

      // if (!verificationIdToUse) {
      //   throw new Error("Invalid verification ID format");
      // }

      // const credential = auth.PhoneAuthProvider.credential(
      //   verificationIdToUse,
      //   otpCode
      // );

      // const userCredential = await auth().signInWithCredential(credential);

      // if (userCredential.user) {
      //   otpVerified.current = true;
      //   await handleSuccessfulAuth();
      // }

      await handleSuccessfulAuth();
    } catch (error: any) {
      let errorMessage = "Something went wrong. Please try again.";

      switch (error.code) {
        case "auth/invalid-verification-code":
          errorMessage = "Incorrect OTP entered. Please try again.";
          break;
        case "auth/invalid-verification-id":
          errorMessage = "OTP has expired. Please request a new one.";
          break;
        case "auth/code-expired":
          errorMessage = "OTP expired. Please request a new one.";
          break;
        case "auth/user-disabled":
          errorMessage =
            "This phone number has been disabled. Please contact support.";
          break;
        case "auth/network-request-failed":
          errorMessage =
            "Network error. Please check your internet connection.";
          break;
        default:
          errorMessage = "Something went wrong. Please try again.";
          break;
      }

      showAlert(errorMessage);
      otpVerified.current = false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendSMS = async () => {
    try {
      const fullPhoneNumber = `+91${phoneNumber}`;
      otpVerified.current = false;

      const confirmation = await auth().signInWithPhoneNumber(fullPhoneNumber);

      if (confirmation.verificationId) {
        setVerificationId(JSON.stringify(confirmation));
        setCount(30);
        showAlert("OTP sent again!");
      }
    } catch (error: any) {
      let errorMessage = "Something went wrong. Please try again.";

      switch (error.code) {
        case "auth/invalid-phone-number":
          errorMessage = "Invalid phone number. Please enter a valid number.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many requests. Please try again later.";
          break;
        case "auth/quota-exceeded":
          errorMessage =
            "OTP verification limit exceeded. Please try again later.";
          break;
        case "auth/user-disabled":
          errorMessage =
            "This phone number has been disabled. Please contact support.";
          break;
        case "auth/sms-quota-exceeded":
          errorMessage = "SMS quota exceeded. Please try again later.";
          break;
        case "auth/invalid-verification-code":
          errorMessage = "Incorrect OTP entered. Please try again.";
          break;
        case "auth/invalid-verification-id":
          errorMessage = "OTP has expired. Please request a new one.";
          break;
        case "auth/network-request-failed":
          errorMessage =
            "Network error. Please check your internet connection.";
          break;
        case "auth/code-expired":
          errorMessage = "OTP expired. Please request a new one.";
          break;
        default:
          errorMessage = "Something went wrong. Please try again.";
          break;
      }

      showAlert(errorMessage);
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
          secureTextEntry={true}
          type="numeric"
          placeholder={otp}
          focusStickBlinkingDuration={500}
          onTextChange={(text) => setOtp(text)}
          onFilled={(text) => {
            if (!otpVerified.current && !isLoading) {
              handleVerifyOTP(text);
            }
          }}
          textInputProps={{
            accessibilityLabel: "One-Time Password",
            secureTextEntry: true,
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
          onPress={() => !otpVerified.current && handleVerifyOTP(otp)}
          isLoading={isLoading}
        />
      </View>
    </ScreenWrapper>
  );
};

export default VerifyOTP;

const styles = StyleSheet.create({
  otpContainer: {
    marginTop: verticalScale(10),
  },
});
