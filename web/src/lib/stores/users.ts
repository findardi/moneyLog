import API_URL from "$lib/utils/API_URL";

export async function validateToken(
  fetch: typeof globalThis.fetch,
  token: string | undefined,
) {
  const apiHeader: Record<string, string> = {};
  if (!token) {
    return null;
  }

  apiHeader["Content-Type"] = "application/json";
  apiHeader["Authorization"] = `Bearer ${token}`;
  try {
    const response = await fetch(API_URL.user.verify(), {
      method: "POST",
      headers: apiHeader,
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    return result.body?.data;
  } catch (error) {
    return null;
  }
}
