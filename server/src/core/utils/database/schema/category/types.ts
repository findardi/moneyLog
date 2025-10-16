import { InferSelectModel } from "drizzle-orm";
import { categories } from "./caregory.schema";

export type ICategory = InferSelectModel<typeof categories>