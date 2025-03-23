import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import {
  getAllOrder,
  removeOrderById,
} from "@/localDB/controller/orderController";
import Typo from "@/components/Typo";
import { colors, radius, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import { useMutation } from "@tanstack/react-query";
import { cancelOrder } from "@/service/universal";
import dayjs from "dayjs";

interface TemporaryOrderProps {
  orderId: string;
  createdAt: string;
  deliveryMode: string;
  merchantName: string;
}

const TemporaryOrderSheet = () => {
  const [tempOrders, setTempOrders] = useState<TemporaryOrderProps[]>([]);
  const [selected, setSelected] = useState<string>("");

  useEffect(() => {
    const fetchOrders = async () => {
      const orders = await getAllOrder();
      setTempOrders(orders);
    };

    fetchOrders();
  }, []);

  const handleCancelOrderMutation = useMutation({
    mutationKey: ["cancel-order"],
    mutationFn: ({
      orderId,
      deliveryMode,
    }: {
      orderId: string;
      deliveryMode: string;
    }) => cancelOrder(orderId, deliveryMode),
    onSuccess: (data) => {
      if (data.success) {
        removeOrderById(selected);
        setTempOrders((prev) =>
          prev.filter((order) => order.orderId !== selected)
        );
        setSelected("");
      }
    },
  });

  const renderTemporary = ({ item }: { item: TemporaryOrderProps }) => {
    return (
      <View style={styles.orderContainer}>
        <View style={{ gap: spacingY._5 }}>
          {item.deliveryMode === "Universal" && (
            <Typo size={13} color={colors.NEUTRAL900}>
              Order from
            </Typo>
          )}
          <Typo size={16} color={colors.NEUTRAL900} fontFamily="SemiBold">
            {item.merchantName ? item.merchantName : item.deliveryMode}
          </Typo>
          <Typo size={14} color={colors.NEUTRAL900} fontFamily="Medium">
            {dayjs(new Date(item.createdAt)).format("DD/MM/YYYY | hh:mm A")}
          </Typo>
        </View>

        <Pressable
          onPress={() => {
            setSelected(item.orderId);
            handleCancelOrderMutation.mutate({
              orderId: item.orderId,
              deliveryMode: item.deliveryMode,
            });
          }}
          style={styles.cancelBtn}
        >
          {item.orderId === selected && handleCancelOrderMutation.isPending ? (
            <ActivityIndicator size="small" color={colors.WHITE} />
          ) : (
            <Typo size={13} color={colors.WHITE}>
              Cancel
            </Typo>
          )}
        </Pressable>
      </View>
    );
  };

  return (
    <BottomSheetScrollView style={styles.container}>
      <Typo size={18} color={colors.PRIMARY} fontFamily="SemiBold">
        Orders
      </Typo>

      <FlatList
        data={tempOrders}
        renderItem={renderTemporary}
        keyExtractor={(item) => item.orderId}
        scrollEnabled={false}
        contentContainerStyle={{ marginTop: verticalScale(20) }}
        ItemSeparatorComponent={() => (
          <View style={{ marginVertical: verticalScale(10) }} />
        )}
      />
    </BottomSheetScrollView>
  );
};

export default TemporaryOrderSheet;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(15),
  },
  orderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cancelBtn: {
    backgroundColor: colors.RED,
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(10),
    borderRadius: radius._10,
  },
});
