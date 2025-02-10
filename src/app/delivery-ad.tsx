import { View, Image } from "react-native";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { SCREEN_HEIGHT, SCREEN_WIDTH, verticalScale } from "@/utils/styling";
import Button from "@/components/Button";
import { colors } from "@/constants/theme";
import { router } from "expo-router";

const DeliveryAd = () => {
  return (
    <ScreenWrapper>
      <View
        style={{
          flex: 1,
          alignItems: "flex-start",
          justifyContent: "center",
          marginHorizontal: 20,
        }}
      >
        <Typo
          size={16}
          color={colors.NEUTRAL900}
          fontWeight={"bold"}
          style={{ textAlign: "left" }}
        >
          Order your need
        </Typo>
        <Typo size={13} style={{ marginVertical: 10 }}>
          Fast and efficient delivery to your doorstep for anything you need.
        </Typo>

        <Image
          source={require("@/assets/images/delivery-ad.webp")}
          resizeMode="cover"
          style={{
            width: verticalScale(SCREEN_WIDTH * 0.8),
            height: verticalScale(SCREEN_HEIGHT * 0.4),
          }}
        />
      </View>

      <View style={{ marginHorizontal: 20, paddingBottom: verticalScale(40) }}>
        <Button title="Get Started" onPress={() => router.push("/auth")} />
      </View>
    </ScreenWrapper>
  );
};

export default DeliveryAd;
