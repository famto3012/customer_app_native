import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { FC, useEffect, useState } from "react";
import { scale, SCREEN_WIDTH, verticalScale } from "@/utils/styling";
import { colors, radius, spacingX } from "@/constants/theme";
import Typo from "../Typo";
import Input from "../Input";
import Button from "../Button";
import { CustomOrderItemsProps } from "@/types";
import * as ImagePicker from "expo-image-picker";
import { useMutation } from "@tanstack/react-query";
import { editItemDetail } from "@/service/customOrderService";
import { XCircle } from "phosphor-react-native";
import { Dropdown } from "react-native-element-dropdown";
import { unitData } from "@/utils/defaultData";

const EditItem: FC<{
  item: CustomOrderItemsProps | null;
  onEditItem: (data: CustomOrderItemsProps[]) => void;
  onViewImage: (data: CustomOrderItemsProps) => void;
}> = ({ item, onEditItem, onViewImage }) => {
  const [itemData, setItemData] = useState<CustomOrderItemsProps>({
    itemId: "",
    itemName: "",
    quantity: "",
    numOfUnits: 1,
    unit: "kg",
    itemImage: "",
  });

  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    item && setItemData(item);
  }, [item]);

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
      setImage(result.assets[0].uri);
    }
  };

  const handleEditItemMutation = useMutation({
    mutationKey: ["edit-item"],
    mutationFn: (data: FormData) =>
      editItemDetail(itemData?.itemId || "", data),
    onSuccess: (data) => {
      onEditItem(data);
    },
  });

  const handleSave = (data: CustomOrderItemsProps) => {
    if (!itemData.itemName || !itemData.quantity || !itemData.unit) {
      Alert.alert("Error", "Please add item details");
      return;
    }

    const formDataObject = new FormData();

    function appendFormData(value: any, key: string) {
      if (value !== undefined && value !== null) {
        formDataObject.append(key, value);
      }
    }

    Object.entries(data).forEach(([key, value]) => {
      appendFormData(value, key);
    });

    if (image) {
      const fileName = image.split("/").pop();
      const fileType = fileName?.split(".").pop() || "jpg";

      formDataObject.append("itemImage", {
        uri: image,
        name: `custom-order-item-image.${fileType}`,
        type: `image/${fileType}`,
      } as any);
    }

    handleEditItemMutation.mutate(formDataObject);
  };

  return (
    <View style={styles.container}>
      <View style={styles.dataContainer}>
        <Typo size={13} color={colors.NEUTRAL900}>
          Item name
        </Typo>
        <Input
          value={itemData?.itemName || ""}
          onChangeText={(data) => setItemData({ ...itemData, itemName: data })}
        />
      </View>

      <View style={styles.dataContainer}>
        <Typo
          size={13}
          color={colors.NEUTRAL900}
          style={{ width: SCREEN_WIDTH * 0.2 }}
        >
          Quantity
        </Typo>
        <Input
          value={itemData?.quantity?.toString() || ""}
          onChangeText={(data) =>
            setItemData({ ...itemData, quantity: Number(data) })
          }
          keyboardType="numeric"
        />
        <Dropdown
          data={unitData}
          labelField="label"
          valueField="value"
          placeholder="Unit"
          placeholderStyle={{
            fontSize: 16,
          }}
          onChange={(data: { label: string; value: string }) =>
            setItemData({ ...itemData, unit: data.value })
          }
          value={itemData.unit}
          style={{
            height: verticalScale(45),
            borderColor: colors.NEUTRAL300,
            backgroundColor: colors.WHITE,
            borderWidth: 1,
            borderRadius: radius._10,
            paddingHorizontal: scale(10),
            width: SCREEN_WIDTH * 0.2,
          }}
          mode="auto"
        />
      </View>

      <View style={styles.unit}>
        <Typo size={13} color={colors.NEUTRAL900}>
          Number of units
        </Typo>

        <View style={styles.actionBtn}>
          <TouchableOpacity
            onPress={() => {
              if (itemData?.numOfUnits === 1) return;
              setItemData({
                ...itemData,
                numOfUnits: itemData?.numOfUnits ? itemData?.numOfUnits - 1 : 1,
              });
            }}
            style={styles.btn}
          >
            <Typo size={14} color={colors.PRIMARY}>
              -
            </Typo>
          </TouchableOpacity>
          <Typo size={16} color={colors.PRIMARY} fontFamily="Medium">
            {itemData?.numOfUnits}
          </Typo>
          <TouchableOpacity
            onPress={() => {
              if (itemData?.numOfUnits === 99) return;
              setItemData({
                ...itemData,
                numOfUnits: itemData?.numOfUnits + 1,
              });
            }}
            style={styles.btn}
          >
            <Typo size={14} color={colors.PRIMARY}>
              +
            </Typo>
          </TouchableOpacity>
        </View>
      </View>

      <View>
        {itemData?.itemImage ? (
          <View style={styles.imageContainer}>
            <Pressable
              onPress={() => onViewImage(itemData)}
              style={styles.imageBox}
            >
              <Image
                source={require("@/assets/icons/paperclip.webp")}
                style={styles.galleryImage}
                resizeMode="cover"
              />

              <Typo
                size={13}
                color={colors.NEUTRAL900}
                style={{ width: "70%" }}
                textProps={{ numberOfLines: 1 }}
              >
                {itemData.itemName} Image
              </Typo>
            </Pressable>
            <Pressable onPress={() => setImage(null)} style={styles.clearBtn}>
              <XCircle size={30} color={colors.RED} />
            </Pressable>
          </View>
        ) : image ? (
          <View style={styles.imageContainer}>
            <View style={styles.imageBox}>
              <Image
                source={require("@/assets/icons/paperclip.webp")}
                style={styles.galleryImage}
                resizeMode="cover"
              />
              <Pressable onPress={() => {}}>
                <Typo
                  size={13}
                  color={colors.NEUTRAL900}
                  style={{ width: "70%" }}
                  textProps={{ numberOfLines: 1 }}
                >
                  {image.split("/").pop()}
                </Typo>
              </Pressable>
            </View>
            <Pressable onPress={() => setImage(null)} style={styles.clearBtn}>
              <XCircle size={30} color={colors.RED} />
            </Pressable>
          </View>
        ) : (
          <Pressable onPress={handleSelectFile} style={styles.uploadImage}>
            <Image
              source={require("@/assets/icons/gallery.webp")}
              style={styles.galleryImage}
              resizeMode="cover"
            />
            <Typo size={14} color={colors.PRIMARY}>
              Upload Photo
            </Typo>
          </Pressable>
        )}
      </View>

      <View style={styles.btnContainer}>
        <Button
          title="Save"
          onPress={() => {
            handleSave(itemData);
          }}
          isLoading={handleEditItemMutation.isPending}
        />
      </View>
    </View>
  );
};

export default EditItem;

const styles = StyleSheet.create({
  container: {
    marginVertical: verticalScale(15),
  },
  dataContainer: {
    flexDirection: "row",
    gap: spacingX._15,
    alignItems: "center",
    marginVertical: verticalScale(10),
  },
  unit: {
    flexDirection: "row",
    gap: spacingX._15,
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: verticalScale(10),
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
  imageContainer: {
    backgroundColor: colors.NEUTRAL100,
    borderRadius: radius._10,
    marginTop: verticalScale(10),
    flexDirection: "row",
    alignItems: "center",
  },
  imageBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  galleryImage: {
    height: verticalScale(24),
    width: scale(24),
    marginHorizontal: scale(10),
  },
  clearBtn: {
    padding: scale(10),
  },
  uploadImage: {
    height: verticalScale(45),
    borderRadius: radius._30,
    backgroundColor: colors.WHITE,
    borderWidth: 1,
    borderColor: colors.NEUTRAL300,
    marginTop: verticalScale(10),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonAnyStore: {
    flex: 1,
    backgroundColor: colors.PRIMARY_LIGHT,
  },
  buttonFromMap: {
    flex: 1,
  },
  btnContainer: {
    marginTop: verticalScale(20),
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._15,
  },
});
