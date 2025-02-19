import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import Typo from "@/components/Typo";
import { router } from "expo-router";
import { profileOptions } from "@/utils/defaultData";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/store";
import { fetchUserProfile } from "@/service/userService";
import { logout } from "@/service/authService";
import { UserProfileProps } from "@/types";

const Profile = () => {
  const { token } = useAuthStore.getState();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<UserProfileProps | null>({
    queryKey: ["customer-profile"],
    queryFn: fetchUserProfile,
    enabled: !!token,
  });

  const handleLogout = () => {
    queryClient.clear();
    logout();
  };

  return (
    <ScreenWrapper>
      <ScrollView>
        <View style={styles.profileContainer}>
          <View
            style={[styles.profileRing, { borderColor: colors.PRIMARY_LIGHT }]}
          >
            <View style={[styles.profileRing, { borderColor: colors.PRIMARY }]}>
              <Image
                source={
                  data?.imageURL
                    ? {
                        uri: data?.imageURL,
                      }
                    : require("@/assets/images/default-user.webp")
                }
                style={styles.profileImage}
              />

              <Pressable
                onPress={() => router.push("/screens/user/edit-profile")}
                style={styles.editBtn}
              >
                <Image
                  source={require("@/assets/icons/edit.webp")}
                  style={{ height: verticalScale(20), width: scale(20) }}
                  resizeMode="cover"
                />
              </Pressable>
            </View>
          </View>

          <View style={{ gap: spacingY._5 }}>
            <Typo
              fontFamily="Medium"
              size={18}
              color={colors.NEUTRAL900}
              textProps={{ numberOfLines: 1 }}
              style={{ width: 150 }}
            >
              {data?.fullName || ""}
            </Typo>
            <Typo size={14} color={colors.NEUTRAL800}>
              {data?.phoneNumber || ""}
            </Typo>
          </View>
        </View>

        <View style={styles.optionContainer}>
          {profileOptions?.map((option, index) => (
            <View key={index}>
              <TouchableOpacity
                onPress={() => router.push(option.route as any)}
                style={styles.pressableContainer}
              >
                <Image
                  source={option.image}
                  style={styles.icon}
                  resizeMode="cover"
                />

                <Typo size={14} color={colors.NEUTRAL800} style={{ flex: 1 }}>
                  {option.label}
                </Typo>

                <Image
                  source={require("@/assets/icons/arrow-square.webp")}
                  style={styles.arrow}
                />
              </TouchableOpacity>

              <View style={styles.seperator} />
            </View>
          ))}

          <TouchableOpacity
            onPress={handleLogout}
            style={styles.pressableContainer}
          >
            <Image
              source={require("@/assets/icons/logout.webp")}
              style={styles.icon}
              resizeMode="cover"
            />

            <Typo size={14} color={colors.NEUTRAL800} style={{ flex: 1 }}>
              Logout
            </Typo>

            <Image
              source={require("@/assets/icons/arrow-square.webp")}
              style={styles.arrow}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default Profile;

const styles = StyleSheet.create({
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
    width: "100%",
    paddingHorizontal: scale(20),
  },
  profileRing: {
    borderWidth: 12,
    borderRadius: 99,
  },
  profileImage: {
    height: verticalScale(70),
    width: scale(70),
    borderRadius: 99,
    position: "relative",
  },
  editBtn: {
    position: "absolute",
    bottom: -15,
    right: -15,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 99,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  optionContainer: {
    marginTop: verticalScale(30),
    marginHorizontal: scale(20),
    backgroundColor: "white",
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(16),
    borderRadius: radius._10,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5.62,
    elevation: 5,
  },
  pressableContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: verticalScale(10),
  },
  icon: {
    height: verticalScale(24),
    width: scale(24),
    marginRight: scale(10),
  },
  arrow: {
    marginLeft: scale(10),
    height: verticalScale(24),
    width: scale(24),
    resizeMode: "cover",
  },
  seperator: {
    borderWidth: 0.2,
    marginVertical: verticalScale(10),
    borderColor: colors.NEUTRAL400,
  },
});
