import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import Typo from "@/components/Typo";
import { colors, radius } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  SCREEN_WIDTH,
} from "@gorhom/bottom-sheet";
import { router, useLocalSearchParams } from "expo-router";
import AddItemBottomSheet from "@/components/BottomSheets/customOrder/AddItemBottomSheet";
import EditItemBottomSheet from "@/components/BottomSheets/customOrder/EditItemBottomSheet";
import AddItem from "@/components/customOrder/AddItem";
import { CustomOrderItemsProps } from "@/types";
import ItemCard from "@/components/customOrder/ItemCard";
import Button from "@/components/Button";
import CustomOrderImageSheet from "@/components/BottomSheets/customOrder/CustomOrderImageSheet";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addDeliveryAddress,
  deleteItem,
  fetchCustomOrderItems,
} from "@/service/customOrderService";
import Address from "@/components/common/Address";
import Instructions from "@/components/common/Instructions";
import { commonStyles } from "@/constants/commonStyles";
import UserSelectedAddress from "@/components/common/UserSelectedAddress";
import { Portal } from "react-native-paper";
import SelectAddress from "@/components/BottomSheets/user/SelectAddress";

const CustomOrderCheckout = () => {
  const [show, setShow] = useState<boolean>(false);
  const [cartItem, setCartItem] = useState<CustomOrderItemsProps[]>([]);
  const [selectedItem, setSelectedItem] =
    useState<CustomOrderItemsProps | null>(null);
  const [itemId, setItemId] = useState<string>("");
  const [addressData, setAddressData] = useState({
    deliveryAddressType: "home",
    deliveryAddressOtherAddressId: "",
    instructionInDelivery: "",
  });

  const [voiceInstruction, setVoiceInstruction] = useState<string | null>(null);

  const { storeName, location, cartId } = useLocalSearchParams();

  const addItemSheetRef = useRef<BottomSheet>(null);
  const editItemSheetRef = useRef<BottomSheet>(null);
  const itemImageSheetRef = useRef<BottomSheet>(null);

  const addItemSnapPoints = useMemo(() => ["55%"], []);
  const editItemSnapPoints = useMemo(() => ["55%"], []);
  const itemImageSnapPoints = useMemo(() => ["40%"], []);

  const handleAddingItem = (data: CustomOrderItemsProps[]) => {
    setCartItem(data);
  };

  const handleEdit = (item: CustomOrderItemsProps) => {
    setSelectedItem(item);
    editItemSheetRef?.current?.snapToIndex(0);
  };

  const handleEditItem = (data: CustomOrderItemsProps[]) => {
    setCartItem(data);
    editItemSheetRef.current?.close();
    setSelectedItem(null);
  };

  const handleViewImage = (data: CustomOrderItemsProps) => {
    setSelectedItem(data);
    itemImageSheetRef.current?.snapToIndex(0);
  };

  const { data, isLoading, isError } = useQuery<CustomOrderItemsProps[]>({
    queryKey: ["custom-order-items"],
    queryFn: () => fetchCustomOrderItems(cartId.toString()),
    enabled: !!cartId,
  });

  useEffect(() => {
    setCartItem(data || []);
  }, [data]);

  const handleDeleteMutation = useMutation({
    mutationKey: ["delete-item"],
    mutationFn: () => deleteItem(itemId),
    onSuccess: () => {
      setCartItem((prevItems) =>
        prevItems.filter((item) => item.itemId !== itemId)
      );
      setItemId("");
    },
  });

  const handleAddAddressMutation = useMutation({
    mutationKey: ["add-delivery-address"],
    mutationFn: (data: FormData) => addDeliveryAddress(data),
    onSuccess: (cartId) => {
      if (cartId) {
        router.push({
          pathname: "/screens/customOrder/custom-order-bill",
          params: { cartId },
        });
      }
    },
  });

  const handleProceed = () => {
    if (!addressData.deliveryAddressType) {
      Alert.alert("Error", "Please select a delivery address");
      return;
    }

    const formDataObject = new FormData();

    function appendFormData(value: any, key: string) {
      if (value !== undefined && value !== null) {
        formDataObject.append(key, value);
      }
    }

    Object.entries(addressData).forEach(([key, value]) => {
      appendFormData(value, key);
    });

    if (voiceInstruction) {
      const fileName = voiceInstruction.split("/").pop();
      const fileType = fileName?.split(".").pop() || "mp3";

      formDataObject.append("voiceInstructionToDeliveryAgent", {
        uri: voiceInstruction,
        name: `delivery-voice-instruction.${fileType}`,
        type: `audio/${fileType}`,
      } as any);
    }

    handleAddAddressMutation.mutate(formDataObject);
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
    <ScreenWrapper>
      <Header title="Custom Order" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: verticalScale(20) }}
      >
        <View style={styles.addressContainer}>
          <Typo size={16} fontFamily="Medium" color={colors.NEUTRAL900}>
            {storeName}
          </Typo>
          {location && (
            <Typo size={13} color={colors.NEUTRAL400}>
              {location}
            </Typo>
          )}
        </View>

        <View>
          <Typo
            size={14}
            fontFamily="Medium"
            color={colors.NEUTRAL900}
            style={{
              marginHorizontal: scale(20),
              marginTop: verticalScale(10),
            }}
          >
            Add Items to buy
          </Typo>

          {cartItem.length > 0 ? (
            <FlatList
              data={cartItem || []}
              renderItem={({ item }) => (
                <ItemCard
                  item={item}
                  onEditItem={(item) => handleEdit(item)}
                  onViewImage={handleViewImage}
                  onDeleteItem={(itemId) => {
                    setItemId(itemId);
                    handleDeleteMutation.mutate();
                  }}
                  isDeleting={handleDeleteMutation.isPending}
                  deletingId={itemId}
                />
              )}
              keyExtractor={(item, index) =>
                item.itemId?.toString() || index.toString()
              }
              ListEmptyComponent={
                <View>
                  {isLoading && cartItem.length === 0 ? (
                    <ActivityIndicator size="large" color={colors.PRIMARY} />
                  ) : null}
                </View>
              }
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
                <View>
                  <Button
                    title="Add more"
                    onPress={() => addItemSheetRef.current?.snapToIndex(0)}
                    style={{
                      backgroundColor: colors.PRIMARY_LIGHT,
                      marginTop: verticalScale(20),
                    }}
                    labelColor={colors.PRIMARY}
                  />
                </View>
              }
            />
          ) : (
            <View style={{ paddingHorizontal: scale(20) }}>
              <AddItem
                openAddSheet={() => addItemSheetRef.current?.snapToIndex(0)}
                onAddingItem={handleAddingItem}
                onViewImage={handleViewImage}
              />
            </View>
          )}
        </View>

        {cartItem.length > 0 && (
          <View>
            <View style={styles.addressContainer}>
              <Typo size={14} color={colors.NEUTRAL900} fontFamily="Medium">
                Delivery Address
              </Typo>
            </View>

            <UserSelectedAddress onPress={() => setShow(true)} />

            <Instructions
              onChangeText={(data: string) =>
                setAddressData({ ...addressData, instructionInDelivery: data })
              }
              placeholder="Instructions (If any)"
              onRecordComplete={(data: string) => setVoiceInstruction(data)}
            />
          </View>
        )}
      </ScrollView>

      {cartItem?.length > 0 && (
        <View style={styles.btnContainer}>
          <Button
            title="Proceed"
            onPress={handleProceed}
            isLoading={handleAddAddressMutation.isPending}
          />
        </View>
      )}

      <BottomSheet
        ref={addItemSheetRef}
        index={-1}
        snapPoints={addItemSnapPoints}
        enableDynamicSizing
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <AddItemBottomSheet
          onAddingItem={handleAddingItem}
          closeAddSheet={() => addItemSheetRef?.current?.close()}
        />
      </BottomSheet>

      <BottomSheet
        ref={editItemSheetRef}
        index={-1}
        snapPoints={editItemSnapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <EditItemBottomSheet
          item={selectedItem ? selectedItem : null}
          onEditItem={handleEditItem}
          onViewImage={handleViewImage}
        />
      </BottomSheet>

      <BottomSheet
        ref={itemImageSheetRef}
        index={-1}
        snapPoints={itemImageSnapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <CustomOrderImageSheet item={selectedItem ? selectedItem : null} />
      </BottomSheet>

      <Portal>
        <Modal
          visible={show}
          onDismiss={() => setShow(false)}
          onRequestClose={() => setShow(false)}
          animationType="slide"
        >
          <SelectAddress onCloseModal={() => setShow(false)} />
        </Modal>
      </Portal>
    </ScreenWrapper>
  );
};

