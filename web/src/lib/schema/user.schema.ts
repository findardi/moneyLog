import z from "zod";

const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~])(?!.*\s).{8,}$/;

const usernameRegex = /^[a-zA-Z0-9]([a-zA-Z0-9_-]*[a-zA-Z0-9])?$/;

export const registerSchema = z
  .object({
    username: z
      .string()
      .nonempty("Username is required")
      .min(3, "Username must be at least 3 characters long")
      .max(20, "Username must be at most 20 characters long")
      .regex(
        usernameRegex,
        "Username can only contain letters, numbers, underscores, and hyphens. Must start and end with a letter or number.",
      ),
    email: z.string().email("Email is required"),
    password: z
      .string()
      .regex(
        strongPasswordRegex,
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      ),
    confirmPassword: z.string().nonempty("Confirm password is required"),
    first_name: z.string().nonempty("first name is required"),
    last_name: z.string().nonempty("last name is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
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
