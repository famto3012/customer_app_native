import { View, Pressable, Image } from "react-native";
import React from "react";
import { MapPin } from "phosphor-react-native";
import { scale, verticalScale } from "@/utils/styling";
import Typo from "./Typo";
import { colors, spacingX } from "@/constants/theme";
import { router } from "expo-router";
import { UserProfileProps } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile } from "@/service/userService";
import { useAuthStore } from "@/store/store";

const HomeHeader = () => {
  const { token } = useAuthStore.getState();

  const { data, isLoading } = useQuery<UserProfileProps | null>({
    queryKey: ["customer-profile"],
    queryFn: fetchUserProfile,
    enabled: !!token,
  });

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

      <Pressable onPress={() => router.push("/screens/user/profile")}>
        <Image
          source={
            data?.imageURL
              ? {
                  uri: data?.imageURL,
                }
              : require("@/assets/images/default-user.webp")
          }
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
