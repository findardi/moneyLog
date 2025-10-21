import { relations } from "drizzle-orm";
import { periodeLimit } from "./periode-limit.schema";
import { users } from "../users";
import { spendingLimit } from "../spending-limit";

export const spendingLimitRelations = relations(periodeLimit, ({ one }) => ({
  user: one(users, {
    fields: [periodeLimit.userId],
    references: [users.id],
  }),
}));
