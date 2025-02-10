import { View, Pressable, Image } from "react-native";
import React from "react";
import { MapPin } from "phosphor-react-native";
import { scale, verticalScale } from "@/utils/styling";
import Typo from "./Typo";
import { colors, spacingX } from "@/constants/theme";
import { router } from "expo-router";

const HomeHeader = () => {
  return (
    <View
      style={{
        marginHorizontal: scale(20),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <View
        style={{ flexDirection: "row", alignItems: "center", gap: spacingX._5 }}
      >
        <View
          style={{
            padding: 10,
            backgroundColor: colors.WHITE,
            borderRadius: 99,
          }}
        >
          <MapPin size={30} style={{}} weight="fill" color="#E74C3C" />
        </View>

        <View>
          <Typo size={16} color={colors.NEUTRAL800} fontFamily="Medium">
            Home
          </Typo>
          <Typo size={12} color={colors.NEUTRAL700}>
            Trivandrum, Kerala
          </Typo>
        </View>
      </View>

      <Pressable onPress={() => router.push("/screens/profile")}>
        <Image
          source={{
            uri: "https://plus.unsplash.com/premium_photo-1689539137236-b68e436248de?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGVyc29ufGVufDB8fDB8fHww",
          }}
          style={{
            height: verticalScale(45),
            width: verticalScale(45),
            borderRadius: 99,
          }}
        />
      </Pressable>
    </View>
  );
};

export default HomeHeader;
