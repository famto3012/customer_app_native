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
import { useQuery } from "@tanstack/react-query";
import { useData } from "@/context/DataContext";

interface DuplicateVariantProps {
  productId: string;
  productName: string;
  quantity: number;
  variantTypeId: string;
  variantTypeName: string;
  price: number;
}

const DuplicateVariantSheet: FC<{
  onNewCustomization: () => void;
  closeSheet: () => void;
  openDuplicate: boolean;
}> = ({ onNewCustomization, closeSheet, openDuplicate }) => {
  const [localData, setLocalData] = useState<DuplicateVariantProps[]>([]);

  const { product, setProduct, setProductCounts } = useData();

  const { data } = useQuery({
    queryKey: ["duplicate-variants", product?.productId],
    queryFn: () => getItemsWithVariants(product?.productId as string),
    enabled: !!product?.productId && openDuplicate,
  });

  useEffect(() => {
    if (data && data.length > 0) {
      setLocalData(data);
    }
  }, [data]);

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
                item?.productId,
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

              setProductCounts((prev) => ({
                ...prev,
                [`${item.productId}-${item.variantTypeId}`]: {
                  count: newCount,
                  variantTypeId: item.variantTypeId,
                },
              }));

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

              setProductCounts((prev) => ({
                ...prev,
                [`${item.productId}-${item.variantTypeId}`]: {
                  count: newCount,
                  variantTypeId: item.variantTypeId,
                },
              }));
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
        flexGrow: 1,
        paddingHorizontal: scale(20),
        marginTop: verticalScale(20),
        paddingBottom: verticalScale(20),
      }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ gap: spacingY._10 }}>
        <FlatList
          data={localData}
          renderItem={({ item }) => <RenderItem item={item} />}
          keyExtractor={(_, index) => index.toString()}
          scrollEnabled={false} // Disable FlatList scrolling
          nestedScrollEnabled={true}
          ItemSeparatorComponent={() => (
            <View style={{ marginVertical: verticalScale(5) }} />
          )}
          contentContainerStyle={{
            paddingRight: scale(10),
            paddingBottom: verticalScale(20),
          }}
        />
      </View>

      <Button
        title="+ Add new Customization"
        onPress={() => {
          setProduct(product);
          onNewCustomization();
        }}
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
