import db from "@/core/utils/database/connection";
import {
  createSpendingLimitDto,
  updateSpendingLimitDto,
} from "./dto/spending-limit.dto";
import { spendingLimit } from "@/core/utils/database/schema/spending-limit";
import { eq } from "drizzle-orm";
import { BadRequest, NotFound } from "@/core/utils/error/error-handler";
import { spendingLimitType } from "@/core/constant/types";
import { periodeLimit } from "@/core/utils/database/schema/periode-limit";

export const spendingLimitService = {
  create: async (request: createSpendingLimitDto, userId: number) => {
    const { period, amount, alertPercentage } = request;

    const findSpendingLimit = await db
      .select({ id: spendingLimit.id })
      .from(spendingLimit)
      .where(eq(spendingLimit.userId, userId))
      .limit(1);

    if (findSpendingLimit.length > 0) {
      throw new BadRequest("Spending limit already exists");
    }

    try {
      const result = await db.transaction(async (trx) => {
        // Insert spending limit config
        const [limitResult] = await trx
          .insert(spendingLimit)
          .values({
            id: crypto.randomUUID(),
            userId,
            period,
            amount,
            alertPercentage,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning({ id: spendingLimit.id });

        // Calculate periode dates
        const { startDate, endDate } =
          spendingLimitService.calculatePeriodeDates(period);

        // Insert periode tracking
        await trx.insert(periodeLimit).values({
          id: crypto.randomUUID(),
          userId,
          spendingLimitId: limitResult.id,
          periodeStart: startDate,
          periodeEnd: endDate,
          currentSpending: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        return limitResult.id;
      });

      return result;
    } catch (error) {
      throw error;
    }
  },

  calculatePeriodeDates: (period: string) => {
    const startDate = new Date();
    const endDate = new Date();

    if (period === spendingLimitType.DAILY) {
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
    }

    if (period === spendingLimitType.WEEKLY) {
      const day = startDate.getDay();
      const diff = day === 0 ? -6 : 1 - day; // Senin = hari pertama
      startDate.setDate(startDate.getDate() + diff);
      startDate.setHours(0, 0, 0, 0);

      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
    }

    if (period === spendingLimitType.MONTHLY) {
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);

      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setDate(0); // Last day of month
      endDate.setHours(23, 59, 59, 999);
    }

    if (period === spendingLimitType.QUARTERLY) {
      const currentQuarter = Math.floor(startDate.getMonth() / 3);
      startDate.setMonth(currentQuarter * 3);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);

      endDate.setMonth(startDate.getMonth() + 3);
      endDate.setDate(0);
      endDate.setHours(23, 59, 59, 999);
    }

    if (period === spendingLimitType.YEARLY) {
      startDate.setMonth(0);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);

      endDate.setFullYear(endDate.getFullYear() + 1);
      endDate.setMonth(0);
      endDate.setDate(0);
      endDate.setHours(23, 59, 59, 999);
    }

    if (period === spendingLimitType.CUSTOM) {
      const day = startDate.getDay();
      const diff = day === 0 ? -6 : 1 - day;
      startDate.setDate(startDate.getDate() + diff);
      startDate.setHours(0, 0, 0, 0);

      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
    }
    return { startDate, endDate };
  },

  update: async (spendingId: string, request: updateSpendingLimitDto) => {
    const { period, amount, alertPercentage } = request;
    try {
      const result = await db
        .update(spendingLimit)
        .set({
          period,
          amount,
          alertPercentage,
          updatedAt: new Date(),
        })
        .where(eq(spendingLimit.id, spendingId))
        .returning({ id: spendingLimit.id })
        .then((data) => data[0].id);

      return result;
    } catch (error) {
      throw error;
    }
  },

  delete: async (spendingId: string) => {
    try {
      const result = await db
        .delete(spendingLimit)
        .where(eq(spendingLimit.id, spendingId))
        .returning({ id: spendingLimit.id })
        .then((data) => data[0].id);

      return result;
    } catch (error) {
      throw error;
    }
  },

  getByUser: async (userId: number) => {
    try {
      const result = await db
        .select({
          period: spendingLimit.period,
          amount: spendingLimit.amount,
          alertPercentage: spendingLimit.alertPercentage,
        })
        .from(spendingLimit)
        .where(eq(spendingLimit.userId, userId))
        .then((data) => data);

      if (!result) {
        throw new NotFound("Spending limit not found");
      }

      return result;
    } catch (error) {
      throw error;
    }
  },
};
