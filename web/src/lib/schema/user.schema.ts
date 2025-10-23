import z from "zod";

const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~])(?!.*\s).{8,}$/;

export const registerSchema = z.object({
  username: z
    .string()
    .nonempty("Username is required")
    .min(3, "Username must be at least 3 characters long")
    .max(256, "Username must be at most 256 characters long"),
  email: z.string().email("Email is required"),
  password: z
    .string()
    .regex(
      strongPasswordRegex,
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    ),
  first_name: z.string().nonempty("first name is required"),
  last_name: z.string().nonempty("last name is required"),
});

export const loginSchema = z.object({
  email: z.string().email("Email is required"),
  password: z.string().nonempty("Password is required"),
});

export const activationSchema = z.object({
  token: z
    .string()
    .nonempty("Token is required")
    .min(6, "Token must be at least 6 characters long"),
});

export type registerDTO = z.infer<typeof registerSchema>;
export type loginDTO = z.infer<typeof loginSchema>;
export type activationDTO = z.infer<typeof activationSchema>;
