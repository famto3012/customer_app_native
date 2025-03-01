import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useMemo, useRef } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import { scale, verticalScale } from "@/utils/styling";
import { MagnifyingGlass } from "phosphor-react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from "@gorhom/bottom-sheet";
import { colors } from "@/constants/theme";
import Button from "@/components/Button";
import AddStoreDetail from "@/components/BottomSheets/customOrder/AddStoreDetail";

const CustomOrderMap = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const variantSheetSnapPoints = useMemo(() => {
    const percentageHeight = SCREEN_HEIGHT * 0.4; // 50% of screen height
    return [percentageHeight];
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        style={[props.style, styles.backdrop]}
        // onPress={handleClosePress}
      />
    ),
    []
  );

  return (
    <>
      <ScreenWrapper>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Header title={"Add Location"} />
          <Pressable onPress={() => console.log("Search")}>
            <MagnifyingGlass
              size={30}
              style={{ marginLeft: scale(-60), paddingRight: scale(60) }}
            />
          </Pressable>
        </View>
        <View style={styles.mapContainer}>
          <Text>Custom Order Map</Text>
        </View>
        <Button
          title="Add Store detail"
          onPress={() => bottomSheetRef.current?.expand()}
          style={styles.button}
        />
      </ScreenWrapper>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={variantSheetSnapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <AddStoreDetail />
      </BottomSheet>
    </>
  );
};

export default CustomOrderMap;

const styles = StyleSheet.create({
  mapContainer: {
    height: SCREEN_HEIGHT * 0.8,
    width: SCREEN_WIDTH,
    backgroundColor: colors.PRIMARY,
    marginVertical: verticalScale(20),
  },
  button: {
    width: SCREEN_WIDTH * 0.9,
    // marginVertical: verticalScale(5),
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 1)",
  },
});
