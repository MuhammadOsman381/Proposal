import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const proposal = pgTable("proposal", {
  id: serial("id").primaryKey(),
  adminKey: text("admin_key").notNull(),
  secretKey: text("secret_key").notNull(),
  message: text("message").notNull(),
  date: timestamp("date", { mode: "date" }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
