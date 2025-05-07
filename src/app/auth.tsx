import { ActivityIndicator, Pressable, View } from "react-native";
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
import auth from "@react-native-firebase/auth";
import { useShowAlert } from "@/hooks/useShowAlert";
import { useQuery } from "@tanstack/react-query";
import { fetchVisibilityOfLoyaltyOrReferral } from "@/service/userService";

const Auth = () => {
  const phoneNumberRef = useRef<string>("");
  const [referral, setReferral] = useState<string>("");
  const [showReferral, setShowReferral] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGeneratingOTP, setIsGeneratingOTP] = useState<boolean>(false);

  const { showSkip, code } = useLocalSearchParams();
  const { showAlert } = useShowAlert();

  useEffect(() => {
    if (code) {
      setShowReferral(true);
      setReferral(code as string);
    }
  }, [code]);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const { data: referralStatus } = useQuery({
    queryKey: ["get-visibility"],
    queryFn: () => fetchVisibilityOfLoyaltyOrReferral("referral"),
    refetchOnWindowFocus: true,
  });

  const sendOTP = async () => {
    if (!/^\d{10}$/.test(phoneNumberRef.current)) {
      showAlert("Please enter a valid phone number");
      return;
    }

    try {
      setIsGeneratingOTP(true);

      const fullPhoneNumber = `+91${phoneNumberRef.current}`;

      // const confirmation = await auth().signInWithPhoneNumber(fullPhoneNumber);

      // if (confirmation.verificationId) {
      //   router.push({
      //     pathname: "/verify-otp",
      //     params: {
      //       phoneNumber: phoneNumberRef.current,
      //       referralCode: referralStatus?.status ? referral : "",
      //       verificationId: JSON.stringify(confirmation),
      //     },
      //   });
      // }

      router.push({
        pathname: "/verify-otp",
        params: {
          phoneNumber: phoneNumberRef.current,
          referralCode: referralStatus?.status ? referral : "",
          verificationId: "",
        },
      });
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
    } finally {
      setIsGeneratingOTP(false);
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

        {referralStatus?.status && (
          <View>
            {showReferral ? (
              <View
                style={{ flexDirection: "row", marginTop: verticalScale(20) }}
              >
                <Input
                  placeholder="Referral code"
                  onChangeText={(value: string) => setReferral(value)}
                  value={referral}
                />
              </View>
            ) : (
              <Pressable
                onPress={() => setShowReferral(true)}
                style={{ marginTop: verticalScale(20) }}
              >
                <Typo
                  size={16}
                  color={colors.PRIMARY}
                  fontFamily="SemiBold"
                  style={{ textDecorationLine: "underline" }}
                >
                  Have a referral code?
                </Typo>
              </Pressable>
            )}
          </View>
        )}
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

        <Button
          title="Continue"
          onPress={sendOTP}
          isLoading={isGeneratingOTP}
        />
      </View>
    </ScreenWrapper>
  );
};

export default Auth;
