import { ContentfulStatusCode } from "hono/utils/http-status";
import Container from "../container";
import { ValidationError } from "./error-handler";
import { Response } from "@/core/constant/api-response";
import env from "../env";
import { ZodError } from "zod";
import { HTTP_STATUS } from "@/core/constant/http-code";
import { ErrorHandler } from "hono";

const onError: ErrorHandler = (err, c) => {
  const logger = Container.getInstance().get("logger");

  // Transform ZodError into our custom ValidationError
  if (err instanceof ZodError) {
    err = new ValidationError(err);
  }

  const status = (
    "status" in err ? err.status : HTTP_STATUS.INTERNAL_SERVER_ERROR
  ) as ContentfulStatusCode;

  const isDev = env.NODE_ENV !== "PRODUCTION";

  const errorLog: Record<string, any> = {
    message: err.message,
    status,
    error: err.name || "ERROR",
  };

  if (isDev) {
    errorLog.stack = Response.getFilteredStack(err.stack);
  }

  if (err instanceof ValidationError && err.errors) {
    errorLog.errors = err.errors;
  }

  logger.error(errorLog);

  const { body } = Response.error(
    err.message,
    err.name || "ERROR",
    status,
    err.stack,
    err instanceof ValidationError ? err.errors : undefined
  );

  return c.json(body, status);
};

export default onError;
