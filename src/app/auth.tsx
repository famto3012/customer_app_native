import Button from "@/components/Button";
import Input from "@/components/Input";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, radius, spacingX } from "@/constants/theme";
import { useShowAlert } from "@/hooks/useShowAlert";
import { fetchVisibilityOfLoyaltyOrReferral } from "@/service/userService";
import { requestLocationPermission } from "@/utils/helpers";
import { resetAndNavigate } from "@/utils/navigation";
import { scale, verticalScale } from "@/utils/styling";
import auth from "@react-native-firebase/auth";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Keyboard, Pressable, View } from "react-native";

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

      // Using verifyPhoneNumber for manual OTP verification flow
      const unsubscribe = auth()
        .verifyPhoneNumber(fullPhoneNumber, 60, true)
        .on("state_changed", (phoneAuthSnapshot) => {
          switch (phoneAuthSnapshot.state) {
            case auth.PhoneAuthState.CODE_SENT: // Code has been sent
              setIsGeneratingOTP(false);

              router.push({
                pathname: "/verify-otp",
                params: {
                  phoneNumber: phoneNumberRef.current,
                  referralCode: referralStatus?.status ? referral : "",
                  verificationId: phoneAuthSnapshot.verificationId,
                },
              });
              break;

            case auth.PhoneAuthState.AUTO_VERIFIED: // Auto verification detected
              console.log(
                "Auto verification triggered but ignored to enforce manual entry."
              );
              // DO NOT SIGN IN HERE - force manual OTP input
              break;

            case auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT: // Timeout
              console.log(
                "Auto-retrieval timeout reached. Manual entry required."
              );
              break;

            case auth.PhoneAuthState.ERROR: // Verification failed
              console.log("Verification failed:", phoneAuthSnapshot.error);
              showAlert("Verification failed. Please try again.");
              setIsGeneratingOTP(false);
              break;
          }
        });
    } catch (error) {
      showAlert("Something went wrong. Please try again.");
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
      <Pressable
        onPress={Keyboard.dismiss}
        accessible={false}
        style={{ flex: 1 }}
      >
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
      </Pressable>
    </ScreenWrapper>
  );
};

export default Auth;
