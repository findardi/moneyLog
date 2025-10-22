import type { ApiErrorResponse } from "./api-response.types";

export interface ParsedError {
  message: string;
  fieldErrors?: Record<string, string[]>;
  errorCode?: string;
}

export function parseApiError(error: unknown): ParsedError {
  if (
    error &&
    typeof error === "object" &&
    "success" in error &&
    error.success === false
  ) {
    const apiError = error as ApiErrorResponse;

    return {
      message: apiError.message || "An error occurred",
      fieldErrors: apiError.errors,
      errorCode: apiError.error,
    };
  }

  if (error && typeof error === "object" && "message" in error) {
    return {
      message:
        typeof error.message === "string" ? error.message : "An error occurred",
    };
  }

  if (typeof error === "string") {
    return {
      message: error,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  return {
    message: "An unexpected error occurred",
  };
}

export function getErrorMessage(parsedError: ParsedError): string {
  if (parsedError.fieldErrors) {
    const fieldMessages = Object.entries(parsedError.fieldErrors)
      .map(([field, errors]) => {
        const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
        return `${fieldName}: ${errors.join(", ")}`;
      })
      .join("\n");

    return parsedError.message
      ? `${parsedError.message}\n${fieldMessages}`
      : fieldMessages;
  }

  return parsedError.message;
}

export function getFirstErrorMessage(parsedError: ParsedError): string {
  if (parsedError.fieldErrors) {
    const firstField = Object.keys(parsedError.fieldErrors)[0];
    const firstErrors = parsedError.fieldErrors[firstField];
    if (firstErrors && firstErrors.length > 0) {
      return firstErrors[0];
    }
  }

  return parsedError.message;
}
