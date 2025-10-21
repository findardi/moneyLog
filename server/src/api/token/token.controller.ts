import { AccessMiddleware } from "@/core/utils/middleware/access.middleware";
import { JWTPayload } from "@/core/utils/middleware/jwt";
import { Context, Hono } from "hono";
import { tokenService } from "./token.service";
import { Response } from "@/core/constant/api-response";
import { HTTP_STATUS } from "@/core/constant/http-code";

const tokenRoute = new Hono();
const accessMiddleware = new AccessMiddleware();

tokenRoute.post("/", accessMiddleware.authenticate, async (c: Context) => {
  const payload = c.get("payload") as JWTPayload;
  const result = await tokenService.getActivatedToken(payload.username);

  return c.json(
    Response.success(
      "Token generated successfully",
      HTTP_STATUS.CREATED,
      result,
    ),
  );
});

tokenRoute.patch(
  "/reset",
  accessMiddleware.authenticate,
  async (c: Context) => {
    const payload = c.get("payload") as JWTPayload;
    const result = await tokenService.getResetToken(payload.username);

    return c.json(
      Response.success("Token reset successfully", HTTP_STATUS.CREATED, result),
    );
  },
);

export default tokenRoute;
