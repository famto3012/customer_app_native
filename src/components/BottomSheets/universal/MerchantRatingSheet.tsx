import {
  StyleSheet,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { FC, useState } from "react";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Typo from "@/components/Typo";
import { Star } from "phosphor-react-native";
import { scale, verticalScale } from "@/utils/styling";
import { colors, spacingX } from "@/constants/theme";
import Input from "@/components/user/Input";
import Button from "@/components/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rateMerchant } from "@/service/universal";

const MerchantRatingSheet: FC<{
  merchantId: string;
  rating: number;
  onPress: () => void;
}> = ({ merchantId, rating, onPress }) => {
  const [data, setData] = useState<{ rating: number; review: string }>({
    rating: 0,
    review: "",
  });

  const queryClient = useQueryClient();

  const handleRatingPress = (rating: number) => {
    setData((prev) => ({ ...prev, rating }));
  };

  const handleRateMutation = useMutation({
    mutationKey: ["rate-merchant"],
    mutationFn: () =>
      rateMerchant({ rating: data.rating, review: data.review, merchantId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["merchant-data", merchantId],
      });
      onPress();
      setData({
        review: "",
        rating: 0,
      });
    },
  });

  return (
    // <KeyboardAvoidingView>
    <BottomSheetScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Typo size={15} color={colors.PRIMARY} fontFamily="SemiBold">
          Rate the merchant
        </Typo>

        <View style={styles.rateContainer}>
          <Star size={scale(15)} weight="fill" color={colors.YELLOW} />
          <Typo size={12} color={colors.NEUTRAL400}>
            {rating}
          </Typo>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <Typo
          size={14}
          color={colors.NEUTRAL900}
          fontFamily="Medium"
          style={{ textAlign: "center", marginTop: verticalScale(20) }}
        >
          Your opinion matters to us!
        </Typo>

        <View style={styles.starContainer}>
          {[1, 2, 3, 4, 5].map((index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleRatingPress(index)}
            >
              <Star
                size={scale(24)}
                weight={data.rating >= index ? "fill" : "regular"}
                color={colors.YELLOW}
              />
            </TouchableOpacity>
          ))}
        </View>

        <Input
          label="Enter your feedback (optional)"
          onChangeText={(text: string) => setData({ ...data, review: text })}
          value={data.review}
        />
      </View>

      <Button
        title="Submit"
        onPress={() => handleRateMutation.mutate()}
        isLoading={handleRateMutation.isPending}
        style={{ marginTop: verticalScale(30) }}
      />
    </BottomSheetScrollView>
    //  </KeyboardAvoidingView>
  );
};

export default MerchantRatingSheet;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(20),
    flex: 1,
    paddingBottom: verticalScale(20),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: verticalScale(10),
    borderBottomColor: colors.NEUTRAL400,
    borderBottomWidth: 0.6,
    paddingBottom: verticalScale(10),
  },
  rateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._5,
  },
  contentContainer: {
    flex: 1,
  },
  starContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "auto",
    marginTop: verticalScale(20),
    gap: spacingX._10,
  },
});
