import API_URL from "$lib/utils/api-url";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params, fetch }) => {
  try {
    const apiUrl = API_URL.expense.get(params.id);
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch expense detail: ${response.status}`);
    }

    const result = await response.json();
    const body = result.body || result;

    // Check if data exists
    if (!body || !body.data) {
      throw new Error("Invalid response structure: missing data");
    }

    // The expense data is directly in body.data
    return json(body.data);
  } catch (error) {
    throw error;
  }
};
