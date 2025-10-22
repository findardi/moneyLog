export interface ApiErrorResponse {
  success: false;
  message: string;
  error: string;
  timestamp: string;
  errors?: Record<string, string[]>;
}

export interface ApiSuccessResponse<T = any> {
  success: true;
  body: {
    data: T;
  };
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

export function isApiErrorResponse(
  response: any,
): response is ApiErrorResponse {
  return (
    response &&
    typeof response === "object" &&
    response.success === false &&
    typeof response.message === "string"
  );
}
