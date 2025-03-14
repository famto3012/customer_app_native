import { FlatList, ScrollView, StyleSheet, View } from "react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import Typo from "@/components/Typo";
import { colors, radius, spacingX } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import { router, useLocalSearchParams } from "expo-router";
import { PickAndDropItemProps } from "@/types";
import ItemCard from "@/components/pickandDrop/ItemCard";
import Button from "@/components/Button";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { commonStyles } from "@/constants/commonStyles";
import PickAndDropItemSheet from "@/components/BottomSheets/pickAndDrop/PickAndDropItemSheet";
import { Warning } from "phosphor-react-native";
import VehicleCard from "@/components/pickandDrop/VehicleCard";
import VehicleDetail from "@/components/BottomSheets/pickAndDrop/VehicleDetail";
import { pickAndDropVehicleDetail } from "@/utils/defaultData";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addPickAndDropItems,
  getVehicleDetails,
} from "@/service/pickandDropService";

interface DataProps {
  vehicleType: string;
  deliveryCharges: number | null;
}

const PickAndDropDetail = () => {
  const [items, setItems] = useState<PickAndDropItemProps[]>([]);
  const [selectedItem, setSelectedItem] = useState<{
    index: number;
    item: PickAndDropItemProps;
  } | null>(null);
  const [viewVehicle, setViewVehicle] = useState<string>("");
  const [data, setData] = useState<DataProps>({
    vehicleType: "",
    deliveryCharges: null,
  });

  const { item, cartId } = useLocalSearchParams();

  const addItemSheetRef = useRef<BottomSheet>(null);
  const editItemSheetRef = useRef<BottomSheet>(null);
  const vehicleSheetRef = useRef<BottomSheet>(null);

  const addItemSheetSnapPoints = useMemo(() => ["60%"], []);
  const editItemSheetSnapPoints = useMemo(() => ["60%"], []);
  const vehicleSheetSnapPoints = useMemo(() => ["30%"], []);

  useEffect(() => {
    if (typeof item === "string") {
      try {
        const parsedItem = JSON.parse(item);
        if (Array.isArray(parsedItem)) {
          setItems(parsedItem);
        } else {
          setItems([parsedItem]);
        }
      } catch (error) {
        console.error("Error parsing item:", error);
      }
    }
  }, [item]);

  const { data: vehicleData } = useQuery({
    queryKey: ["vehicle-detail"],
    queryFn: () => getVehicleDetails(cartId.toString()),
  });

  const handleAddItemsMutation = useMutation({
    mutationKey: ["add-pick-and-drop-items"],
    mutationFn: ({
      items,
      vehicleType,
      deliveryCharges,
    }: {
      items: PickAndDropItemProps[];
      vehicleType: string;
      deliveryCharges: number;
    }) => addPickAndDropItems(items, vehicleType, deliveryCharges),
    onSuccess: (data) => {
      if (data.cartId) {
        router.push({
          pathname: "/screens/pickAndDrop/Pick-Drop-Checkout",
          params: {
            cartId: data.cartId,
            items: JSON.stringify(data.items),
          },
        });
      }
    },
  });

  const handleProceed = () => {
    const formattedItems: PickAndDropItemProps[] =
      items?.map((item) => ({
        itemName: item.itemName,
        length: Number(item.length),
        width: Number(item.width),
        height: Number(item.height),
        unit: "cm",
        weight: Number(item.weight),
      })) || [];

    handleAddItemsMutation.mutate({
      items: formattedItems,
      vehicleType: data.vehicleType,
      deliveryCharges: data.deliveryCharges || 0,
    });
  };

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
        <Header title="Pick & Drop" />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ marginVertical: verticalScale(20) }}>
            <Typo
              size={14}
              fontFamily="Medium"
              color={colors.NEUTRAL900}
              style={{ marginHorizontal: scale(20) }}
            >
              Package Details
            </Typo>

            <FlatList
              data={items || []}
              renderItem={({ item, index }) => (
                <ItemCard
                  item={item || []}
                  onEditItem={(item: PickAndDropItemProps, index: number) => {
                    setSelectedItem({ item, index });
                    addItemSheetRef.current?.expand();
                  }}
                  onDeleteItem={(itemIndex: number) =>
                    setItems((prevItems) =>
                      prevItems.filter((_, index) => index !== itemIndex)
                    )
                  }
                  index={index}
                />
              )}
              keyExtractor={(_, index) => index.toString()}
              scrollEnabled={false}
              contentContainerStyle={{
                paddingHorizontal: scale(20),
                marginTop: verticalScale(20),
                marginBottom: verticalScale(10),
              }}
              ItemSeparatorComponent={() => (
                <View style={{ marginVertical: verticalScale(10) }} />
              )}
              ListFooterComponent={
                <>
                  <Button
                    title="Add more"
                    onPress={() => addItemSheetRef.current?.expand()}
                    style={{
                      backgroundColor: colors.PRIMARY_LIGHT,
                      marginTop: verticalScale(20),
                    }}
                    labelColor={colors.PRIMARY}
                  />

                  <View style={styles.warning}>
                    <Warning color={colors.RED} />

                    <Typo size={12} color={colors.RED} style={{ width: "95%" }}>
                      Please enter the accurate weight and dimensions to avoid
                      additional charges.
                    </Typo>
                  </View>

                  <VehicleCard
                    data={vehicleData}
                    onVehicleSelect={(
                      vehicleType: string,
                      deliveryCharges: number
                    ) => setData({ ...data, vehicleType, deliveryCharges })}
                    onViewVehicle={(data: string) => {
                      setViewVehicle(data);
                      vehicleSheetRef.current?.expand();
                    }}
                  />
                </>
              }
            />
          </View>
        </ScrollView>

        <View
          style={{
            paddingVertical: verticalScale(20),
            paddingHorizontal: scale(20),
          }}
        >
          <Button
            title="Proceed"
            onPress={handleProceed}
            isLoading={handleAddItemsMutation.isPending}
          />
        </View>
      </ScreenWrapper>

      <BottomSheet
        ref={addItemSheetRef}
        index={-1}
        snapPoints={addItemSheetSnapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <PickAndDropItemSheet
          heading="Add Item"
          buttonLabel="Confirm"
          onConfirm={(data: PickAndDropItemProps) => {
            setItems([...items, data]);
            addItemSheetRef.current?.close();
          }}
          isLoading={false}
        />
      </BottomSheet>

      <BottomSheet
        ref={editItemSheetRef}
        index={-1}
        snapPoints={editItemSheetSnapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <PickAndDropItemSheet
          heading="Edit Item"
          buttonLabel="Save"
          onConfirm={(data: PickAndDropItemProps) => {
            setItems((prevItems) =>
              prevItems.map((item, idx) =>
                idx === selectedItem?.index ? data : item
              )
            );

            setSelectedItem(null);
            editItemSheetRef.current?.close();
          }}
          isLoading={false}
          itemData={selectedItem?.item?.itemName ? selectedItem.item : null}
        />
      </BottomSheet>

      <BottomSheet
        ref={vehicleSheetRef}
        index={-1}
        snapPoints={vehicleSheetSnapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <VehicleDetail
          data={
            pickAndDropVehicleDetail.find(
              (vehicle) => vehicle.name === viewVehicle
            ) || pickAndDropVehicleDetail[0]
          }
        />
      </BottomSheet>
    </>
  );
};

export default PickAndDropDetail;

const styles = StyleSheet.create({
  warning: {
    backgroundColor: colors.LIGHT_RED,
    marginVertical: verticalScale(20),
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(10),
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._20,
    borderRadius: radius._10,
  },
});
