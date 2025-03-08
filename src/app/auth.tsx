// import { ActivityIndicator, Alert, Pressable, View } from "react-native";
// import ScreenWrapper from "@/components/ScreenWrapper";
// import Typo from "@/components/Typo";
// import Button from "@/components/Button";
// import { scale, verticalScale } from "@/utils/styling";
// import { colors, radius, spacingX } from "@/constants/theme";
// import Input from "@/components/Input";
// import { useEffect, useRef, useState } from "react";
// import { router, useLocalSearchParams } from "expo-router";
// import { requestLocationPermission } from "@/utils/helpers";
// import { resetAndNavigate } from "@/utils/navigation";

// const Auth = () => {
//   const phoneNumberRef = useRef<string>("");

//   const [isLoading, setIsLoading] = useState<boolean>(false);

//   const { showSkip } = useLocalSearchParams();

//   useEffect(() => {
//     requestLocationPermission();
//   }, []);

//   const sendOTP = () => {
//     if (phoneNumberRef.current.length !== 10) {
//       Alert.alert("Error", "Please enter a valid phone number");
//       return;
//     }

//     router.push({
//       pathname: "/verify-otp",
//       params: { phoneNumber: phoneNumberRef.current },
//     });
//   };

//   const handleSkip = async () => {
//     setIsLoading(true);
//     const permission = await requestLocationPermission();

//     permission
//       ? resetAndNavigate("/(tabs)")
//       : router.push("/screens/initialLocationMark");

//     setIsLoading(false);
//   };

//   return (
//     <ScreenWrapper>
//       <View
//         style={{
//           flexDirection: "row",
//           justifyContent: "flex-end",
//           marginEnd: scale(20),
//           display: Boolean(showSkip) ? "none" : "flex",
//         }}
//       >
//         <Pressable
//           onPress={handleSkip}
//           style={{
//             backgroundColor: colors.PRIMARY,
//             paddingVertical: verticalScale(2),
//             paddingHorizontal: scale(16),
//             borderRadius: radius._30,
//           }}
//         >
//           {isLoading ? (
//             <ActivityIndicator size="small" color={colors.WHITE} />
//           ) : (
//             <Typo size={14} color={colors.WHITE}>
//               Skip
//             </Typo>
//           )}
//         </Pressable>
//       </View>

//       <View
//         style={{
//           flex: 1,
//           marginHorizontal: 20,
//           marginTop: verticalScale(20),
//         }}
//       >
//         <Typo size={16} fontFamily="Medium" color={colors.PRIMARY}>
//           Login or Signup
//         </Typo>
//         <Typo
//           size={14}
//           style={{
//             marginTop: verticalScale(16),
//             marginBottom: verticalScale(32),
//           }}
//         >
//           Enter your phone number and we will send you a confirmation code to
//           your number
//         </Typo>

//         <View
//           style={{
//             flexDirection: "row",
//             gap: spacingX._15,
//             marginTop: verticalScale(10),
//           }}
//         >
//           <View
//             style={{
//               flexDirection: "row",
//               height: verticalScale(45),
//               alignItems: "center",
//               borderWidth: 1,
//               borderColor: colors.NEUTRAL300,
//               borderRadius: radius._10,
//               borderCurve: "continuous",
//               paddingHorizontal: spacingX._10,
//             }}
//           >
//             <Typo size={13}>🇮🇳 +91</Typo>
//           </View>

//           <Input
//             placeholder="0000000000"
//             keyboardType="number-pad"
//             maxLength={10}
//             onChangeText={(value) => (phoneNumberRef.current = value)}
//           />
//         </View>
//       </View>

//       <View
//         style={{
//           marginBottom: verticalScale(40),
//           marginHorizontal: verticalScale(24),
//         }}
//       >
//         <Typo size={12} style={{ textAlign: "center" }}>
//           By clicking continue you are agreeing to the
//         </Typo>
//         <View
//           style={{
//             marginBottom: verticalScale(12),
//             flexDirection: "row",
//             gap: 10,
//             alignSelf: "center",
//           }}
//         >
//           <Pressable>
//             <Typo size={12} color={colors.PRIMARY}>
//               Terms of Service
//             </Typo>
//           </Pressable>

//           <Typo size={12}>and</Typo>

//           <Pressable>
//             <Typo size={12} color={colors.PRIMARY}>
//               Privacy Policy
//             </Typo>
//           </Pressable>
//         </View>

