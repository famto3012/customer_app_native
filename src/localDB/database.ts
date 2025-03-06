import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";
import { schema } from "@/localDB/Schema/schema";
import Cart from "@/localDB/models/Cart";

const adapter = new SQLiteAdapter({
  schema,
  dbName: "CustomerAppDB",
  jsi: true,
});

export const database = new Database({
  adapter,
  modelClasses: [Cart],
});
