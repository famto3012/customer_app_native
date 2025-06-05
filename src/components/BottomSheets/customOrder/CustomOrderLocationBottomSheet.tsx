import Button from "@/components/Button";
import Typo from "@/components/Typo";
import { colors, spacingX } from "@/constants/theme";
import { addStoreDetail } from "@/service/customOrderService";
import { scale, verticalScale } from "@/utils/styling";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { FC } from "react";
import { Platform, StyleSheet, View } from "react-native";

const CustomOrderLocationBottomSheet: FC<{ onPress: () => void }> = ({
  onPress,
}) => {
  const storeData = {
    latitude: null,
    longitude: null,
    shopName: "Buy from any store",
    place: "",
    buyFromAnyWhere: true,
  };

  const handleAddStoreMutation = useMutation({
    mutationKey: ["add-store"],
    mutationFn: () => addStoreDetail(storeData),
    onSuccess: (data) => {
      if (data.cartId) {
        onPress();
        router.push({
          pathname: "/screens/customOrder/CustomOrderCheckout",
          params: {
            storeName: "Buy from any store",
            cartId: data.cartId,
          },
        });
      }
    },
  });

  return (
    <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
      <Typo size={15} fontFamily="SemiBold" color={colors.NEUTRAL900}>
        Custom Order
      </Typo>

      <Typo
        size={13}
        color={colors.NEUTRAL400}
        style={{ paddingTop: verticalScale(15) }}
      >
        Where do you need the product from?
      </Typo>

      <View style={styles.buttonContainer}>
        <Button
          title="Any store"
          onPress={() => handleAddStoreMutation.mutate()}
          isLoading={handleAddStoreMutation.isPending}
          style={{ flex: 1, backgroundColor: colors.PRIMARY_LIGHT }}
          labelColor={colors.PRIMARY}
        />
        <Button
          title="Select from Map"
          onPress={() => {
            router.push({
              pathname: "/screens/customOrder/CustomOrderMap",
            });
            onPress();
          }}
          style={{ flex: 1 }}
        />
      </View>
    </BottomSheetScrollView>
  );
};

export default CustomOrderLocationBottomSheet;

const styles = StyleSheet.create({
  contentContainer: {
    padding: scale(20),
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "auto",
    marginBottom: Platform.OS === "ios" ? verticalScale(20) : verticalScale(10),
    gap: spacingX._10,
  },
});
