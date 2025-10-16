import { pgEnum, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { users } from "../users";
import { sql } from "drizzle-orm";

export const TokenType = pgEnum("token_type", ["ACTIVATION", "RECOVERY", "RESET", "REFRESH"])

export const token = pgTable('token', {
    token: varchar('token').unique(),
    username: varchar('username').notNull().references(() => users.username),
    type: TokenType("type"),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => sql`CURRENT_TIMESTAMP`)
})