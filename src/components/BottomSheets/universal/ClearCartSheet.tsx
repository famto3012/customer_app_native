import Button from "@/components/Button";
import Typo from "@/components/Typo";
import { colors, spacingX } from "@/constants/theme";
import { useData } from "@/context/DataContext";
import { clearCart } from "@/localDB/controller/cartController";
import { scale, verticalScale } from "@/utils/styling";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { FC } from "react";
import { Platform, StyleSheet, View } from "react-native";

const ClearCartSheet: FC<{ closeClearCartSheet: () => void }> = ({
  closeClearCartSheet,
}) => {
  const { setProductCounts } = useData();

  const handleClearCart = async () => {
    await clearCart();
    setProductCounts({});
    closeClearCartSheet();
  };

  return (
    <BottomSheetScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <Typo
          size={15}
          color={colors.PRIMARY}
          fontFamily="SemiBold"
          style={styles.header}
        >
          Clear Cart
        </Typo>

        {/* Ensure this container takes full height */}
        <View style={styles.content}>
          <Typo size={13} color={colors.NEUTRAL400} style={styles.text}>
            Are you sure you want to clear your cart?
          </Typo>

          {/* Buttons with auto margin-top to push them to the bottom */}
          <View style={styles.buttonContainer}>
            <Button
              title="Cancel"
              onPress={closeClearCartSheet}
              style={{ flex: 1 }}
            />
            <Button
              title="Clear"
              onPress={handleClearCart}
              style={{ flex: 1, backgroundColor: colors.LIGHT_RED }}
              labelColor={colors.RED}
            />
          </View>
        </View>
      </View>
    </BottomSheetScrollView>
  );
};

export default ClearCartSheet;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(20),
    marginVertical: verticalScale(20),
    flex: 1, // Ensure container takes full height
  },
  header: {
    borderBottomWidth: 0.6,
    paddingBottom: verticalScale(10),
    borderBottomColor: colors.NEUTRAL350,
  },
  content: {
    flex: 1, // Makes sure this section expands to push buttons to the bottom
    justifyContent: "space-between",
  },
  text: {
    marginTop: verticalScale(24),
  },
  buttonContainer: {
    flexDirection: "row",
    gap: spacingX._10,
    marginTop: "auto",
    marginBottom: Platform.OS === "ios" ? verticalScale(20) : 0, // Pushes buttons to the bottom
  },
});
