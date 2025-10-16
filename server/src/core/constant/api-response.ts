import env from "../utils/env";
import logger from "../utils/logger";
import { HTTP_STATUS } from "./http-code";

interface BaseResponseData {
  success: boolean;
  message: string;
  timestamp: string;
}

interface SuccessResponse<T = any> extends BaseResponseData {
  data: T;
}

interface ErrorResponse extends BaseResponseData {
  error: string;
  stack?: string[];
  errors?: Record<string, string[]>;
  fullError?: string;
}

export class Response {
  /**
   * Create a success response
   * @param message Success message
   * @param data Data to be returned
   * @param statusCode HTTP status code (default: 200 OK)
   * @returns Success response object
   */
  static success<T = any>(
    message: string,
    data: T,
    statusCode: number = HTTP_STATUS.OK
  ): { body: SuccessResponse<T>; statusCode: number } {
    if (env.NODE_ENV !== "PRODUCTION") {
      logger.info(`Success: ${message}`);
    }
    return {
      body: {
        success: true,
        message,
        data,
        timestamp: new Date().toISOString(),
      },
      statusCode,
    };
  }

  /**
   * Create an error response
   * @param message Error message
   * @param error Error name or type
   * @param statusCode HTTP status code (default: 500 Internal Server Error)
   * @param stack Error stack trace (only included in development)
   * @returns Error response object
   */
  static error(
    message: string,
    error: string,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    stack?: string,
    errors?: Record<string, string[]>
  ): { body: ErrorResponse; statusCode: number } {
    const errorResponse: ErrorResponse = {
      success: false,
      message: message || "Internal Server Error",
      error: error || "ERROR",
      timestamp: new Date().toISOString(),
    };

    if (errors && Object.keys(errors).length > 0) {
      errorResponse.errors = errors;
    }

    if (env.NODE_ENV === "DEVELOPMENT" && stack) {
      const filteredStack = Response.getFilteredStack(stack);
      if (filteredStack.length > 0) {
        errorResponse.stack = filteredStack;
        errorResponse.fullError = stack;
      }
    }

    return {
      body: errorResponse,
      statusCode,
    };
  }

  /**
   * Filter stack trace to show only relevant lines
   * @param stack Error stack trace
   * @returns Filtered stack trace
   */
  public static getFilteredStack(stack?: string): string[] {
    if (!stack) return [];

    return stack
      .split("\n")
      .filter((line) => {
        // Filter hanya file aplikasi, bukan file sistem atau node_modules
        return (
          line.includes("\\src\\api\\") ||
          line.includes("\\src\\core\\") ||
          (line.includes("at ") &&
            !line.includes("node_modules") &&
            !line.includes("native:"))
        );
      })
      .slice(0, 3) // Ambil 3 baris teratas saja
      .map((line) => line.trim());
  }
}
