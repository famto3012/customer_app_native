import Header from "@/components/Header";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, radius, spacingX } from "@/constants/theme";
import { useAudioCleanup } from "@/hooks/useAudio";
import { loyaltyDetails } from "@/utils/defaultData";
import { playOrStopSound } from "@/utils/helpers";
import { scale, verticalScale } from "@/utils/styling";
import { useState } from "react";
import { Image, Platform, StyleSheet, View } from "react-native";

const LoyaltyPoints = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  useAudioCleanup();

  return (
    <ScreenWrapper>
      <Header
        title="Loyalty Points"
        showRightIcon
        icon={
          isPlaying
            ? require("@/assets/icons/volume-slash.webp")
            : require("@/assets/icons/volume-high.webp")
        }
        onPress={() =>
          playOrStopSound(
            "https://firebasestorage.googleapis.com/v0/b/famto-aa73e.appspot.com/o/voices%2FLoyality.mp3?alt=media&token=8adcd03b-cf3a-4cca-b02c-2a46f08da406",
            isPlaying,
            setIsPlaying
          )
        }
      />

      <View style={{ alignItems: "center" }}>
        <Image
          source={require("@/assets/images/loyalty-point.webp")}
          style={styles.image}
        />

        <Typo
          size={15}
          fontFamily="SemiBold"
          color={colors.NEUTRAL900}
          style={{ paddingTop: verticalScale(10) }}
        >
          Earn Loyalty Points with FAMTO!
        </Typo>

        <Typo
          size={13}
          color={colors.NEUTRAL900}
          style={{
            width: "90%",
            textAlign: "center",
            paddingTop: verticalScale(15),
          }}
        >
          Get rewarded every time you shop with us. Earn points and redeem them
          for discounts on your future orders. 50 loyalty point = 1 rupee
        </Typo>
      </View>

      <View style={styles.detailContainer}>
        {loyaltyDetails?.map((detail, index) => (
          <View key={index} style={styles.detail}>
            <Typo>•</Typo>
            <Typo size={13}>{detail}</Typo>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Typo size={13}>Start earning & enjoy savings on every purchase</Typo>
      </View>
    </ScreenWrapper>
  );
};

export default LoyaltyPoints;

const styles = StyleSheet.create({
  image: {
    height: verticalScale(240),
    width: scale(240),
    resizeMode: "cover",
  },
  detailContainer: {
    backgroundColor: colors.NEUTRAL100,
    marginHorizontal: scale(20),
    marginTop: verticalScale(20),
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(20),
    borderRadius: radius._10,
  },
  detail: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(10),
    gap: spacingX._10,
  },
  footer: {
    marginTop: "auto",
    marginBottom: Platform.OS === "ios" ? verticalScale(30) : verticalScale(20),
    backgroundColor: colors.NEUTRAL100,
    marginHorizontal: scale(20),
    alignSelf: "center",
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(12),
    borderRadius: radius._15,
  },
});
