import { InferSelectModel } from "drizzle-orm";
import { Userrole, users } from "./user.schema";

// export type IUser = Omit<InferSelectModel<typeof users>, "">
export type IUser = InferSelectModel<typeof users>

export type UserRoleType = typeof Userrole.enumValues[number];