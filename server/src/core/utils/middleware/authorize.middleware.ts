import { Context, Next } from "hono";
import { JWTPayload } from "./jwt";
import { userRole } from "@/core/constant/types";
import { Forbidden, NotFound } from "../error/error-handler";
import db from "../database/connection";
import { expenses } from "../database/schema/expense";
import { eq } from "drizzle-orm";

class Authorize {
  public async isAdmin(c: Context, next: Next) {
    const payload = c.get("payload") as JWTPayload;
    if (payload.role === userRole.ADMIN) {
      await next();
    } else {
      throw new Forbidden("Forbidden Access");
    }
  }

  public async canAccess(c: Context, next: Next) {
    const payload = c.get("payload") as JWTPayload;
    const expenseID = c.req.param("id");
    const expense = await db
      .select({ userId: expenses.userId })
      .from(expenses)
      .where(eq(expenses.id, expenseID))
      .then((res) => res[0]?.userId);

    if (expense === undefined) {
      throw new NotFound(`Expense with id ${expenseID} not found`);
    }

    if (expense === payload.id) {
      await next();
    } else {
      throw new Forbidden("Forbidden Access");
    }
  }

  public authorize(...methods: (keyof Omit<Authorize, "authorize">)[]) {
    return async (c: Context, next: Next) => {
      for (const method of methods) {
        const fn = this[method] as (c: Context, next: Next) => Promise<void>;
        if (typeof fn === "function") {
          await fn.call(this, c, next);
        } else {
          throw new Error(`Unknown authorize method: ${method}`);
        }
      }
    };
  }
}

export const authorizeMiddleware = new Authorize();
