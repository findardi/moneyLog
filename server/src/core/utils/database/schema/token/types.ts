import { InferSelectModel } from "drizzle-orm";
import { token } from "./token.schema";

export type IToken = InferSelectModel<typeof token>