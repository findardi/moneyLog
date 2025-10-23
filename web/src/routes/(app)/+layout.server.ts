import type { LayoutServerLoad } from "./$types";

export const load = (async ({ locals }) => {
  return {
    isActive: locals.user?.is_active,
    username: locals.user?.username,
  };
}) satisfies LayoutServerLoad;
