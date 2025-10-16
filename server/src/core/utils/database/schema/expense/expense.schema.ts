import { index, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "../users";
import { categories } from "../category";

export const expenses = pgTable('expenses', {
    id: uuid('id').primaryKey(),
    userId: integer('user_id').references(() => users.id),
    categoryId: integer('category_id').references(() => categories.id),
    name: text('name').notNull(),
    amount: integer('amount').notNull(),
    spentAt: timestamp('spent_at').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
    spentAtIdx: index('spent_at_idx').on(table.spentAt),
    expNameIdx: index('expense_name_idx').on(table.name),
    amountIdx: index('amount_idx').on(table.amount),
    userIdIdx: index('user_id_idx').on(table.userId),
    categoryIdIdx: index('category_id_idx').on(table.categoryId),
}))

