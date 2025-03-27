import { database } from "@/localDB/database";
import Order from "../models/Order";

export const addOrder = async (
  orderId: string,
  createdAt: string,
  deliveryMode: string,
  merchantName?: string
) => {
  try {
    await database.write(async () => {
      await database.get<Order>("order").create((order) => {
        order.orderId = orderId;
        // order.createdAt = createdAt;
        order.createdAt = new Date().toISOString();
        order.deliveryMode = deliveryMode;
        order.merchantName = merchantName || "";
      });
    });
  } catch (error) {
    console.error("Error adding order:", error);
  }
};

export const getAllOrder = async (): Promise<
  {
    orderId: string;
    createdAt: string;
    deliveryMode: string;
    merchantName: string;
  }[]
> => {
  try {
    const orderCollection = database.get<Order>("order");
    const orders = await orderCollection.query().fetch();

    if (!orders.length) return [];

    return orders.map((order) => ({
      orderId: order.orderId,
      createdAt: order.createdAt,
      deliveryMode: order.deliveryMode || "",
      merchantName: order.merchantName,
    }));
  } catch (error) {
    console.error("Error fetching all orders:", error);
    return [];
  }
};

export const removeOrderById = async (orderId: string) => {
  try {
    const orderCollection = database.get<Order>("order");
    const order = await orderCollection.query().fetch();
    const orderToDelete = order.find((o) => o.orderId === orderId);

    if (orderToDelete) {
      await database.write(async () => {
        await orderToDelete.markAsDeleted();
        await orderToDelete.destroyPermanently();
      });
    }
  } catch (error) {
    console.error("Error deleting order:", error);
  }
};

export const clearOrders = async () => {
  await database.write(async () => {
    await database.get<Order>("order").query().destroyAllPermanently();
  });
};
