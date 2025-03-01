import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useMemo, useRef, useState } from "react";
import BottomSheet, {
  BottomSheetScrollView,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from "@gorhom/bottom-sheet";
import Typo from "@/components/Typo";
import { colors, radius } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import Input from "@/components/Input";
import { Dropdown } from "react-native-element-dropdown";
import { unitData } from "@/utils/defaultData";
import { CaretDown, XCircle } from "phosphor-react-native";
import Button from "@/components/Button";
import * as ImagePicker from "expo-image-picker";

const AddItemBottomSheet = () => {
  const [items, setItems] = useState<{
    itemName: string;
    quantity: number;
    noOfUnits: number;
    unit: string;
    imageURL: string;
  }>({
    itemName: "",
    quantity: 0,
    noOfUnits: 0,
    unit: "",
    imageURL: "",
  });

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

  return (
    <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerContainer}>
        <Typo size={15} fontFamily="SemiBold" color={colors.PRIMARY}>
          Add Item
        </Typo>
      </View>
      <View
        style={{
          marginVertical: verticalScale(10),
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
            onChangeText={(text) => setItems({ ...items, itemName: text })}
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
                  noOfUnits:
                    items.noOfUnits === 0
                      ? items.noOfUnits
                      : items.noOfUnits - 1,
                })
              }
              style={styles.btn}
            >
              <Typo size={14} color={colors.PRIMARY}>
                -
              </Typo>
            </TouchableOpacity>
            <Typo size={16} color={colors.PRIMARY} fontFamily="Medium">
              {items?.noOfUnits}
            </Typo>
            <TouchableOpacity
              onPress={() =>
                setItems({ ...items, noOfUnits: items.noOfUnits + 1 })
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
                  onPress={() => bottomSheetViewImageRef.current?.expand()}
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
            <Pressable onPress={handleSelectFile} style={styles.uploadImage}>
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
              console.log("Add more");
              bottomSheetAddItemRef.current?.expand();
            }}
            style={styles.buttonAnyStore}
          />
          <Button
            title="Ok"
            onPress={() => {
              console.log("Ok");
            }}
            style={styles.buttonFromMap}
          />
        </View>
      </View>
    </BottomSheetScrollView>
  );
};

export default AddItemBottomSheet;

const styles = StyleSheet.create({
  contentContainer: {
    padding: scale(20),
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: scale(5),
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
});
