import { Context, Next } from "hono";
import { JWTPayload } from "./jwt";
import { userRole } from "@/core/constant/types";
import { Forbidden, NotFound } from "../error/error-handler";
import db from "../database/connection";
import { expenses } from "../database/schema/expense";
import { eq } from "drizzle-orm";
import { PgTable } from "drizzle-orm/pg-core";
import { spendingLimit } from "../database/schema/spending-limit";

type ResourceConfig = {
  table: PgTable<any>;
  idField: any;
  userIdField: any;
  resourceName: string;
};

const resourceMap: Record<string, ResourceConfig> = {
  expenses: {
    table: expenses,
    idField: expenses.id,
    userIdField: expenses.userId,
    resourceName: "expense",
  },
  spendingLimit: {
    table: spendingLimit,
    idField: spendingLimit.id,
    userIdField: spendingLimit.userId,
    resourceName: "spending limit",
  },
};

class Authorize {
  public async isAdmin(c: Context, next: Next) {
    const payload = c.get("payload") as JWTPayload;
    if (payload.role === userRole.ADMIN) {
      await next();
    } else {
      throw new Forbidden("Forbidden Access");
    }
  }

  public canAccess(resourceType: keyof typeof resourceMap = "expenses") {
    return async (c: Context, next: Next) => {
      const payload = c.get("payload") as JWTPayload;
      const resourceID = c.req.param("id");

      const config = resourceMap[resourceType];
      if (!config) {
        throw new Error(`Unknown resource type: ${resourceType}`);
      }

      const resource = await db
        .select({ userId: config.userIdField })
        .from(config.table)
        .where(eq(config.idField, resourceID))
        .then((res) => res[0]?.userId);

      if (resource === undefined) {
        throw new NotFound(
          `${config.resourceName} with id ${resourceID} not found`,
        );
      }

      if (resource === payload.id) {
        await next();
      } else {
        throw new Forbidden("Forbidden Access");
      }
    };
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
