export const tokenType = {
  ACTIVATION: "ACTIVATION",
  RECOVERY: "RECOVERY",
  RESET: "RESET",
  REFRESH: "REFRESH",
} as const;

export const userRole = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const;

export const spendingLimitType = {
  DAILY: "DAILY",
  WEEKLY: "WEEKLY",
  MONTHLY: "MONTHLY",
  QUARTERLY: "QUARTERLY",
  YEARLY: "YEARLY",
  CUSTOM: "CUSTOM",
} as const;
