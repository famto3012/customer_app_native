import PickAndDropItemSheet from "@/components/BottomSheets/pickAndDrop/PickAndDropItemSheet";
import VehicleDetail from "@/components/BottomSheets/pickAndDrop/VehicleDetail";
import Button from "@/components/Button";
import Header from "@/components/Header";
import VehicleLoader from "@/components/Loader/VehicleLoader";
import ItemCard from "@/components/pickandDrop/ItemCard";
import VehicleCard from "@/components/pickandDrop/VehicleCard";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { commonStyles } from "@/constants/commonStyles";
import { colors, radius, spacingX } from "@/constants/theme";
import { useShowAlert } from "@/hooks/useShowAlert";
import {
  proceedPickAndDrop,
  getVehicleDetails,
  updatePickAndDropItems,
} from "@/service/pickandDropService";
import { PickAndDropItemProps } from "@/types";
import { pickAndDropVehicleDetail } from "@/utils/defaultData";
import { scale, verticalScale } from "@/utils/styling";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { Warning } from "phosphor-react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FlatList, Platform, ScrollView, StyleSheet, View } from "react-native";

interface DataProps {
  vehicleType: string;
  deliveryCharges: number | null;
  surgeCharges: number | null;
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
    surgeCharges: null,
  });

  const { item, cartId } = useLocalSearchParams();
  const { showAlert } = useShowAlert();
  const queryClient = useQueryClient();

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

  const { data: vehicleData, isLoading: vehicleLoading } = useQuery({
    queryKey: ["vehicle-detail"],
    queryFn: () => getVehicleDetails(cartId.toString()),
  });

  const handleUpdateItemMutation = useMutation({
    mutationKey: ["update-pick-and-drop-items"],
    mutationFn: (item: PickAndDropItemProps[]) => updatePickAndDropItems(item),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["vehicle-detail"] });
      setItems(variables);
      if (selectedItem) {
        editItemSheetRef.current?.close();
        setSelectedItem(null); 
      } else {
        addItemSheetRef.current?.close();
      }

    },
  });

  const handleProceedMutation = useMutation({
    mutationKey: ["proceed-pick-and-drop"],
    mutationFn: ({
      items,
      vehicleType,
      deliveryCharges,
      surgeCharges,
    }: {
      items: PickAndDropItemProps[];
      vehicleType: string;
      deliveryCharges: number;
      surgeCharges: number;
    }) => proceedPickAndDrop(items, vehicleType, deliveryCharges, surgeCharges),
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
    if (items.length === 0) {
      showAlert("At-least one item is required to proceed the order");
      return;
    }

    const formattedItems: PickAndDropItemProps[] =
      items?.map((item) => ({
        itemName: item.itemName,
        length: Number(item.length),
        width: Number(item.width),
        height: Number(item.height),
        unit: "cm",
        weight: Number(item.weight),
      })) || [];

    handleProceedMutation.mutate({
      items: formattedItems,
      vehicleType: data.vehicleType,
      deliveryCharges: data.deliveryCharges || 0,
      surgeCharges: data.surgeCharges ?? 0,
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
                    editItemSheetRef.current?.expand();
                  }}
                  onDeleteItem={(itemIndex: number) => {
                    const updatedItems = items.filter(
                      (_, index) => index !== itemIndex
                    );

                    handleUpdateItemMutation.mutate(updatedItems);
                  }}
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

                    <Typo size={12} color={colors.RED} style={{ width: "90%" }}>
                      Please enter the accurate weight and dimensions to avoid
                      additional charges.
                    </Typo>
                  </View>

                  {vehicleLoading ? (
                    <VehicleLoader />
                  ) : (
                    <VehicleCard
                      data={vehicleData?.length > 0 ? vehicleData : []}
                      onVehicleSelect={(
                        vehicleType: string,
                        deliveryCharges: number,
                        surgeCharges: number
                      ) =>
                        setData({
                          ...data,
                          vehicleType,
                          deliveryCharges,
                          surgeCharges,
                        })
                      }
                      onViewVehicle={(data: string) => {
                        setViewVehicle(data);
                        vehicleSheetRef.current?.expand();
                      }}
                    />
                  )}
                </>
              }
            />
          </View>
        </ScrollView>

        <View
          style={{
            paddingVertical:
              Platform.OS === "ios" ? verticalScale(30) : verticalScale(20),
            paddingHorizontal: scale(20),
          }}
        >
          <Button
            title="Proceed"
            onPress={handleProceed}
            isLoading={handleProceedMutation.isPending}
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
            const updatedItems = [...items, data];

            handleUpdateItemMutation.mutate(updatedItems);

            return handleUpdateItemMutation.isSuccess;
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
            if (selectedItem?.index === undefined) return false;

            const updatedItems = [...items];
            updatedItems[selectedItem.index] = data;

            handleUpdateItemMutation.mutate(updatedItems);

            return handleUpdateItemMutation.isSuccess;
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
