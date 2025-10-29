import z from "zod";

export const categoryEnum = z.enum([
  "Food & Drinks",
  "Tickets",
  "Shopping",
  "Health",
  "Entertainment",
  "Education",
  "Electricity & Water",
  "House",
  "Debt",
  "Insurance",
]);

export type Category = z.infer<typeof categoryEnum>;

export const insertExpenseSchema = z.object({
  name: z.string().min(3, "name must be at least 3 characters long"),
  amount: z.number().nonnegative("amount must be positive number"),
  category: categoryEnum.optional(),
})

export const updateExpenseSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  amount: z.number().nonnegative("amount must be positive number").optional(),
});

export const insertMultipleExpenseSchema = z.object({
  items: z.array(insertExpenseSchema).min(1, "At least one expense is required").max(5, "Maximum 5 expenses allowed")
});

export type insertExpenseDTO = z.infer<typeof insertExpenseSchema>;
export type updateExpenseDTO = z.infer<typeof updateExpenseSchema>;
export type insertMultipleExpenseDTO = z.infer<typeof insertMultipleExpenseSchema>;