//         <Button title="Continue" onPress={sendOTP} />
//       </View>
//     </ScreenWrapper>
//   );
// };

// export default Auth;

// =========================
// =========================
// =========================

import { ActivityIndicator, Alert, Pressable, View } from "react-native";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import Button from "@/components/Button";
import { scale, verticalScale } from "@/utils/styling";
import { colors, radius, spacingX } from "@/constants/theme";
import Input from "@/components/Input";
import { useEffect, useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { requestLocationPermission } from "@/utils/helpers";
import { resetAndNavigate } from "@/utils/navigation";
import { useOTPStore } from "@/store/useOTP";
import auth from "@react-native-firebase/auth";

const Auth = () => {
  const phoneNumberRef = useRef<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { showSkip } = useLocalSearchParams();

  // UPDATED: Zustand OTP Store
  const { setupRecaptcha, setVerificationId } = useOTPStore();

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const sendOTP = async () => {
    if (phoneNumberRef.current.length !== 10) {
      Alert.alert("Error", "Please enter a valid phone number");
      return;
    }

    try {
      setIsLoading(true); // Show loading indicator
      const fullPhoneNumber = `+91${phoneNumberRef.current}`; // UPDATED: Format phone number
      await setupRecaptcha(fullPhoneNumber); // UPDATED: Trigger Firebase phone auth
      setIsLoading(false);

      // Navigate to OTP screen and pass phoneNumber
      router.push({
        pathname: "/verify-otp",
        params: { phoneNumber: phoneNumberRef.current },
      });
    } catch (error: any) {
      Alert.alert("Error", error.message);
      setIsLoading(false);
    }
  };

  const handleSkip = async () => {
    setIsLoading(true);
    const permission = await requestLocationPermission();

    permission
      ? resetAndNavigate("/(tabs)")
      : router.push("/screens/initialLocationMark");

    setIsLoading(false);
  };

  return (
    <ScreenWrapper>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          marginEnd: scale(20),
          display: Boolean(showSkip) ? "none" : "flex",
        }}
      >
        <Pressable
          onPress={handleSkip}
          style={{
            backgroundColor: colors.PRIMARY,
            paddingVertical: verticalScale(2),
            paddingHorizontal: scale(16),
            borderRadius: radius._30,
          }}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.WHITE} />
          ) : (
            <Typo size={14} color={colors.WHITE}>
              Skip
            </Typo>
          )}
        </Pressable>
      </View>

      <View
        style={{
          flex: 1,
          marginHorizontal: 20,
          marginTop: verticalScale(20),
        }}
      >
        <Typo size={16} fontFamily="Medium" color={colors.PRIMARY}>
          Login or Signup
        </Typo>
        <Typo
          size={14}
          style={{
            marginTop: verticalScale(16),
            marginBottom: verticalScale(32),
          }}
        >
          Enter your phone number and we will send you a confirmation code to
          your number
        </Typo>

        <View
          style={{
            flexDirection: "row",
            gap: spacingX._15,
            marginTop: verticalScale(10),
          }}
        >
          <View
            style={{
              flexDirection: "row",
              height: verticalScale(45),
              alignItems: "center",
              borderWidth: 1,
              borderColor: colors.NEUTRAL300,
              borderRadius: radius._10,
              borderCurve: "continuous",
              paddingHorizontal: spacingX._10,
            }}
          >
            <Typo size={13}>🇮🇳 +91</Typo>
          </View>

          <Input
            placeholder="0000000000"
            keyboardType="number-pad"
            maxLength={10}
            onChangeText={(value) => (phoneNumberRef.current = value)}
          />
        </View>
      </View>

      <View
        style={{
          marginBottom: verticalScale(40),
          marginHorizontal: verticalScale(24),
        }}
      >
        <Typo size={12} style={{ textAlign: "center" }}>
          By clicking continue you are agreeing to the
        </Typo>
        <View
          style={{
            marginBottom: verticalScale(12),
            flexDirection: "row",
            gap: 10,
            alignSelf: "center",
          }}
        >
          <Pressable>
            <Typo size={12} color={colors.PRIMARY}>
              Terms of Service
            </Typo>
          </Pressable>

          <Typo size={12}>and</Typo>

          <Pressable>
            <Typo size={12} color={colors.PRIMARY}>
              Privacy Policy
            </Typo>
          </Pressable>
        </View>

        <Button title="Continue" onPress={sendOTP} isLoading={isLoading} />
      </View>
    </ScreenWrapper>
  );
};

export default Auth;
