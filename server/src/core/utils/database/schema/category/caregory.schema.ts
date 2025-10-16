import { index, pgTable, serial, text } from "drizzle-orm/pg-core";

export const categories = pgTable('categories', {
    id: serial('id').primaryKey(),
    name: text('name').notNull().unique(),
    description: text('description'),
}, (table) => ({
    catNameIdx: index('category_name_idx').on(table.name)
}))
