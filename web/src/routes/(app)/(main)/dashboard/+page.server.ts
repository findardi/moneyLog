import { fail, superValidate } from "sveltekit-superforms";
import type { Actions, PageServerLoad } from "./$types";
import { zod4 } from "sveltekit-superforms/adapters";
import {
  createSpendingLimitSchema,
  updateSpendingLimitSchema,
} from "$lib/schema/spending.schema";
import type { ApiErrorResponse } from "$lib/utils/api-response.types";
import API_URL from "$lib/utils/api-url";

export const load = (async () => {
  const spendingCreate = await superValidate(zod4(createSpendingLimitSchema));
  const spendingUpdate = await superValidate(zod4(updateSpendingLimitSchema));
  return { spendingCreate, spendingUpdate };
}) satisfies PageServerLoad;

export const actions = {
  createSpending: async ({ fetch, request }) => {
    const apiHeader: Record<string, string> = {};
    apiHeader["Content-Type"] = "application/json";

    const form = await superValidate(request, zod4(createSpendingLimitSchema));

    try {
      if (!form.valid) {
        return fail(400, { form });
      }

      const { alertPercentage, period, amount } = form.data;
      const body = JSON.stringify({ alertPercentage, period, amount });

      const response = await fetch(API_URL.limit.insert(), {
        method: "POST",
        headers: apiHeader,
        body,
      });

      if (!response.ok) {
        let errorData: ApiErrorResponse;
        try {
          errorData = await response.json();
        } catch (parseError) {
          return fail(response.status, {
            form,
            apiError: {
              message: response.statusText || "Request failed",
              error: "UNKNOWN_ERROR",
              success: false,
              timestamp: new Date().toISOString(),
            } as ApiErrorResponse,
          });
        }

        return fail(response.status, {
          form,
          apiError: errorData,
        });
      }

      return;
    } catch (error) {
      return fail(500, {
        apiError: {
          message:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
          error: "INTERNAL_ERROR",
          success: false,
          timestamp: new Date().toISOString(),
        } as ApiErrorResponse,
      });
    }
  },

  deleteSpending: async ({ fetch, request }) => {
    const apiHeader: Record<string, string> = {};
    apiHeader["Content-Type"] = "application/json";

    const form = await request.formData();
    const id = form.get("id") as string;
    console.log(id);

    try {
      const response = await fetch(API_URL.limit.delete(id), {
        method: "DELETE",
        headers: apiHeader,
      });

      if (!response.ok) {
        let errorData: ApiErrorResponse;
        try {
          errorData = await response.json();
        } catch (parseError) {
          return fail(response.status, {
            apiError: {
              message: response.statusText || "Request failed",
              error: "UNKNOWN_ERROR",
              success: false,
              timestamp: new Date().toISOString(),
            } as ApiErrorResponse,
          });
        }

        return fail(response.status, {
          apiError: errorData,
        });
      }

      return;
    } catch (error) {
      return fail(500, {
        apiError: {
          message:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
          error: "INTERNAL_ERROR",
          success: false,
          timestamp: new Date().toISOString(),
        } as ApiErrorResponse,
      });
    }
  },

  updateSpending: async ({ fetch, url, request }) => {
    const apiHeader: Record<string, string> = {};
    apiHeader["Content-Type"] = "application/json";

    const id = url.searchParams.get("id") as string;
    const form = await superValidate(request, zod4(updateSpendingLimitSchema));

    try {
      if (!form.valid) {
        return fail(400, { form });
      }

      if (!id) {
        return fail(400, {
          form,
          apiError: {
            message: "Spending limit ID is required",
            error: "VALIDATION_ERROR",
            success: false,
            timestamp: new Date().toISOString(),
          } as ApiErrorResponse,
        });
      }

      const { alertPercentage, period, amount } = form.data;
      const body = JSON.stringify({ alertPercentage, period, amount });

      const response = await fetch(API_URL.limit.update(id), {
        method: "PATCH",
        headers: apiHeader,
        body,
      });

      if (!response.ok) {
        let errorData: ApiErrorResponse;
        try {
          errorData = await response.json();
        } catch (parseError) {
          return fail(response.status, {
            form,
            apiError: {
              message: response.statusText || "Request failed",
              error: "UNKNOWN_ERROR",
              success: false,
              timestamp: new Date().toISOString(),
            } as ApiErrorResponse,
          });
        }

        return fail(response.status, {
          form,
          apiError: errorData,
        });
      }

      return;
    } catch (error) {
      return fail(500, {
        apiError: {
          message:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
          error: "INTERNAL_ERROR",
          success: false,
          timestamp: new Date().toISOString(),
        } as ApiErrorResponse,
      });
    }
  },
} satisfies Actions;
