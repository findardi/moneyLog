import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "../users";
import { sql } from "drizzle-orm";

export const periodLimit = pgEnum("period_limit", [
  "DAILY",
  "WEEKLY",
  "MONTHLY",
  "QUARTERLY",
  "YEARLY",
  "CUSTOM",
]);

export const spendingLimit = pgTable(
  "spending_limit",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    period: periodLimit("period").notNull().default("WEEKLY"),
    amount: integer("amount").notNull(),
    alertPercentage: integer("alert_percentage").notNull().default(75),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    userIdIdx: index("spending_limit_user_id_idx").on(table.userId),
    periodIdx: index("spending_limit_period_idx").on(table.period),
    amountIdx: index("spending_limit_amount_idx").on(table.amount),
    alertPercentageIdx: index("spending_limit_alert_percentage_idx").on(
      table.alertPercentage,
    ),
  }),
);
