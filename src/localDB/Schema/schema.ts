import { appSchema, tableSchema } from "@nozbe/watermelondb";

export const schema = appSchema({
  version: 4,
  tables: [
    tableSchema({
      name: "cart",
      columns: [
        { name: "merchant_id", type: "string" },
        { name: "productId", type: "string" },
        { name: "productName", type: "string" },
        { name: "variantTypeId", type: "string", isOptional: true },
        { name: "variantTypeName", type: "string", isOptional: true },
        { name: "price", type: "number" },
        { name: "quantity", type: "number" },
      ],
    }),
    tableSchema({
      name: "order",
      columns: [
        { name: "orderId", type: "string", isIndexed: true },
        { name: "createdAt", type: "string" },
      ],
    }),
  ],
});
