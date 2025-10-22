import { superValidate } from "sveltekit-superforms";
import type { PageServerLoad } from "./$types";
import { zod4 } from "sveltekit-superforms/adapters";
import { loginSchema, registerSchema } from "$lib/schema/user.schema";

export const load = (async ({ url }) => {
  const tab = url.searchParams.get("tab") || "register";
  const schema = tab === "register" ? registerSchema : loginSchema;
  return {
    loginForm: await superValidate(zod4(loginSchema)),
    registerForm: await superValidate(zod4(registerSchema)),
  };
}) satisfies PageServerLoad;
