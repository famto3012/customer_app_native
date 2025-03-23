import { Model } from "@nozbe/watermelondb";
import { text } from "@nozbe/watermelondb/decorators";

export default class Order extends Model {
  static table = "order";

  @text("orderId") orderId!: string;
  @text("createdAt") createdAt!: string;
  @text("deliveryMode") deliveryMode!: string;
  @text("merchantName") merchantName!: string;
}
