import { sql } from "drizzle-orm";
import { boolean, index, pgEnum, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const Userrole = pgEnum("user_role", ["USER", "ADMIN"]);

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    username: varchar("username", { length: 256 }).notNull().unique(),
    email: varchar("email", { length: 256 }).unique().notNull(),
    password: varchar("password", { length: 256 }).notNull(),
    fullName: varchar("full_name", { length: 256 }),
    avatarUrl: varchar("avatar_url", { length: 512 }),
    isActive: boolean("is_active").default(false).notNull(),
    role: Userrole("role").default("USER").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => sql`CURRENT_TIMESTAMP`),
}, (table) => ({
    usernameIdx: index("username_idx").on(table.username),
    emailIdx: index("email_idx").on(table.email),
    fullNameIdx: index("full_name_idx").on(table.fullName),
}))