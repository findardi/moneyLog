import { validateToken } from "$lib/stores/users";
import API_URL from "$lib/utils/API_URL";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get("auth_token");
  if (token) {
    event.locals.user = await validateToken(event.fetch, token);

    // set headers
    const originalFetch = event.fetch;
    event.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.href
            : input.url;
      const isApiCall =
        url.includes("/api/") || url.startsWith(API_URL.getBaseURL() || "");

      if (isApiCall) {
        const headers = new Headers(init?.headers);
        if (!headers.has("Authorization")) {
          headers.set("Authorization", `Bearer ${token}`);
        }

        return originalFetch(input, {
          ...init,
          headers,
        });
      }

      return originalFetch(input, init);
    };
  }

  return resolve(event);
};
