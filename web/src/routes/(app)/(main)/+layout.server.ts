import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load = (async ({ locals }) => {
  const isActive = locals.user?.is_active;

  if (!isActive) {
    redirect(303, "/");
  }

  return {
    isActive,
  };
}) satisfies LayoutServerLoad;
