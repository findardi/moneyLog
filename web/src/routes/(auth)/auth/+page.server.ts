import { fail, superValidate } from "sveltekit-superforms";
import type { Actions, PageServerLoad } from "./$types";
import { zod4 } from "sveltekit-superforms/adapters";
import { loginSchema, registerSchema } from "$lib/schema/user.schema";
import API_URL from "$lib/utils/API_URL";
import { isRedirect, redirect } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";
import type { ApiErrorResponse } from "$lib/utils/api-response.types";

export const load = (async ({ url }) => {
  const tab = url.searchParams.get("tab") || "register";
  const schema = tab === "register" ? registerSchema : loginSchema;
  return {
    loginForm: await superValidate(zod4(loginSchema)),
    registerForm: await superValidate(zod4(registerSchema)),
  };
}) satisfies PageServerLoad;

export const actions = {
  login: async ({ request, fetch, cookies }) => {
    const apiHeader: Record<string, string> = {};
    const form = await superValidate(request, zod4(loginSchema));

    try {
      if (!form.valid) {
        return fail(400, { form });
      }

      const { email, password } = form.data;
      const body = JSON.stringify({ email, password });
      apiHeader["Content-Type"] = "application/json";

      const response = await fetch(API_URL.user.login(), {
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

      const token = await response.json().then((res) => res.body.data);
      if (!token) {
        return fail(500, {
          form,
          apiError: {
            message: "No authentication token received",
            error: "NO_TOKEN",
            success: false,
            timestamp: new Date().toISOString(),
          } as ApiErrorResponse,
        });
      }

      cookies.set("auth_token", token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        secure: env.NODE_ENV === "production",
      });

      redirect(303, "/");
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

  register: async ({ request, fetch, cookies }) => {
    const apiHeader: Record<string, string> = {};
    const form = await superValidate(request, zod4(registerSchema));

    try {
      if (!form.valid) {
        return fail(400, { form });
      }

      const { email, username, first_name, last_name, password } = form.data;
      const fullname = `${first_name} ${last_name}`;
      const body = JSON.stringify({ email, username, fullname, password });
      apiHeader["Content-Type"] = "application/json";

      const response = await fetch(API_URL.user.register(), {
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

      redirect(303, "/");
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
} satisfies Actions;
