import { database } from "@/localDB/database";
import Order from "../models/Order";

export const addOrder = async (orderId: string, createdAt: string) => {
  try {
    await database.write(async () => {
      await database.get<Order>("order").create((order) => {
        order.orderId = orderId;
        order.createdAt = createdAt;
      });
    });
    console.log("Order added successfully");
  } catch (error) {
    console.error("Error adding order:", error);
  }
};

export const deleteOrder = async (orderId: string) => {
  try {
    const orderCollection = database.get<Order>("order");
    const order = await orderCollection.query().fetch();
    const orderToDelete = order.find((o) => o.orderId === orderId);

    if (orderToDelete) {
      await database.write(async () => {
        await orderToDelete.markAsDeleted();
        await orderToDelete.destroyPermanently();
      });
      console.log("Order deleted successfully");
    } else {
      console.log("Order not found");
    }
  } catch (error) {
    console.error("Error deleting order:", error);
  }
};
