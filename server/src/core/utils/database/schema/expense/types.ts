import { InferSelectModel } from "drizzle-orm";
import { expenses } from "./expense.schema";

export type IExpense = InferSelectModel<typeof expenses>