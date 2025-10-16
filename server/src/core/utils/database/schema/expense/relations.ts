import { relations } from "drizzle-orm";
import { expenses } from "./expense.schema";
import { users } from "../users";
import { categories } from "../category";

export const expenseRelations = relations(expenses, ({one}) => ({
    user: one(users, {
        fields: [expenses.userId],
        references: [users.id]
    }),
    category: one(categories, {
        fields: [expenses.categoryId],
        references: [categories.id]
    })
}))