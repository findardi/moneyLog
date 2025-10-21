import {
  integer,
  pgTable,
  timestamp,
  uuid,
  unique,
  index,
} from "drizzle-orm/pg-core";
import { users } from "../users";
import { spendingLimit } from "../spending-limit";
import { sql } from "drizzle-orm";

export const periodeLimit = pgTable(
  "periode_limit",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    spendingLimitId: uuid("spending_limit_id")
      .notNull()
      .references(() => spendingLimit.id, { onDelete: "cascade" }),
    periodeStart: timestamp("periode_start").notNull(),
    periodeEnd: timestamp("periode_end").notNull(),
    currentSpending: integer("current_spending").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    // Unique constraint: satu user hanya bisa punya satu periode untuk spending limit tertentu
    uniqueUserSpendingLimit: unique("unique_user_spending_limit").on(
      table.userId,
      table.spendingLimitId,
    ),
    // Indexes untuk performa query
    userIdIdx: index("periode_limit_user_id_idx").on(table.userId),
    spendingLimitIdIdx: index("periode_limit_spending_limit_id_idx").on(
      table.spendingLimitId,
    ),
    periodeStartIdx: index("periode_limit_periode_start_idx").on(
      table.periodeStart,
    ),
    periodeEndIdx: index("periode_limit_periode_end_idx").on(table.periodeEnd),
  }),
);
