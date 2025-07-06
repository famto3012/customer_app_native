import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import { scale, verticalScale } from "@/utils/styling";
import Typo from "@/components/Typo";
import { colors, radius } from "@/constants/theme";
import { CaretRight, CaretUp } from "phosphor-react-native";

const AboutUs = () => {
  return (
    <ScreenWrapper>
      <Header title="About Us" />
      <Pressable
        style={{ ...styles.container, marginTop: scale(15) }}
        onPress={() =>
          Linking.openURL("https://famto.in/about-us").catch((err) =>
            console.error("Failed to open URL:", err)
          )
        }
      >
        <View
          style={{
            paddingTop: verticalScale(8),
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginHorizontal: scale(10),
            marginVertical: scale(5),
          }}
        >
          <View style={{ marginVertical: scale(5) }}>
            <Typo size={14} color={colors.NEUTRAL900}>
              About famto
            </Typo>
          </View>

          <View
            style={{
              borderWidth: 1,
              borderRadius: radius._6,
              padding: scale(2),
            }}
          >
            <CaretRight size={16} />
          </View>
        </View>
      </Pressable>
      {/* <Pressable
        style={styles.container}
        onPress={() =>
          Linking.openURL("https://famto.in/contact-us").catch((err) =>
            console.error("Failed to open URL:", err)
          )
        }
      >
        <View
          style={{
            paddingTop: verticalScale(8),
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginHorizontal: scale(10),
            marginVertical: scale(5),
          }}
        >
          <View style={{ marginVertical: scale(5) }}>
            <Typo size={14} color={colors.NEUTRAL900}>
              Contact us
            </Typo>
          </View>

          <View
            style={{
              borderWidth: 1,
              borderRadius: radius._6,
              padding: scale(2),
            }}
          >
            <CaretRight size={16} />
          </View>
        </View>
      </Pressable> */}
      <Pressable
        style={styles.container}
        onPress={() =>
          Linking.openURL("https://famto.in/terms-and-conditions").catch(
            (err) => console.error("Failed to open URL:", err)
          )
        }
      >
        <View
          style={{
            paddingTop: verticalScale(8),
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginHorizontal: scale(10),
            marginVertical: scale(5),
          }}
        >
          <View style={{ marginVertical: scale(5) }}>
            <Typo size={14} color={colors.NEUTRAL900}>
              Terms & Conditions
            </Typo>
          </View>

          <View
            style={{
              borderWidth: 1,
              borderRadius: radius._6,
              padding: scale(2),
            }}
          >
            <CaretRight size={16} />
          </View>
        </View>
      </Pressable>
      <Pressable
        style={styles.container}
        onPress={() =>
          Linking.openURL("https://famto.in/privacy-policy").catch((err) =>
            console.error("Failed to open URL:", err)
          )
        }
      >
        <View
          style={{
            paddingTop: verticalScale(8),
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginHorizontal: scale(10),
            marginVertical: scale(5),
          }}
        >
          <View style={{ marginVertical: scale(5) }}>
            <Typo size={14} color={colors.NEUTRAL900}>
              Privacy policy
            </Typo>
          </View>

          <View
            style={{
              borderWidth: 1,
              borderRadius: radius._6,
              padding: scale(2),
            }}
          >
            <CaretRight size={16} />
          </View>
        </View>
      </Pressable>
      <Pressable
        style={styles.container}
        onPress={() =>
          Linking.openURL(
            "https://famto.in/cancellation-and-refund-policy"
          ).catch((err) => console.error("Failed to open URL:", err))
        }
      >
        <View
          style={{
            paddingTop: verticalScale(8),
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginHorizontal: scale(10),
            marginVertical: scale(5),
          }}
        >
          <View style={{ marginVertical: scale(5) }}>
            <Typo size={14} color={colors.NEUTRAL900}>
              Cancellation & Refund policy
            </Typo>
          </View>

          <View
            style={{
              borderWidth: 1,
              borderRadius: radius._6,
              padding: scale(2),
            }}
          >
            <CaretRight size={16} />
          </View>
        </View>
      </Pressable>
    </ScreenWrapper>
  );
};

export default AboutUs;

const styles = StyleSheet.create({
  container: {
    marginVertical: verticalScale(5),
    backgroundColor: colors.WHITE,
    paddingBottom: verticalScale(10),
    paddingHorizontal: scale(7),
    marginHorizontal: scale(10),
    borderRadius: radius._10,
    elevation: 5,
  },
});
