import { Model } from "@nozbe/watermelondb";
import { field, text } from "@nozbe/watermelondb/decorators";

export default class Cart extends Model {
  static table = "cart";

  @text("merchant_id") merchantId!: string;
  @text("productId") productId!: string;
  @text("productName") productName!: string;
  @text("variantTypeId") variantTypeId?: string;
  @text("variantTypeName") variantTypeName?: string;
  @field("price") price!: number;
  @field("quantity") quantity!: number;
}
