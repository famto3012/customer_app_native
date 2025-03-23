import { Pressable, View } from "react-native";
import { scale, verticalScale } from "@/utils/styling";
import { colors, radius } from "@/constants/theme";
import { CaretRight, House } from "phosphor-react-native";
import Typo from "../Typo";
import { useAuthStore } from "@/store/store";
import { router } from "expo-router";

const UserSelectedAddress = () => {
  const userAddress = useAuthStore((state) => state.userAddress);

  return (
    <Pressable
      onPress={() => router.push("/(modal)/SelectAddress")}
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: scale(20),
        marginVertical: verticalScale(20),
        backgroundColor: colors.NEUTRAL200,
        borderRadius: radius._6,
        paddingHorizontal: scale(10),
        paddingVertical: verticalScale(8),
      }}
    >
      <House weight="fill" color={colors.NEUTRAL400} />

      <View style={{ flex: 1, marginLeft: scale(10) }}>
        <Typo size={14} color={colors.NEUTRAL800} fontFamily="Medium">
          Delivery at{" "}
          {userAddress?.type?.charAt(0)?.toUpperCase() +
            userAddress?.type?.slice(1)}
        </Typo>
        <Typo size={11} color={colors.NEUTRAL500}>
          {userAddress?.address}
        </Typo>
      </View>

      <CaretRight />
    </Pressable>
  );
};

export default UserSelectedAddress;
