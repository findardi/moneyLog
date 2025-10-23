import { activationSchema } from "$lib/schema/user.schema";
import { zod4 } from "sveltekit-superforms/adapters";
import type { Actions, PageServerLoad } from "./$types";
import { superValidate } from "sveltekit-superforms/server";
import API_URL from "$lib/utils/API_URL";
import type { ApiErrorResponse } from "$lib/utils/api-response.types";
import { fail } from "sveltekit-superforms";
import { isRedirect, redirect } from "@sveltejs/kit";

export const load = (async ({ parent }) => {
  const layoutData = await parent();

  return {
    activationForm: await superValidate(zod4(activationSchema)),
    username: layoutData.username,
    isActive: layoutData.isActive,
  };
}) satisfies PageServerLoad;

export const actions = {
  getToken: async ({ fetch }) => {
    const apiHeader: Record<string, string> = {};
    apiHeader["Content-Type"] = "application/json";

    try {
      const response = await fetch(API_URL.token.generate(), {
        method: "POST",
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

      return {
        success: true,
      };
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

  verifyToken: async ({ request, fetch }) => {
    const apiHeader: Record<string, string> = {};
    apiHeader["Content-Type"] = "application/json";

    const form = await superValidate(request, zod4(activationSchema));

    try {
      if (!form.valid) {
        return fail(400, { form });
      }
      const { token: activationToken } = form.data;
      const response = await fetch(
        API_URL.user.activated({ token: activationToken }),
        {
          method: "PATCH",
          headers: apiHeader,
        },
      );

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

      throw redirect(303, "/auth");
    } catch (error) {
      if (isRedirect(error)) {
        throw error;
      }
      return fail(500, {
        form,
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

  resetToken: async ({ fetch }) => {
    const apiHeader: Record<string, string> = {};
    apiHeader["Content-Type"] = "application/json";

    try {
      const response = await fetch(API_URL.token.reset(), {
        method: "PATCH",
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

      return {
        success: true,
      };
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

  logout: async ({ cookies }) => {
    cookies.delete("auth_token", {
      path: "/",
    });

    throw redirect(303, "/");
  },
} satisfies Actions;
