import { View, Pressable, Image } from "react-native";
import React, { FC, useEffect } from "react";
import { CaretDown, MapPin } from "phosphor-react-native";
import { scale, verticalScale } from "@/utils/styling";
import Typo from "./Typo";
import { colors, spacingX } from "@/constants/theme";
import { router } from "expo-router";
import { UserProfileProps } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile } from "@/service/userService";
import { useAuthStore } from "@/store/store";
import { commonStyles } from "@/constants/commonStyles";
import { StyleSheet } from "react-native";

const HomeHeader: FC<{ onPress: () => void }> = ({ onPress }) => {
  const token = useAuthStore((state) => state.token);
  const userAddress = useAuthStore((state) => state.userAddress);

  const { data, isLoading } = useQuery<UserProfileProps | null>({
    queryKey: ["customer-profile"],
    queryFn: fetchUserProfile,
    enabled: !!token,
  });

  return (
    <View
      style={[
        commonStyles.flexRowBetween,
        {
          marginHorizontal: scale(20),
          gap: spacingX._15,
        },
      ]}
    >
      <Pressable
        onPress={onPress}
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          gap: spacingX._5,
        }}
      >
        <View
          style={{
            padding: 10,
            backgroundColor: colors.WHITE,
            borderRadius: 99,
          }}
        >
          <MapPin size={30} weight="fill" color="#E74C3C" />
        </View>

        <View style={{ width: "50%" }}>
          <View style={[commonStyles.flexRowGap, { gap: spacingX._5 }]}>
            <Typo size={16} color={colors.NEUTRAL800} fontFamily="Medium">
              {userAddress?.type
                ? userAddress.type.charAt(0).toUpperCase() +
                  userAddress.type.slice(1)
                : "Select Address"}
            </Typo>

            <CaretDown size={scale(14)} weight="bold" />
          </View>
          <Typo
            size={12}
            color={colors.NEUTRAL700}
            textProps={{ numberOfLines: 1 }}
          >
            {userAddress?.address || "No Address Selected"}
          </Typo>
        </View>
      </Pressable>

      <Pressable onPress={() => router.push("/screens/user/profile")}>
        {isLoading ? (
          <View
            style={[
              styles.image,
              {
                backgroundColor: colors.NEUTRAL400,
              },
            ]}
          />
        ) : (
          <Image
            source={
              data?.imageURL
                ? {
                    uri: data?.imageURL,
                  }
                : require("@/assets/images/default-user.webp")
            }
            style={styles.image}
          />
        )}
      </Pressable>
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  image: {
    height: verticalScale(45),
    width: verticalScale(45),
    borderRadius: 99,
  },
});
