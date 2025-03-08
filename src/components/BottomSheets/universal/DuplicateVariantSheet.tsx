import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { FC, useEffect, useState } from "react";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Typo from "@/components/Typo";
import { colors, radius, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import Button from "@/components/Button";
import { ProductProps } from "@/types";
import {
  getItemsWithVariants,
  updateCart,
} from "@/localDB/controller/cartController";
import { useAuthStore } from "@/store/store";

interface DuplicateVariantProps {
  productId: string;
  productName: string;
  quantity: number;
  variantTypeId: string;
  variantTypeName: string;
  price: number;
}

const DuplicateVariantSheet: FC<{
  product: ProductProps | null;
  onNewCustomization: (product: ProductProps | null) => void;
  closeSheet: () => void;
}> = ({ product, onNewCustomization, closeSheet }) => {
  const [localData, setLocalData] = useState<DuplicateVariantProps[]>([]);

  useEffect(() => {
    fetchData();
  }, [product?.productId]);

  const fetchData = async () => {
    const items = await getItemsWithVariants(product?.productId || "");

    setLocalData(items);
  };

  const RenderItem = ({ item }: { item: DuplicateVariantProps }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <View style={{ gap: spacingY._5 }}>
          <Typo
            size={14}
            color={colors.NEUTRAL900}
            fontFamily="SemiBold"
            textProps={{ numberOfLines: 1 }}
            style={{ maxWidth: "85%" }}
          >
            {item.productName}
          </Typo>

          <Typo size={14} fontFamily="Medium">
            {item.price}
          </Typo>

          <Typo size={12}>{item.variantTypeName}</Typo>
        </View>

        <View style={styles.actionBtn}>
          <TouchableOpacity
            onPress={() => {
              const newCount = item.quantity - 1;

              updateCart(
                useAuthStore.getState().selectedMerchant.merchantId || "",
                item.productId,
                item.productName,
                item.price,
                newCount,
                item.variantTypeId,
                item.variantTypeName
              );

              const updatedData = localData
                .filter(
                  (dataItem) =>
                    !(
                      dataItem.productId === item.productId &&
                      dataItem.variantTypeId === item.variantTypeId &&
                      newCount === 0
                    )
                )
                .map((dataItem) =>
                  dataItem.productId === item.productId &&
                  dataItem.variantTypeId === item.variantTypeId
                    ? { ...dataItem, quantity: newCount }
                    : dataItem
                );

              setLocalData(updatedData);

              if (updatedData.length === 0) {
                closeSheet();
              }
            }}
            style={styles.btn}
          >
            <Typo size={14} color={colors.PRIMARY}>
              -
            </Typo>
          </TouchableOpacity>
          <Typo size={16} color={colors.PRIMARY} fontFamily="Medium">
            {item.quantity}
          </Typo>
          <TouchableOpacity
            onPress={() => {
              const newCount = item.quantity + 1;

              updateCart(
                useAuthStore.getState().selectedMerchant.merchantId || "",
                item.productId,
                item.productName,
                item.price,
                newCount,
                item.variantTypeId,
                item.variantTypeName
              );

              const updatedData = localData.map((dataItem) =>
                dataItem.productId === item.productId &&
                dataItem.variantTypeId === item.variantTypeId
                  ? { ...dataItem, quantity: newCount }
                  : dataItem
              );

              setLocalData(updatedData);
            }}
            style={styles.btn}
          >
            <Typo size={14} color={colors.PRIMARY}>
              +
            </Typo>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <BottomSheetScrollView
      contentContainerStyle={{
        flex: 1,
        paddingHorizontal: scale(20),
        marginTop: verticalScale(20),
      }}
    >
      <View style={{ gap: spacingY._10 }}>
        <FlatList
          data={localData}
          renderItem={({ item }) => <RenderItem item={item} />}
          keyExtractor={(_, index) => index.toString()}
          scrollEnabled={false}
          ItemSeparatorComponent={() => (
            <View style={{ marginVertical: verticalScale(10) }} />
          )}
          contentContainerStyle={{ paddingRight: scale(10) }}
        />
      </View>

      <Button
        title="+ Add new Customization"
        onPress={() => onNewCustomization(product)}
        style={{ marginTop: "auto", marginBottom: verticalScale(20) }}
      />
    </BottomSheetScrollView>
  );
};

export default DuplicateVariantSheet;

const styles = StyleSheet.create({
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
    borderRadius: radius._6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  btn: {
    paddingHorizontal: scale(18),
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
});
