import z from "zod";

export const createSpendingLimitSchema = z.object({
  period: z
    .enum(["DAILY", "WEEKLY", "MONTHLY", "QUARTERLY", "YEARLY", "CUSTOM"])
    .default("WEEKLY"),
  amount: z.number().min(1).nonnegative(),
  alertPercentage: z.number().min(20).max(100).nonnegative(),
});

export const updateSpendingLimitSchema = z.object({
  period: z
    .enum(["DAILY", "WEEKLY", "MONTHLY", "QUARTERLY", "YEARLY", "CUSTOM"])
    .optional(),
  amount: z.number().min(1).optional(),
  alertPercentage: z.number().min(20).max(100).optional(),
});

export type createSpendingLimitDto = z.infer<typeof createSpendingLimitSchema>;
export type updateSpendingLimitDto = z.infer<typeof updateSpendingLimitSchema>;
