import { StyleSheet, Text, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from "react-native-reanimated";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import Typo from "@/components/Typo";
import { colors } from "@/constants/theme";
import Button from "@/components/Button";

const images = [
  { source: require("@/assets/images/location-permission.webp"), text: "Forgot something at home?"},
  { source: require("@/assets/images/location-permission.webp"), text: "Delivery boys available anytime"},
  { source: require("@/assets/images/location-permission.webp"), text: "Fast and safe delivery"},
];

const subtexts = [
  "Give us a pickup address",
  "Our delivery agents are at your service",
  "We ensure safe and fast delivery everytime",
];

const PickAndDropHome = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const imageOffset = useSharedValue(-300);
  const textOffset = useSharedValue(300);

  useEffect(() => {
    const cycleImages = () => {
      const nextIndex = (currentIndex + 1) % images.length;

      const isLeftToRight = currentIndex % 2 === 0;

      imageOffset.value = withTiming(isLeftToRight ? -300 : 300, { duration: 500 }, () => {
        runOnJS(setCurrentIndex)(nextIndex);
        imageOffset.value = isLeftToRight ? 300 : -300;
        imageOffset.value = withTiming(0, { duration: 500 });
      });

      textOffset.value = withTiming(isLeftToRight ? 300 : -300, { duration: 500 }, () => {
        textOffset.value = isLeftToRight ? -300 : 300;
        textOffset.value = withTiming(0, { duration: 500 });
      });
    };

    const interval = setInterval(cycleImages, 3000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const animatedImageStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: imageOffset.value }],
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: textOffset.value }],
  }));

  return (
    <ScreenWrapper>
      <Header title={"Pick & Drop"} />

      <Animated.Image
        source={images[currentIndex].source}
        style={[styles.image, animatedImageStyle]}
        resizeMode="contain"
      />

      <Animated.View style={[styles.textContainer, animatedTextStyle]}>
        <Typo size={14} fontWeight={800} color={colors.BLACK}>
          {images[currentIndex].text}
        </Typo>
        <Typo size={14} color={colors.BLACK}>
          {subtexts[currentIndex]}
        </Typo>
      </Animated.View>

      <View style={styles.reminderContainer}>
<Typo size={14} fontWeight={700} color={colors.BLACK}>
  Things to remember
</Typo>

        <View style={styles.bulletContainer}>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Typo size={14} color={colors.BLACK}>
              Sending high-value or fragile products should {"\n"} be avoided.
            </Typo>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Typo size={14} color={colors.BLACK}>
              Items should fit inside the backpack.
            </Typo>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
<Typo size={14} color={colors.BLACK}>
  Transporting illegal goods is prohibited.
</Typo>
          </View>
        </View>
      </View>

<Button
  title="Place your order"
  onPress={() => console.log("Button pressed")}
  style={styles.button}
/>
    </ScreenWrapper>
  );
};

export default PickAndDropHome;

const styles = StyleSheet.create({
  image: {
    marginTop: 30,
    width: "90%",
    height: "45%",
    borderRadius: 10,
    alignSelf: "center",
  },
textContainer: {
  alignItems: "center",
  marginTop: 20,
},
  reminderContainer: {
    marginTop: 50,
    padding: 20,
    backgroundColor: "#f8f8f8",
    borderRadius: 20,
    width: "90%",
    alignSelf: "center",
  },
  bulletContainer: {
    marginTop: 20,
  },
  bulletPoint: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  bullet: {
    fontSize: 14,
    marginRight: 8,
    color: colors.BLACK,
  },
button: {
  marginTop: 40,
  alignSelf: "center",
  width: "90%",
},
});

