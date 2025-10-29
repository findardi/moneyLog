import type { ApiErrorResponse } from "$lib/utils/api-response.types";
import API_URL from "$lib/utils/api-url";
import type { Expense } from "$lib/utils/types";
import type { Actions, PageServerLoad } from "./$types";
import { fail, superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import {
  insertExpenseSchema,
  insertMultipleExpenseSchema,
  updateExpenseSchema,
} from "$lib/schema/expense.schema";

interface Meta {
  total: number;
  limit: number;
  offset: number;
  page: number;
  totalPages: number;
}

const getAll = async (
  fetch: typeof globalThis.fetch,
  searchCategory: string,
  search: string,
  orderBy: string,
  sort: string,
  limit: number,
  offset: number,
) => {
  const params: Record<string, any> = {
    offset,
    limit,
  };

  if (orderBy) params.order_by = orderBy;
  if (sort) params.sort = sort;

  if (search && searchCategory) {
    switch (searchCategory) {
      case "category":
        params.category = search;
        break;
      case "name":
        params.name = search;
        break;
      case "start_date":
        params.startDate = search;
        break;
      case "end_date":
        params.endDate = search;
        break;
      case "date":
        params.date = search;
        break;
    }
  }

  const apiUrl = API_URL.expense.getAll(params);
  const response = await fetch(apiUrl);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch expenses: ${response.status}`);
  }

  const result = await response.json();
  const body = result.body || result;

  // Check if data exists
  if (!body || !body.data) {
    throw new Error("Invalid response structure: missing data");
  }

  if (!body.data.expenses) {
    throw new Error("Invalid response structure: missing expenses");
  }

  return {
    expenses: body.data.expenses as Expense[],
    totalExpense: parseInt(body.data.totalExpenses) || 0,
    meta: body.meta as Meta,
  };
};

export const load = (async ({ fetch, url }) => {
  const updateExpenseform = await superValidate(zod4(updateExpenseSchema));
  const insertExpenseForm = await superValidate(
    zod4(insertMultipleExpenseSchema),
    {
      defaults: {
        items: [{ name: "", amount: 0, category: "" }],
      },
    },
  );
  try {
    // get all
    const searchCategory = url.searchParams.get("search_category");
    const search = url.searchParams.get("search");
    const orderBy = url.searchParams.get("order_by");
    const sort = url.searchParams.get("sort");
    const limit = 5;
    const offset = parseInt(url.searchParams.get("offset") || "0");

    const { expenses, totalExpense, meta } = await getAll(
      fetch,
      searchCategory || "",
      search || "",
      orderBy || "",
      sort || "",
      limit,
      offset,
    );

    return {
      expenses,
      totalExpense,
      meta,
      filters: { searchCategory, search, orderBy, sort },
      updateExpenseform,
      insertExpenseForm,
    };
  } catch (error) {
    return {
      expenses: [] as Expense[],
      totalExpense: 0,
      meta: {
        total: 0,
        limit: 10,
        offset: 0,
        page: 1,
        totalPages: 1,
      } as Meta,
      updateExpenseform,
      insertExpenseForm,
    };
  }
}) satisfies PageServerLoad;

export const actions = {
  delete: async ({ fetch, request }) => {
    const apiHeader: Record<string, string> = {};

    const form = await request.formData();
    const id = form.get("id") as string;

    try {
      apiHeader["Content-Type"] = "application/json";

      const response = await fetch(API_URL.expense.delete(id), {
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

  update: async ({ fetch, request, url }) => {
    const apiHeader: Record<string, string> = {};
    const form = await superValidate(request, zod4(updateExpenseSchema));

    try {
      if (!form.valid) {
        return fail(400, { form });
      }

      const { name, amount, id } = form.data;
      apiHeader["Content-Type"] = "application/json";
      const body = JSON.stringify({ name, amount });

      if (id) {
        const response = await fetch(API_URL.expense.update(id), {
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

  insert: async ({ fetch, request }) => {
    const apiHeader: Record<string, string> = {};
    apiHeader["Content-Type"] = "application/json";

    const form = await superValidate(
      request,
      zod4(insertMultipleExpenseSchema),
    );

    try {
      if (!form.valid) {
        return fail(400, { form });
      }

      const { items } = form.data;
      const body = JSON.stringify(items);

      const response = await fetch(API_URL.expense.insert(), {
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
} satisfies Actions;
