import Button from "@/components/Button";
import Header from "@/components/Header";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, radius, spacingX } from "@/constants/theme";
import { useAudioCleanup } from "@/hooks/useAudio";
import { getReferralCode } from "@/service/userService";
import { referralDetails } from "@/utils/defaultData";
import { playOrStopSound } from "@/utils/helpers";
import { scale, verticalScale } from "@/utils/styling";
import { useQuery } from "@tanstack/react-query";
import * as Clipboard from "expo-clipboard";
import {
  Clipboard as ClipBoardIcon,
  ShareNetwork,
} from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  ToastAndroid,
  View,
} from "react-native";

type ReferralProps = {
  appLink: string;
  referralCode: string;
};

const Referral = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [enabled, setEnabled] = useState<boolean>(false);
  const [referralCode, setReferralCode] = useState<string>("");

  const { data, isLoading } = useQuery<ReferralProps>({
    queryKey: ["referral", enabled],
    queryFn: getReferralCode,
    enabled,
  });

  useAudioCleanup();

  useEffect(() => {
    if (data?.referralCode) {
      setReferralCode(data.referralCode);
    }
  }, [data]);

  const link = `https://famto.in/ref/customer-app?code=${referralCode}`;

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(link);
    ToastAndroid.showWithGravity(
      "Link copied",
      ToastAndroid.LONG,
      ToastAndroid.CENTER
    );
  };

  const shareReferral = async () => {
    try {
      await Share.share({
        message: link,
        title: "Invite Friends & Earn Rewards!",
      });
    } catch (error) {
      console.error("Error sharing referral link:", error);
      ToastAndroid.showWithGravity(
        "Unable to share link",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    }
  };

  return (
    <ScreenWrapper>
      <Header
        title="Refer & Earn"
        showRightIcon
        icon={
          isPlaying
            ? require("@/assets/icons/volume-slash.webp")
            : require("@/assets/icons/volume-high.webp")
        }
        onPress={() =>
          playOrStopSound(
            "https://firebasestorage.googleapis.com/v0/b/famto-aa73e.appspot.com/o/voices%2FReferandEarn.mp3?alt=media&token=c4eba3f0-4811-457a-b6e8-88726693c38d",
            isPlaying,
            setIsPlaying
          )
        }
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Top Section */}
        <View style={styles.topContainer}>
          <Image
            source={require("@/assets/images/loyalty-point.webp")}
            style={styles.image}
          />

          <Typo
            size={15}
            fontFamily="SemiBold"
            color={colors.NEUTRAL900}
            style={styles.earnText}
          >
            Earn 50 Famto cash for each friend you refer!
          </Typo>
        </View>

        {/* Referral Steps */}
        <View style={styles.stepsContainer}>
          {referralDetails?.map((detail, index) => (
            <View
              key={index}
              style={[
                styles.stepWrapper,
                {
                  alignItems:
                    index === referralDetails.length - 1
                      ? "flex-start"
                      : "center",
                },
              ]}
            >
              {/* Number Circle */}
              <View style={styles.circle}>
                <Typo size={18} fontFamily="Medium" color={colors.WHITE}>
                  {index + 1}
                </Typo>
              </View>

              {/* Vertical Line */}
              {index !== referralDetails.length - 1 && (
                <View style={styles.line} />
              )}

              {/* Step Description */}
              <Typo size={13} color={colors.NEUTRAL900} style={styles.stepText}>
                {detail}
              </Typo>
            </View>
          ))}
        </View>

        <View
          style={[
            styles.codeContainer,
            { display: data?.referralCode ? "flex" : "none" },
          ]}
        >
          <Typo size={13} style={{ flex: 1 }}>
            Your code is: {data?.referralCode}
          </Typo>

          <View style={{ flexDirection: "row", gap: spacingX._15 }}>
            <Pressable onPress={shareReferral} style={styles.actionBtn}>
              <ShareNetwork size={scale(24)} weight="fill" />
            </Pressable>

            <Pressable onPress={copyToClipboard} style={styles.actionBtn}>
              <ClipBoardIcon
                size={scale(24)}
                weight="fill"
                color={colors.NEUTRAL500}
              />
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <View style={styles.btnContainer}>
        {referralCode ? (
          <Button title="Invite friends" onPress={shareReferral} />
        ) : (
          <Button
            title="Get the link"
            onPress={() => setEnabled(true)}
            isLoading={isLoading}
          />
        )}
      </View>
    </ScreenWrapper>
  );
};

export default Referral;

const styles = StyleSheet.create({
  topContainer: {
    alignItems: "center",
  },
  image: {
    height: verticalScale(250),
    width: scale(250),
    resizeMode: "cover",
  },
  earnText: {
    width: "80%",
    textAlign: "center",
    paddingTop: verticalScale(15),
  },
  stepsContainer: {
    marginHorizontal: scale(20),
    marginTop: verticalScale(10),
  },
  stepWrapper: {
    flexDirection: "row",
    gap: spacingX._15,
    marginBottom: verticalScale(30),
  },
  circle: {
    height: verticalScale(40),
    width: scale(40),
    backgroundColor: colors.PRIMARY,
    borderRadius: 99,
    justifyContent: "center",
    alignItems: "center",
  },
  line: {
    height: verticalScale(50),
    width: 1,
    backgroundColor: colors.NEUTRAL300,
    position: "absolute",
    left: scale(20),
    top: verticalScale(40),
  },
  stepText: {
    width: "80%",
  },
  btnContainer: {
    marginTop: "auto",
    paddingVertical: verticalScale(20),
    paddingHorizontal: scale(20),
    marginBottom: Platform.OS === "ios" ? verticalScale(10) : 0,
  },
  codeContainer: {
    backgroundColor: colors.NEUTRAL200,
    marginHorizontal: scale(20),
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(12),
    borderRadius: radius._10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(10),
  },
  actionBtn: {
    paddingHorizontal: scale(5),
    paddingVertical: verticalScale(4),
  },
});
