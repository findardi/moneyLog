import { Context, Next } from "hono";
import { verify, sign } from "hono/jwt";
import env from "../env";
import { Forbidden, Unauthorized } from "../error/error-handler";

export interface JWTPayload {
  id: number;
  username: string;
  role: string;
  iat?: number;
  exp?: number;
  [key: string]: unknown;
}

export const authMiddleware = async (c: Context, next: Next) => {
  const token = c.req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new Unauthorized("Token is required");
  }

  try {
    const payload = await verify(token, env.JWT_SECRET);
    c.set("payload", payload);
    await next();
  } catch (error) {
    throw new Forbidden("Invalid token");
  }
};

export const generatedToken = async (data: {
  id: number;
  username: string;
  role: string;
}): Promise<string> => {
  const now = Math.floor(Date.now() / 1000);
  const expirationTime = now * (24 * 60 * 60);

  const payload: JWTPayload = {
    id: data.id,
    username: data.username,
    role: data.role,
    iat: now,
    exp: expirationTime,
  };

  try {
    const token = await sign(payload, env.JWT_SECRET);
    return token;
  } catch (error) {
    throw new Error("failed to generated token");
  }
};
