import { InferSelectModel } from "drizzle-orm";
import { spendingLimit } from "./spending-limit.schema";

export type ISpendingLimit = InferSelectModel<typeof spendingLimit>;
