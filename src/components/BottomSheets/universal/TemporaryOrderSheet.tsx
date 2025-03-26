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
import AlertBox from "@/components/global/AlertBox";
import { useData } from "@/context/DataContext";

interface TemporaryOrderProps {
  orderId: string;
  createdAt: string;
  deliveryMode: string;
  merchantName: string;
}

const TemporaryOrderSheet = ({
  onClose,
  onCancel,
}: {
  onClose: () => void;
  onCancel: () => void;
}) => {
  const [tempOrders, setTempOrders] = useState<TemporaryOrderProps[]>([]);
  const [deletingOrder, setDeletingOrder] = useState<{
    orderId: string;
    deliveryMode: string;
  }>({
    orderId: "",
    deliveryMode: "",
  });

  const { setShowAlert, setAlertData } = useData();

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
    onSuccess: async (data, variables) => {
      if (data.success) {
        await removeOrderById(variables.orderId);

        setTempOrders((prev) =>
          prev.filter((order) => order.orderId !== variables.orderId)
        );

        onCancel();

        const remainingOrders = await getAllOrder();
        if (remainingOrders.length === 0) {
          onClose();
        }

        setDeletingOrder({ orderId: "", deliveryMode: "" });
        setShowAlert(false);
        setAlertData({
          title: "",
          body: "",
          cancelText: "",
          confirmText: "",
        });
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
            setDeletingOrder({
              orderId: item.orderId,
              deliveryMode: item.deliveryMode,
            });
            setAlertData({
              title: "Sure?",
              body: "Are you sure that you want to cancel the order?",
              cancelText: "No",
              confirmText: "Yes, Cancel",
            });
            setShowAlert(true);
          }}
          style={styles.cancelBtn}
        >
          {item.orderId === deletingOrder.orderId &&
          handleCancelOrderMutation.isPending ? (
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
    <>
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

      <AlertBox
        onConfirm={() =>
          handleCancelOrderMutation.mutate({
            orderId: deletingOrder.orderId,
            deliveryMode: deletingOrder.deliveryMode,
          })
        }
        isLoading={handleCancelOrderMutation.isPending}
      />
    </>
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
