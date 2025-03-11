import { Image, StyleSheet, View } from "react-native";
import { useCallback, useMemo, useRef } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  SCREEN_HEIGHT,
} from "@gorhom/bottom-sheet";
import { scale, verticalScale } from "@/utils/styling";
import { colors, radius, spacingX } from "@/constants/theme";
import Button from "@/components/Button";
import Typo from "@/components/Typo";
import CustomOrderBottomSheet from "../../../components/BottomSheets/customOrder/CustomOrderBottomSheet";
import CustomOrderLocationBottomSheet from "@/components/BottomSheets/customOrder/CustomOrderLocationBottomSheet";
import { commonStyles } from "@/constants/commonStyles";
import { customOrderDetails } from "@/utils/defaultData";

const CustomOrderHome = () => {
  const infoSheetRef = useRef<BottomSheet>(null);
  const locationSheetRef = useRef<BottomSheet>(null);

  const InfoSnapPoints = useMemo(() => ["60%"], []);
  const locationSnapPoints = useMemo(() => ["25%"], []);

  const closeInfo = () => infoSheetRef.current?.close();
  const closeLocation = () => locationSheetRef.current?.close();

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
    <>
      <ScreenWrapper>
        <Header
          title="Custom Order"
          icon={require("@/assets/icons/info-circle.webp")}
          onPress={() => infoSheetRef.current?.expand()}
          showRightIcon
        />

        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Image
            source={require("@/assets/images/custom-order-banner.webp")}
            style={styles.image}
            resizeMode="contain"
          />

          <Typo size={15} fontFamily="SemiBold" color={colors.NEUTRAL900}>
            Shop not found on our list
          </Typo>
          <Typo
            size={13}
            color={colors.NEUTRAL400}
            style={{ paddingTop: verticalScale(6) }}
          >
            Pinpoint the location on map
          </Typo>
        </View>

        <View style={styles.detailContainer}>
          <Typo
            size={14}
            fontFamily="Medium"
            color={colors.NEUTRAL900}
            style={{ paddingBottom: verticalScale(15) }}
          >
            Things to remember
          </Typo>

          {customOrderDetails?.map((detail, index) => (
            <View key={index} style={styles.detail}>
              <Typo>•</Typo>
              <Typo size={13}>{detail}</Typo>
            </View>
          ))}
        </View>

        <View style={styles.button}>
          <Button
            title="Place your order"
            onPress={() => locationSheetRef.current?.expand()}
          />
        </View>
      </ScreenWrapper>

      <BottomSheet
        ref={infoSheetRef}
        index={-1}
        snapPoints={InfoSnapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <CustomOrderBottomSheet onPress={closeInfo} />
      </BottomSheet>

      <BottomSheet
        ref={locationSheetRef}
        index={-1}
        snapPoints={locationSnapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <CustomOrderLocationBottomSheet onPress={closeLocation} />
      </BottomSheet>
    </>
  );
};

export default CustomOrderHome;

const styles = StyleSheet.create({
  image: {
    width: scale(300),
    height: verticalScale(300),
    borderRadius: radius._10,
    alignSelf: "center",
  },
  detailContainer: {
    backgroundColor: colors.NEUTRAL100,
    marginHorizontal: scale(20),
    marginTop: verticalScale(20),
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(20),
    borderRadius: radius._10,
  },
  detail: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(10),
    gap: spacingX._10,
  },
  button: {
    marginVertical: verticalScale(30),
    marginHorizontal: scale(20),
  },
});
