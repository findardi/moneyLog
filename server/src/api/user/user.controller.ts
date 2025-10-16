import { Context, Hono } from "hono";
import { createUserSchema, loginUserSchema } from "./dto/user.create.dto";
import { userService } from "./user.service";
import { Response } from "@/core/constant/api-response";
import { HTTP_STATUS } from "@/core/constant/http-code";
import { AccessMiddleware } from "@/core/utils/middleware/access_middleware";
import { JWTPayload } from "@/core/utils/middleware/jwt";
import { tokenService } from "../token/token.service";
import { BadRequest } from "@/core/utils/error/error-handler";

const userRoute = new Hono();
const accessMiddleware = new AccessMiddleware();

userRoute.post("/", async (c: Context) => {
    const body = await c.req.json()
    const data = await createUserSchema.parse(body)
    const result = await userService.create(data)

    return c.json(
        Response.success("Success create user", result, HTTP_STATUS.CREATED)
    )
})

userRoute.post("/login", async (c: Context) => {
    const body = await c.req.json()
    const data = await loginUserSchema.parse(body)
    const result = await userService.login(data)

    return c.json(
        Response.success("Success login user", result)
    )
})

userRoute.patch("/activated", accessMiddleware.authenticate, async (c: Context) => {
    const token = c.req.query("token")
    if (!token) {
        throw new BadRequest("Token Activated is required")
    }
    
    const payload = c.get("payload") as JWTPayload;
    const result = await tokenService.activatedUser(payload.username, token)

    return c.json(
        Response.success("Success activate user", result)
    )
})

export default userRoute;