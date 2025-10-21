import { AccessMiddleware } from "@/core/utils/middleware/access.middleware";
import { Context, Hono } from "hono";
import { spendingLimitService } from "./spending-limit.service";
import { JWTPayload } from "@/core/utils/middleware/jwt";
import {
  createSpendingLimitSchema,
  updateSpendingLimitSchema,
} from "./dto/spending-limit.dto";
import { Response } from "@/core/constant/api-response";
import { HTTP_STATUS } from "@/core/constant/http-code";

const spendingLimitRoute = new Hono();
const accessMiddleware = new AccessMiddleware();

spendingLimitRoute.post(
  "/",
  accessMiddleware.authenticate,
  accessMiddleware.isActive,
  async (c: Context) => {
    const payload = (await c.get("payload")) as JWTPayload;
    const body = await c.req.json();
    const data = createSpendingLimitSchema.parse(body);
    const result = await spendingLimitService.create(data, payload.id);

    return c.json(
      Response.success(
        "Success Create Spending Limit",
        HTTP_STATUS.CREATED,
        result,
      ),
    );
  },
);

spendingLimitRoute.patch(
  "/:id",
  accessMiddleware.authenticate,
  accessMiddleware.isActive,
  async (c: Context) => {
    const id = c.req.param("id");
    const body = await c.req.json();
    const data = updateSpendingLimitSchema.parse(body);
    const result = await spendingLimitService.update(id, data);

    return c.json(
      Response.success("Success Update Spending Limit", HTTP_STATUS.OK, result),
    );
  },
);

spendingLimitRoute.delete(
  "/:id",
  accessMiddleware.authenticate,
  accessMiddleware.isActive,
  async (c: Context) => {
    const id = c.req.param("id");
    const result = await spendingLimitService.delete(id);

    return c.json(
      Response.success("Success Delete Spending Limit", HTTP_STATUS.OK, result),
    );
  },
);

spendingLimitRoute.get(
  "/",
  accessMiddleware.authenticate,
  accessMiddleware.isActive,
  async (c: Context) => {
    const payload = (await c.get("payload")) as JWTPayload;
    const result = await spendingLimitService.getByUser(payload.id);

    return c.json(
      Response.success("Success Get Spending Limit", HTTP_STATUS.OK, result),
    );
  },
);

export default spendingLimitRoute;
