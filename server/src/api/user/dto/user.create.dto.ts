import z from "zod";

const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~])(?!.*\s).{8,}$/;
  
export const createUserSchema = z.object({
    username: z.string().nonempty("Username is required").min(3, "Username must be at least 3 characters long").max(256, "Username must be at most 256 characters long"),
    email: z.string().email("Email is required"),
    password: z.string().regex(strongPasswordRegex, "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."),
    fullname: z.string().nonempty("fullanme is required")
})

export const loginUserSchema = z.object({
    email: z.string().email("Email is required"),
    password: z.string().regex(strongPasswordRegex, "Password must be at least 12 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."),
})

export type createUserDto = z.infer<typeof createUserSchema>
export type loginUserDto = z.infer<typeof loginUserSchema>