import { Context, Next } from "hono";
import { Unauthorized } from "../error/error-handler";
import { verify } from "hono/jwt";
import env from "../env";
import { JWTPayload } from "./jwt";
import db from "../database/connection";
import { users } from "../database/schema/users";
import { eq } from "drizzle-orm";

export class AccessMiddleware {
  async authenticate(c: Context, next: Next) {
    const token = c.req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return c.json({ error: "Token is required" }, 401);
    }

    try {
      const payload = await verify(token, env.JWT_SECRET);
      c.set("payload", payload);
      await next();
    } catch {
      return c.json({ error: "Invalid token" }, 401);
    }
  }

  async isActive(c: Context, next: Next) {
    const context = c.get("payload") as JWTPayload;
    const result = await db
      .select({ isActive: users.isActive })
      .from(users)
      .where(eq(users.id, context.id))
      .then((res) => res[0]?.isActive);

    if (!result) {
      return c.json({ error: "Please activate your account" }, 401);
    }

    await next();
  }
}
