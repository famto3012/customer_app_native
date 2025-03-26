import { Image, Pressable, StyleSheet, View } from "react-native";
import { colors, radius, spacingY } from "@/constants/theme";
import { scale, SCREEN_WIDTH, verticalScale } from "@/utils/styling";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";
import Typo from "../Typo";
import { FC, useEffect, useState } from "react";
import { router } from "expo-router";
import {
  getAllOrder,
  removeOrderById,
} from "@/localDB/controller/orderController";

const FloatingPreparingOrder: FC<{
  data: any;
  refetchOngoingOrder: () => void;
  openTempOrderSheet: () => void;
}> = ({ data, refetchOngoingOrder, openTempOrderSheet }) => {
  const [showCountDown, setShowCountDown] = useState(false);
  const [tempOrders, setTempOrders] = useState<
    { orderId: string; createdAt: string }[]
  >([]);
  const [timeLeftMap, setTimeLeftMap] = useState<{ [key: string]: number }>({});

  const orderImage = showCountDown
    ? require("@/assets/images/confirming-order.webp")
    : require("@/assets/images/preparing-order.gif");

  // Fetch orders from local DB
  useEffect(() => {
    const fetchOrders = async () => {
      const orders = await getAllOrder();
      setTempOrders(orders);
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    if (tempOrders.length <= 0) {
      setShowCountDown(false);
      return;
    }

    setShowCountDown(true);

    const interval = setInterval(() => {
      setTimeLeftMap((prev) => {
        const updatedTimeLeftMap = { ...prev };

        tempOrders.forEach((order) => {
          const createdAt = new Date(order.createdAt).getTime();
          const now = Date.now();

          const timeLeft = Math.max(
            60 - Math.floor((now - createdAt) / 1000),
            0
          );

          if (timeLeft === 0) {
            removeOrderById(order.orderId);

            setTempOrders((prevOrders) =>
              prevOrders.filter((o) => o.orderId !== order.orderId)
            );
            refetchOngoingOrder();
          } else {
            updatedTimeLeftMap[order.orderId] = timeLeft;
          }
        });

        return updatedTimeLeftMap;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [tempOrders]);

  const lastOrder = tempOrders.length
    ? tempOrders[tempOrders.length - 1]
    : null;
  const timeLeft = lastOrder ? timeLeftMap[lastOrder.orderId] || 0 : 0;

  return (
    <Animated.View
      entering={FadeInUp.springify().damping(12).stiffness(100)}
      exiting={FadeOutDown.springify().damping(10).stiffness(80)}
      style={[
        styles.container,
        {
          display:
            (data && data.length) || (tempOrders && tempOrders.length)
              ? "flex"
              : "none",
        },
      ]}
    >
      <Image
        source={orderImage}
        style={{ width: scale(50), height: scale(50) }}
        resizeMode="cover"
      />

      <View style={{ width: "60%", flexDirection: "column", gap: spacingY._5 }}>
        <Typo
          size={13}
          fontFamily="SemiBold"
          textProps={{ numberOfLines: 1 }}
          color={colors.NEUTRAL800}
        >
          {showCountDown ? "Confirming" : "Preparing"} your order
        </Typo>
        <Typo size={12} color={colors.NEUTRAL800}>
          {showCountDown ? "Your order will be placed in" : "Exp delivery at"}{" "}
          <Typo size={12} color={colors.PRIMARY}>
            {showCountDown ? `${timeLeft}s` : data?.[0]?.deliveryTime}
          </Typo>
        </Typo>
      </View>

      <Pressable
        onPress={() => {
          showCountDown
            ? openTempOrderSheet()
            : router.push({
                pathname: "/order",
              });
        }}
        style={styles.checkoutBtn}
      >
        <Image
          source={require("@/assets/icons/maximize.webp")}
          style={{ width: scale(30), height: scale(30) }}
          resizeMode="cover"
        />
      </Pressable>
    </Animated.View>
  );
};

export default FloatingPreparingOrder;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.WHITE,
    width: SCREEN_WIDTH - 40,
    marginHorizontal: scale(20),
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(10),
    borderRadius: radius._10,
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 5,
    flexDirection: "row",
    marginBottom: verticalScale(75),
  },
  text: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: "bold",
  },
  checkoutBtn: {
    backgroundColor: colors.WHITE,
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(10),
    borderRadius: radius._10,
  },
  clearBtn: {
    padding: scale(10),
  },
});
// import { Image, Pressable, StyleSheet, View } from "react-native";
// import { colors, radius, spacingY } from "@/constants/theme";
// import { scale, SCREEN_WIDTH, verticalScale } from "@/utils/styling";
// import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";
// import Typo from "../Typo";
// import { FC, useEffect, useState } from "react";
// import { router } from "expo-router";
// import {
//   getAllOrder,
//   removeOrderById,
// } from "@/localDB/controller/orderController";

// const FloatingPreparingOrder: FC<{
//   data: any;
//   refetchOngoingOrder: () => void;
//   openTempOrderSheet: () => void;
//   countUpdate: number;
// }> = ({ data, refetchOngoingOrder, openTempOrderSheet, countUpdate }) => {
//   const [showCountDown, setShowCountDown] = useState(false);
//   const [tempOrders, setTempOrders] = useState<
//     { orderId: string; createdAt: string }[]
//   >([]);
//   const [timeLeftMap, setTimeLeftMap] = useState<{ [key: string]: number }>({});

//   const orderImage = showCountDown
//     ? require("@/assets/images/confirming-order.webp")
//     : require("@/assets/images/preparing-order.gif");

//   // Fetch orders from local DB
//   useEffect(() => {
//     const fetchOrders = async () => {
//       const orders = await getAllOrder();
//       setTempOrders(orders);

//       // Initialize timeLeftMap with all orders starting at 60 seconds
//       if (orders.length > 0) {
//         const initialTimeLeftMap: any = {};

//         orders.forEach((order) => {
//           // Always start with 60 seconds for each order
//           initialTimeLeftMap[order.orderId] = 60;
//         });

//         setTimeLeftMap(initialTimeLeftMap);
//         setShowCountDown(true);
//       } else {
//         setShowCountDown(false);
//       }
//     };

//     fetchOrders();
//   }, []);

//   // Replace the effect that watches countUpdate
//   useEffect(() => {
//     const fetchOrders = async () => {
//       const orders = await getAllOrder();

//       // Update tempOrders state with fresh data
//       setTempOrders(orders);

//       if (orders.length > 0) {
//         // Reinitialize timer for all orders
//         const initialTimeLeftMap: any = {};
//         orders.forEach((order) => {
//           // For existing orders, preserve current time if available
//           initialTimeLeftMap[order.orderId] = timeLeftMap[order.orderId] || 60;
//         });

//         setTimeLeftMap(initialTimeLeftMap);
//         setShowCountDown(true);
//       } else {
//         setShowCountDown(false);
//       }
//     };

//     // Fetch orders whenever countUpdate changes
//     fetchOrders();
//   }, [countUpdate]);

//   useEffect(() => {
//     if (tempOrders.length <= 0) {
//       setShowCountDown(false);
//       return;
//     }

//     setShowCountDown(true);

//     const interval = setInterval(() => {
//       setTimeLeftMap((prev) => {
//         const updatedTimeLeftMap = { ...prev };
//         let ordersToRemove: any = [];

//         tempOrders.forEach((order) => {
//           const currentTimeLeft = prev[order.orderId] || 60;
//           const newTimeLeft = Math.max(currentTimeLeft - 1, 0);

//           if (newTimeLeft === 0) {
//             // Mark for removal
//             ordersToRemove.push(order.orderId);
//           } else {
//             updatedTimeLeftMap[order.orderId] = newTimeLeft;
//           }
//         });

//         // Remove completed orders outside the forEach loop
//         if (ordersToRemove.length > 0) {
//           // Remove from DB
//           ordersToRemove.forEach((orderId: string) => {
//             removeOrderById(orderId);
//           });

//           // Update state outside of this setTimeLeftMap callback
//           setTimeout(() => {
//             setTempOrders((prev) =>
//               prev.filter((o) => !ordersToRemove.includes(o.orderId))
//             );
//             refetchOngoingOrder();
//           }, 0);
//         }

//         return updatedTimeLeftMap;
//       });
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [tempOrders]);

//   const lastOrder = tempOrders.length
//     ? tempOrders[tempOrders.length - 1]
//     : null;
//   const timeLeft = lastOrder ? timeLeftMap[lastOrder.orderId] || 60 : 0;

//   return (
//     <Animated.View
//       entering={FadeInUp.springify().damping(12).stiffness(100)}
//       exiting={FadeOutDown.springify().damping(10).stiffness(80)}
//       style={[
//         styles.container,
//         {
//           display:
//             (data && data.length) || (tempOrders && tempOrders.length)
//               ? "flex"
//               : "none",
//         },
//       ]}
//     >
//       <Image
//         source={orderImage}
//         style={{ width: scale(50), height: scale(50) }}
//         resizeMode="cover"
//       />

//       <View style={{ width: "60%", flexDirection: "column", gap: spacingY._5 }}>
//         <Typo
//           size={13}
//           fontFamily="SemiBold"
//           textProps={{ numberOfLines: 1 }}
//           color={colors.NEUTRAL800}
//         >
//           {showCountDown ? "Confirming" : "Preparing"} your order
//         </Typo>
//         <Typo size={12} color={colors.NEUTRAL800}>
//           {showCountDown ? "Your order will be placed in" : "Exp delivery at"}{" "}
//           <Typo size={12} color={colors.PRIMARY}>
//             {showCountDown ? `${timeLeft}s` : data?.[0]?.deliveryTime}
//           </Typo>
//         </Typo>
//       </View>

//       <Pressable
//         onPress={() => {
//           showCountDown
//             ? openTempOrderSheet()
//             : router.push({
//                 pathname: "/order",
//               });
//         }}
//         style={styles.checkoutBtn}
//       >
//         <Image
//           source={require("@/assets/icons/maximize.webp")}
//           style={{ width: scale(30), height: scale(30) }}
//           resizeMode="cover"
//         />
//       </Pressable>
//     </Animated.View>
//   );
// };

// export default FloatingPreparingOrder;

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: colors.WHITE,
//     width: SCREEN_WIDTH - 40,
//     marginHorizontal: scale(20),
//     paddingVertical: verticalScale(12),
//     paddingHorizontal: scale(10),
//     borderRadius: radius._10,
//     alignItems: "center",
//     justifyContent: "space-between",
//     elevation: 5,
//     flexDirection: "row",
//     marginBottom: verticalScale(75),
//   },
//   text: {
//     color: colors.WHITE,
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   checkoutBtn: {
//     backgroundColor: colors.WHITE,
//     paddingHorizontal: scale(10),
//     paddingVertical: verticalScale(10),
//     borderRadius: radius._10,
//   },
//   clearBtn: {
//     padding: scale(10),
//   },
// });