export default CustomOrderCheckout;

const styles = StyleSheet.create({
  addressContainer: {
    marginTop: verticalScale(20),
    borderRadius: radius._10,
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(20),
    backgroundColor: colors.NEUTRAL100,
  },
  dropdown: {
    height: verticalScale(45),
    borderColor: colors.NEUTRAL300,
    backgroundColor: colors.PRIMARY_LIGHT,
    borderWidth: 1,
    borderRadius: radius._10,
    paddingHorizontal: scale(10),
    width: SCREEN_WIDTH * 0.2,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 20,
  },
  selectedTextStyle: {
    fontSize: 20,
  },
  actionBtn: {
    backgroundColor: colors.WHITE,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    height: verticalScale(34),
    borderRadius: radius._20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  btn: {
    paddingHorizontal: scale(18),
  },
  uploadImage: {
    width: SCREEN_WIDTH * 0.9,
    height: verticalScale(45),
    borderRadius: radius._30,
    backgroundColor: colors.WHITE,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  clearBtn: {
    padding: scale(10),
  },
  buttonAnyStore: {
    marginVertical: scale(20),
    alignSelf: "center",
    width: SCREEN_WIDTH * 0.4,
    backgroundColor: colors.PRIMARY_LIGHT,
    color: colors.PRIMARY,
  },
  buttonFromMap: {
    marginVertical: scale(20),
    alignSelf: "center",
    width: SCREEN_WIDTH * 0.4,
  },
  btnContainer: {
    paddingHorizontal: scale(20),
    marginVertical: verticalScale(20),
  },
});
