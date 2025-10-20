import z from "zod";

export const createExpenseSchema = z.object({
    name: z.string().nonempty("Name is required"),
    amount: z.number().nonnegative("Amount must be a non-negative number"),
    category_id: z.number().nonnegative("Category ID must be a non-negative number").optional(),
    spent_at: z.date().optional(),
})

export const createBulkExpenseSchema = z.union([
    createExpenseSchema,
    z.array(createExpenseSchema)
])

export const updateExpenseSchema = z.object({
    name: z.string().optional(),
    amount: z.number().optional(),
    spent_at: z.date().optional(),
})

export type createExpenseDto = z.infer<typeof createExpenseSchema>
export type createBulkExpenseDto = z.infer<typeof createBulkExpenseSchema>
export type updateExpenseDto = z.infer<typeof updateExpenseSchema>
