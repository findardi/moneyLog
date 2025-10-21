import { relations } from "drizzle-orm";
import { spendingLimit } from "./spending-limit.schema";
import { users } from "../users";

export const spendingLimitRelations = relations(spendingLimit, ({ one }) => ({
  user: one(users, {
    fields: [spendingLimit.userId],
    references: [users.id],
  }),
}));
