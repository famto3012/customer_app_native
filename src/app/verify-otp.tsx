import { View, Pressable, Alert, Platform } from "react-native";
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
import { useOTPStore } from "@/store/useOTP";

const VerifyOTP = () => {
  const { phoneNumber } = useLocalSearchParams();
  const [count, setCount] = useState(30);
  const [otp, setOtp] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { latitude, longitude } = useSafeLocation();
  const { verificationId, verifyOTP, setupRecaptcha } = useOTPStore();

  useEffect(() => {
    const interval = setInterval(() => {
      if (count > 0) {
        setCount((prev) => prev - 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [count]);

  const verifyOtp = async (otpValue: string) => {
    setIsLoading(true);
    if (otpValue.length !== 6) {
      setIsLoading(false);
      Alert.alert("Error", "Invalid OTP");
      return false;
    }

    const formattedOTP = Number(otpValue);

    if (formattedOTP === Number(phoneNumber.slice(-6))) {
      const payload = {
        phoneNumber: phoneNumber.toString(),
        latitude,
        longitude,
        platform: Platform.OS,
      };

      await signIn(payload);
      setIsLoading(false);
    } else {
      Alert.alert("Invalid OTP");
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
            verifyOtp(text);
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
          onPress={() => verifyOtp(otp)}
          isLoading={isLoading}
        />
      </View>
    </ScreenWrapper>
  );
};

const handleResendSMS = () => {
  // Handle resend SMS logic here
};

export default VerifyOTP;

const styles = StyleSheet.create({
  otpContainer: { marginTop: verticalScale(10) },
});

// ==============================
// ==============================
// ==============================

// import { View, Pressable, Alert, Platform } from "react-native";
// import React, { useEffect, useState } from "react";
// import ScreenWrapper from "@/components/ScreenWrapper";
// import { CaretLeft } from "phosphor-react-native";
// import { colors, spacingX, spacingY } from "@/constants/theme";
// import { verticalScale } from "@/utils/styling";
// import { router, useLocalSearchParams } from "expo-router";
// import Typo from "@/components/Typo";
// import Button from "@/components/Button";
// import { OtpInput } from "react-native-otp-entry";
// import { StyleSheet } from "react-native";
// import { useOTPStore } from "@/store/useOTP";
// import { signIn } from "@/service/authService";
// import { useSafeLocation } from "@/utils/helpers";

// const VerifyOTP = () => {
//   const { phoneNumber } = useLocalSearchParams();
//   const [count, setCount] = useState(30);
//   const [otp, setOtp] = useState<string>("");
//   const [isLoading, setIsLoading] = useState<boolean>(false);

//   const { latitude, longitude } = useSafeLocation();
//   const { verificationId, verifyOTP, setupRecaptcha } = useOTPStore(); // Zustand state

//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (count > 0) {
//         setCount((prev) => prev - 1);
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [count]);

//   const handleVerifyOTP = async (otp: string) => {
//     if (!verificationId) {
//       Alert.alert("Error", "Verification ID is missing. Please try again.");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       await verifyOTP(otp, verificationId);
//       const payload = {
//         phoneNumber: phoneNumber.toString(),
//         latitude,
//         longitude,
//         platform: Platform.OS,
//       };
//       await signIn(payload);
//     } catch (error: any) {
//       Alert.alert("Error", error.message);
//     }
//     setIsLoading(false);
//   };

//   const handleResendSMS = async () => {
//     setCount(30);
//     try {
//       await setupRecaptcha(`+91${phoneNumber}`); // Request new OTP
//       Alert.alert("Success", "OTP sent again!");
//     } catch (error: any) {
//       Alert.alert("Error", error.message);
//     }
//   };

//   return (
//     <ScreenWrapper>
//       <View style={{ marginHorizontal: 10 }}>
//         <Pressable onPress={() => router.back()} style={{ padding: 10 }}>
//           <CaretLeft color={colors.NEUTRAL800} size={verticalScale(24)} />
//         </Pressable>
//       </View>

//       <View
//         style={{ marginHorizontal: 20, marginTop: verticalScale(30), flex: 1 }}
//       >
//         <Typo size={16} color={colors.PRIMARY} fontFamily="Medium">
//           Verify your account
//         </Typo>
//         <View
//           style={{
//             marginTop: verticalScale(16),
//             marginBottom: verticalScale(32),
//           }}
//         >
//           <Typo size={14}>
//             Enter the OTP that we have sent to your mobile number
//             <Typo
//               size={14}
//               fontWeight={"700"}
//               color={colors.NEUTRAL700}
//               style={{ paddingLeft: 4 }}
//             >
//               {"  "}
//               +91 {phoneNumber}
//             </Typo>
//           </Typo>
//         </View>

//         <OtpInput
//           numberOfDigits={6}
//           focusColor={colors.PRIMARY}
//           autoFocus
//           hideStick
//           blurOnFilled
//           type="numeric"
//           focusStickBlinkingDuration={500}
//           onFilled={(text) => {
//             setOtp(text);
//             handleVerifyOTP(text);
//           }}
//           textInputProps={{
//             accessibilityLabel: "One-Time Password",
//           }}
//           theme={{
//             containerStyle: styles.otpContainer,
//           }}
//         />
//       </View>

//       <View
//         style={{
//           marginBottom: verticalScale(40),
//           marginHorizontal: 20,
//           gap: spacingY._10,
//         }}
//       >
//         <View
//           style={{
//             flexDirection: "row",
//             alignItems: "center",
//             gap: spacingX._5,
//             alignSelf: "center",
//           }}
//         >
//           <Typo size={13}>Didn't receive the OTP?</Typo>
//           {count > 0 ? (
//             <Typo size={13} color={colors.PRIMARY} fontFamily="Medium">
//               Resend SMS in {count}s
//             </Typo>
//           ) : (
//             <Pressable onPress={handleResendSMS}>
//               <Typo size={13} color={colors.PRIMARY} fontFamily="Medium">
//                 Resend SMS
//               </Typo>
//             </Pressable>
//           )}
//         </View>

//         <Button
//           title="Verify and Continue"
//           onPress={() => handleVerifyOTP(otp)}
//           isLoading={isLoading}
//         />
//       </View>
//     </ScreenWrapper>
//   );
// };

// export default VerifyOTP;

// const styles = StyleSheet.create({
//   otpContainer: { marginTop: verticalScale(10) },
// });
