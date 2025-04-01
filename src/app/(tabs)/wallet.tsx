import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import Typo from "@/components/Typo";
import { scale, verticalScale } from "@/utils/styling";
import { colors, radius, spacingY } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import {
  fetchLoyaltyAndFamtoCash,
  fetchVisibilityOfLoyaltyOrReferral,
} from "@/service/userService";
import { useAuthStore } from "@/store/store";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import WalletRecharge from "@/components/BottomSheets/user/WalletRecharge";
import { useCallback, useMemo, useRef } from "react";
import { commonStyles } from "@/constants/commonStyles";

interface WalletProps {
  walletBalance: string;
  loyaltyPoints: number;
}

const Wallet = () => {
  const rechargeSheetRef = useRef<BottomSheet>(null);

  const rechargeSnapPoints = useMemo(() => ["40%"], []);

  const { token } = useAuthStore.getState();

  const { data } = useQuery<WalletProps>({
    queryKey: ["loyalty-and-famto-cash"],
    queryFn: () => fetchLoyaltyAndFamtoCash(),
    enabled: !!token,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const { data: loyaltyStatus } = useQuery({
    queryKey: ["get-visibility"],
    queryFn: () => fetchVisibilityOfLoyaltyOrReferral("loyalty-point"),
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        style={[props.style, commonStyles.backdrop]}
      />
    ),
    []
  );

  return (
    <ScreenWrapper>
      <Header title="Wallet" />
      <ScrollView
        style={{ paddingHorizontal: scale(20), paddingTop: verticalScale(30) }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.balanceContainer}>
          <LinearGradient
            colors={["#00696B", colors.PRIMARY, colors.PRIMARY_LIGHT]}
            locations={[0.15, 0.9, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientBackground}
          >
            <View>
              <Typo size={24} fontFamily="Bold" color={colors.WHITE}>
                ₹ {data?.walletBalance || "0.00"}
              </Typo>
              <Typo size={14} color={colors.NEUTRAL350}>
                Available balance
              </Typo>
            </View>

            <TouchableOpacity
              onPress={() => {
                if (!token) {
                  router.push({
                    pathname: "/auth",
                    params: {
                      showSkip: 0,
                    },
                  });

                  return;
                }

                rechargeSheetRef.current?.expand();
              }}
              style={styles.addBtn}
            >
              <Typo size={12} color={colors.WHITE}>
                Add Balance
              </Typo>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {loyaltyStatus?.status && (
          <View style={styles.loyaltyContainer}>
            <Typo size={24} fontFamily="SemiBold" color={colors.NEUTRAL900}>
              {data?.loyaltyPoints.toFixed(0) || "0"} Points
            </Typo>
            <Typo size={14} color={colors.NEUTRAL400}>
              Loyalty points left for redemption
            </Typo>
          </View>
        )}

        <View style={styles.pressableContainer}>
          <Pressable
            onPress={() => {
              router.push("/screens/user/subscription");
            }}
            style={styles.pressable}
          >
            <Image
              source={require("@/assets/icons/gift.webp")}
              style={styles.image}
            />
            <Typo size={14} color={colors.NEUTRAL900} style={styles.label}>
              Subscription
            </Typo>
            <Image
              source={require("@/assets/icons/arrow-square.webp")}
              style={styles.image}
            />
          </Pressable>

          <View
            style={{
              borderWidth: 0.5,
              borderColor: colors.NEUTRAL300,
              marginVertical: verticalScale(6),
              marginHorizontal: scale(20),
            }}
          />

          <Pressable
            onPress={() => router.push("/screens/user/transaction")}
            style={styles.pressable}
          >
            <Image
              source={require("@/assets/icons/transaction-minus.webp")}
              style={styles.image}
            />
            <Typo size={14} color={colors.NEUTRAL900} style={styles.label}>
              Transaction History
            </Typo>
            <Image
              source={require("@/assets/icons/arrow-square.webp")}
              style={styles.image}
            />
          </Pressable>
        </View>

        <View style={styles.detail}>
          <Typo size={14} fontFamily="Medium" color={colors.NEUTRAL900}>
            Things to remember
          </Typo>
          <Typo size={13} color={colors.NEUTRAL400}>
            According to RBI regulations, any amount in a Famto wallet account
            cannot be moved to a bank account or another Famto cash account.
          </Typo>
        </View>
      </ScrollView>

      <BottomSheet
        ref={rechargeSheetRef}
        index={-1}
        snapPoints={rechargeSnapPoints}
        enableDynamicSizing={true}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <WalletRecharge onClose={() => rechargeSheetRef.current?.close()} />
      </BottomSheet>
    </ScreenWrapper>
  );
};

export default Wallet;

const styles = StyleSheet.create({
  balanceContainer: {
    borderRadius: radius._15,
  },
  gradientBackground: {
    flex: 1,
    borderRadius: radius._15,
    paddingVertical: verticalScale(20),
    paddingHorizontal: scale(22),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addBtn: {
    backgroundColor: colors.PRIMARY,
    paddingVertical: verticalScale(8),
    paddingHorizontal: verticalScale(15),
    borderRadius: radius._20,
  },
  loyaltyContainer: {
    marginVertical: verticalScale(12),
    borderWidth: 1,
    borderColor: colors.NEUTRAL300,
    paddingVertical: verticalScale(15),
    paddingHorizontal: scale(20),
    borderRadius: radius._15,
  },
  pressableContainer: {
    marginVertical: verticalScale(20),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: colors.WHITE,
    borderRadius: radius._15,
  },
  image: {
    height: verticalScale(24),
    width: scale(24),
    resizeMode: "cover",
  },
  pressable: {
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(15),
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    flex: 1,
    paddingStart: scale(15),
  },
  detail: {
    backgroundColor: colors.NEUTRAL100,
    padding: scale(24),
    borderRadius: radius._15,
    gap: spacingY._10,
  },
});
