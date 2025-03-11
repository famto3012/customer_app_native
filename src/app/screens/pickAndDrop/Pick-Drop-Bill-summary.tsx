
import { Image, StyleSheet, View } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import { FC, useRef } from "react";
import { CustomCartBill } from "@/types";
import Typo from "@/components/Typo";

const Pickdropbill: FC<{ data: CustomCartBill }> = ({ data }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  return (
    <BottomSheet ref={bottomSheetRef} index={0} snapPoints={["50%", "80%"]}>
      <BottomSheetScrollView style={styles.container}>
        <Typo
          size={15}
          fontFamily="SemiBold"
          color={colors.PRIMARY}
          style={{
            paddingBottom: verticalScale(10),
            borderBottomWidth: 1,
            borderBottomColor: colors.NEUTRAL350,
          }}
        >
          Bill Summary
        </Typo>

        <View style={{ gap: spacingY._10, marginTop: verticalScale(20) }}>
          <View style={styles.field}>
            <Typo size={14} color={colors.NEUTRAL800}>
              Delivery charges
            </Typo>
            <Typo fontFamily="Medium" size={16} color={colors.NEUTRAL800}>
            {"₹ " + 75 + ""}
            </Typo>
          </View>

          <View style={styles.field}>
            <Typo size={14} color={colors.NEUTRAL800}>
              Surge charges
            </Typo>
            <Typo fontFamily="Medium" size={16} color={colors.NEUTRAL800}>
              ₹ {'-'}
            </Typo>
          </View>

          {/* {data?.addedTip && ( */}
            <View style={styles.field}>
              <Typo size={14} color={colors.NEUTRAL800}>
                Added Tip
              </Typo>
              <Typo fontFamily="Medium" size={16} color={colors.NEUTRAL800}>
                ₹ {10}
              </Typo>
            </View>
          {/* )} */}

          {/* {data?.discountedAmount && ( */}
            <View style={styles.field}>
              <Typo size={14} color={colors.NEUTRAL800}>
                Discount {' (COUPONUSED)'}
              </Typo>
              <Typo fontFamily="Medium" size={16} color={colors.NEUTRAL800}>
                ₹ {'-'}
              </Typo>
            </View>
          {/* )} */}

          <View style={styles.field}>
            <Typo size={14} color={colors.NEUTRAL800}>
              Taxes & Fees
            </Typo>
            <Typo fontFamily="Medium" size={16} color={colors.NEUTRAL800}>
              ₹ {data?.taxAmount?.toFixed(2)}
            </Typo>
          </View>

          <View
            style={{
              borderWidth: 0.6,
              borderColor: colors.NEUTRAL300,
              width: "100%",
              alignSelf: "center",
              marginVertical: verticalScale(5),
            }}
          />

          <View style={styles.field}>
            <Typo size={14} color={colors.NEUTRAL800}>
              Grand Total
            </Typo>
            <Typo fontFamily="Medium" size={16} color={colors.NEUTRAL800}>
            ₹ {'95'}
            </Typo>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              gap: spacingX._10,
              marginTop: verticalScale(15),
            }}
          >
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

export default Pickdropbill;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(20),
    marginVertical: verticalScale(20),
  },
  field: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
