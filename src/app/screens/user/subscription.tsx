import { StyleSheet, TouchableOpacity, View } from "react-native";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import { useQuery } from "@tanstack/react-query";
import { fetchCustomerSubscriptions } from "@/service/userService";
import { useAuthStore } from "@/store/store";
import Typo from "@/components/Typo";
import { scale, verticalScale } from "@/utils/styling";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { Clock } from "phosphor-react-native";
import { FlatList } from "react-native-gesture-handler";

interface PlanProps {
  planId: string;
  planName: string;
  planAmount: number;
  planDuration: number;
  noOfOrder: number;
  description: string;
}

const Subscription = () => {
  const { token } = useAuthStore.getState();

  const { data, isLoading } = useQuery({
    queryKey: ["customer-subscription"],
    queryFn: fetchCustomerSubscriptions,
    enabled: !!token,
  });

  const renderItem = ({ item }: { item: PlanProps }) => {
    return (
      <View style={styles.planContainer}>
        <View style={styles.planDetail}>
          <View>
            <Typo size={18} color={colors.PRIMARY} fontFamily="Medium">
              {item.planName}
            </Typo>
            <Typo size={12} color={colors.NEUTRAL400}>
              Validity: {item.planDuration} days
            </Typo>
          </View>

          <Typo size={20} color={colors.NEUTRAL900} fontFamily="SemiBold">
            ₹ {item.planAmount}
          </Typo>
        </View>

        <Typo size={13} color={colors.NEUTRAL400}>
          {item.description}
        </Typo>

        <TouchableOpacity style={styles.btn}>
          <Typo size={14} color={colors.WHITE}>
            Recharge
          </Typo>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScreenWrapper>
      <Header title="Subscriptions" />

      {data?.currentSubscription?.planName ? (
        <View style={styles.currentContainer}>
          <View style={styles.header}>
            <Typo size={15} fontFamily="Medium" color={colors.NEUTRAL900}>
              Current Plan
            </Typo>
          </View>

          <View style={styles.currentDetail}>
            <View>
              <Typo size={13} color={colors.NEUTRAL400}>
                Expires in
              </Typo>
              <Typo size={14} fontFamily="Medium" color={colors.NEUTRAL900}>
                {data?.currentSubscription?.daysLeft} Days
              </Typo>
            </View>

            <View
              style={{
                height: verticalScale(30),
                backgroundColor: colors.NEUTRAL600,
                borderWidth: 0.8,
                borderColor: colors.NEUTRAL200,
              }}
            />

            <View>
              <Typo size={13} color={colors.NEUTRAL400}>
                Plan
              </Typo>
              <Typo size={14} fontFamily="Medium" color={colors.NEUTRAL900}>
                {data?.currentSubscription?.planName}
              </Typo>
            </View>
          </View>
        </View>
      ) : (
        <View style={[styles.currentContainer, styles.emptySubscription]}>
          <Clock size={scale(20)} />
          <Typo size={14} color={colors.NEUTRAL400}>
            No active subscription plan.
          </Typo>
        </View>
      )}

      <FlatList
        data={data?.allSubscriptionPlans}
        renderItem={renderItem}
        keyExtractor={(item) => item.planId}
        contentContainerStyle={{
          paddingHorizontal: scale(20),
          marginTop: verticalScale(30),
          gap: spacingY._20,
        }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <Typo size={15} color={colors.NEUTRAL900} fontFamily="Medium">
              Other Plans for you
            </Typo>
          </View>
        }
      />
    </ScreenWrapper>
  );
};

export default Subscription;

const styles = StyleSheet.create({
  currentContainer: {
    marginHorizontal: scale(20),
    marginTop: verticalScale(32),
    borderWidth: 1,
    borderColor: colors.NEUTRAL300,
    borderRadius: radius._10,
  },
  currentDetail: {
    flexDirection: "row",
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(10),
    alignItems: "center",
    gap: spacingX._10,
  },
  header: {
    backgroundColor: colors.NEUTRAL200,
    paddingHorizontal: scale(16),
    paddingVertical: scale(10),
    borderTopLeftRadius: radius._10,
    borderTopRightRadius: radius._10,
  },
  emptySubscription: {
    flexDirection: "row",
    paddingVertical: verticalScale(20),
    paddingHorizontal: scale(20),
    gap: spacingX._15,
  },
  btn: {
    backgroundColor: colors.PRIMARY,
    marginTop: verticalScale(20),
    paddingVertical: verticalScale(12),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radius._30,
  },
  planContainer: {
    paddingHorizontal: scale(10),
    borderWidth: 1,
    borderRadius: radius._10,
    borderColor: colors.NEUTRAL200,
    paddingVertical: verticalScale(15),
  },
  planDetail: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: verticalScale(20),
  },
});
