import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import Typo from "@/components/Typo";
import { colors, radius } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from "@gorhom/bottom-sheet";
import { router, useLocalSearchParams } from "expo-router";
import Input from "@/components/Input";
import { Dropdown } from "react-native-element-dropdown";
import {
  CaretDown,
  CaretUp,
  CaretUpDown,
  XCircle,
} from "phosphor-react-native";
import { unitData } from "@/utils/defaultData";
import { Pressable } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Button from "@/components/Button";
import AddItemBottomSheet from "@/components/BottomSheets/customOrder/AddItemBottomSheet";
import EditItemBottomSheet from "@/components/BottomSheets/customOrder/EditItemBottomSheet";
import ViewImageBottomSheet from "@/components/BottomSheets/customOrder/ViewImageBottomSheet";
import { useMutation } from "@tanstack/react-query";
import { addItemDetail } from "@/service/customOrderService";
import { ItemsProps } from "@/types";

const CustomOrderCheckout = () => {
  const [items, setItems] = useState<ItemsProps>({
    itemName: "",
    quantity: 0,
    numOfUnits: 0,
    unit: "",
    imageURL: "",
  });
  const [cartId, setCartId] = useState<string | null>(null);
  const [done, setDone] = useState<boolean | null>(false);

  const { storeName, location } = useLocalSearchParams();

  const bottomSheetAddItemRef = useRef<BottomSheet>(null);
  const variantSheetAddItemSnapPoints = useMemo(() => {
    const percentageHeight = SCREEN_HEIGHT * 0.55; // 50% of screen height
    return [percentageHeight];
  }, []);

  const bottomSheetEditItemRef = useRef<BottomSheet>(null);
  const variantSheetEditItemSnapPoints = useMemo(() => {
    const percentageHeight = SCREEN_HEIGHT * 0.55; // 50% of screen height
    return [percentageHeight];
  }, []);

  const bottomSheetViewImageRef = useRef<BottomSheet>(null);
  const variantSheetViewImageSnapPoints = useMemo(() => {
    const percentageHeight = SCREEN_HEIGHT * 0.55; // 50% of screen height
    return [percentageHeight];
  }, []);

  console.log("StoreName", storeName);
  console.log("Location", location);

  const handleSelectFile = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Error",
        "Sorry, we need media library permissions to make this work!"
      );
      return;
    }

    // Launch image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      console.log("Image", result.assets[0].uri);
      setItems({ ...items, imageURL: result.assets[0].uri });
    }
  };

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

  const handleAddItemMutation = useMutation({
    mutationKey: ["add-item"],
    mutationFn: (items: FormData) => addItemDetail(items),
    onSuccess: (data) => {
      console.log("Data", data);
      setCartId(data?.cartId);
      setDone(true);
    },
  });

  const handleAddItem = (data: ItemsProps) => {
    const formDataObject = new FormData();

    function appendFormData(value: any, key: string) {
      if (value !== undefined && value !== null && key !== "imageURL") {
        // Exclude imageURL
        formDataObject.append(key, value);
      }
    }

    // Append all fields except imageURL
    Object.entries(data)
      .filter(([key]) => key !== "imageURL") // Exclude imageURL
      .forEach(([key, value]) => {
        appendFormData(value, key);
      });

    // Append image separately if it exists
    if (items?.imageURL) {
      const fileName = items.imageURL.split("/").pop(); // Extract filename
      const fileType = fileName?.split(".").pop() || "jpg"; // Default to jpg

      formDataObject.append("itemImage", {
        uri: items.imageURL,
        name: fileName, // Use extracted filename
        type: `image/${fileType}`,
      } as any); // Cast to avoid TypeScript error
    }

    handleAddItemMutation.mutate(formDataObject);
  };

  console.log("cartId", cartId);

  return (
    <ScreenWrapper>
      <ScrollView>
        <Header title="Custom Order" />
        <View style={styles.addressContainer}>
          <Typo
            size={storeName === "Buy from any store" ? 14 : 16}
            fontFamily="Medium"
            color={colors.NEUTRAL900}
          >
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
            style={{ marginHorizontal: scale(20) }}
          >
            Add Items to buy
          </Typo>
          {items.itemName &&
          items.imageURL &&
          items.numOfUnits &&
          items.quantity &&
          items.unit &&
          done ? (
            <Text>Items added yet.</Text>
          ) : (
            <View
              style={{
                paddingHorizontal: scale(20),
                marginVertical: verticalScale(15),
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  gap: scale(15),
                  alignItems: "center",
                  marginVertical: verticalScale(10),
                }}
              >
                <Typo size={13} color={colors.NEUTRAL900}>
                  Item name
                </Typo>
                <Input
                  value={items.itemName}
                  onChangeText={(text) =>
                    setItems({ ...items, itemName: text })
                  }
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  gap: scale(15),
                  alignItems: "center",
                  marginVertical: verticalScale(10),
                }}
              >
                <Typo
                  size={13}
                  color={colors.NEUTRAL900}
                  style={{ width: SCREEN_WIDTH * 0.2 }}
                >
                  Quantity
                </Typo>
                <Input
                  value={items.quantity.toString()}
                  onChangeText={(text) =>
                    setItems({ ...items, quantity: Number(text) || 0 })
                  }
                />
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={unitData}
                  maxHeight={SCREEN_HEIGHT * 0.3}
                  labelField="label"
                  valueField="value"
                  placeholder={"Units"}
                  value={items.unit}
                  onChange={(item) => {
                    setItems({ ...items, unit: item.value });
                  }}
                  renderRightIcon={() => <CaretDown size={20} />}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  gap: scale(15),
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginVertical: verticalScale(10),
                }}
              >
                <Typo size={13} color={colors.NEUTRAL900}>
                  Number of units
                </Typo>

                <View style={[styles.actionBtn]}>
                  <TouchableOpacity
                    onPress={() =>
                      setItems({
                        ...items,
                        numOfUnits:
                          items.numOfUnits === 0
                            ? items.numOfUnits
                            : items.numOfUnits - 1,
                      })
                    }
                    style={styles.btn}
                  >
                    <Typo size={14} color={colors.PRIMARY}>
                      -
                    </Typo>
                  </TouchableOpacity>
                  <Typo size={16} color={colors.PRIMARY} fontFamily="Medium">
                    {items?.numOfUnits}
                  </Typo>
                  <TouchableOpacity
                    onPress={() =>
                      setItems({ ...items, numOfUnits: items.numOfUnits + 1 })
                    }
                    style={styles.btn}
                  >
                    <Typo size={14} color={colors.PRIMARY}>
                      +
                    </Typo>
                  </TouchableOpacity>
                </View>
              </View>
              <View>
                {items?.imageURL ? (
                  <View
                    style={{
                      width: SCREEN_WIDTH * 0.9,
                      backgroundColor: colors.NEUTRAL100,
                      padding: scale(10),
                      borderRadius: radius._20,
                      marginVertical: verticalScale(10),
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        flex: 1,
                        alignItems: "center",
                      }}
                    >
                      <Image
                        source={require("@/assets/icons/paperclip.webp")}
                        style={{
                          height: 30,
                          width: 30,
                          marginHorizontal: scale(10),
                        }}
                        resizeMode="cover"
                      />
                      <Pressable
                        onPress={() =>
                          bottomSheetViewImageRef.current?.expand()
                        }
                      >
                        <Typo
                          size={13}
                          color={colors.NEUTRAL900}
                          style={{ width: SCREEN_WIDTH * 0.4 }}
                        >
                          {items?.imageURL.split("/").pop()}
                        </Typo>
                      </Pressable>
                    </View>
                    <Pressable
                      onPress={() => setItems({ ...items, imageURL: "" })}
                      style={styles.clearBtn}
                    >
                      <XCircle size={30} color={colors.RED} />
                    </Pressable>
                  </View>
                ) : (
                  <Pressable
                    onPress={handleSelectFile}
                    style={styles.uploadImage}
                  >
                    <Image
                      source={require("@/assets/icons/gallery.webp")}
                      style={{
                        height: 35,
                        width: 35,
                        marginHorizontal: scale(10),
                      }}
                      resizeMode="cover"
                    />
                    <Typo size={14} color={colors.PRIMARY}>
                      Upload Photo
                    </Typo>
                  </Pressable>
                )}
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  title="Add more"
                  onPress={() => {
                    handleAddItem(items);
                    bottomSheetAddItemRef.current?.expand();
                  }}
                  style={styles.buttonAnyStore}
                />
                <Button
                  title="Ok"
                  onPress={() => {
                    handleAddItem(items);
                  }}
                  style={styles.buttonFromMap}
                />
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      <BottomSheet
        ref={bottomSheetAddItemRef}
        index={-1}
        snapPoints={variantSheetAddItemSnapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <AddItemBottomSheet />
      </BottomSheet>
      <BottomSheet
        ref={bottomSheetEditItemRef}
        index={-1}
        snapPoints={variantSheetEditItemSnapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <EditItemBottomSheet />
      </BottomSheet>
      <BottomSheet
        ref={bottomSheetViewImageRef}
        index={-1}
        snapPoints={variantSheetViewImageSnapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <ViewImageBottomSheet data={items} />
      </BottomSheet>
    </ScreenWrapper>
  );
};

export default CustomOrderCheckout;

const styles = StyleSheet.create({
  addressContainer: {
    marginVertical: verticalScale(20),
    width: SCREEN_WIDTH,
    borderRadius: radius._10,
    padding: scale(20),
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
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 1)",
  },
});
