import { InferSelectModel } from "drizzle-orm";
import { periodeLimit } from "./periode-limit.schema";

export type IPeriodeLimit = InferSelectModel<typeof periodeLimit>;
