import { StyleSheet, View } from "react-native";
import { useCallback, useMemo, useRef } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  SCREEN_WIDTH,
} from "@gorhom/bottom-sheet";
import Button from "@/components/Button";
import AddStoreDetail from "@/components/BottomSheets/customOrder/AddStoreDetail";
import { commonStyles } from "@/constants/commonStyles";
import { verticalScale } from "@/utils/styling";
import Map from "@/components/common/Map";

const CustomOrderMap = () => {
  const addStoreSheetRef = useRef<BottomSheet>(null);

  const addStoreSnapPoints = useMemo(() => ["38%"], []);

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
          title="Add Location"
          icon={require("@/assets/icons/search-normal.webp")}
          onPress={() => {}}
          showRightIcon
        />

        <View style={styles.mapContainer}>
          <Map />
        </View>

        <Button
          title="Add Store detail"
          onPress={() => addStoreSheetRef.current?.expand()}
          style={styles.button}
        />
      </ScreenWrapper>

      <BottomSheet
        ref={addStoreSheetRef}
        index={-1}
        snapPoints={addStoreSnapPoints}
        enableDynamicSizing
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <AddStoreDetail addStoreSheetRef={addStoreSheetRef} />
      </BottomSheet>
    </>
  );
};

export default CustomOrderMap;

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    marginTop: verticalScale(20),
  },
  button: {
    width: SCREEN_WIDTH * 0.9,
    marginVertical: verticalScale(20),
  },
});
