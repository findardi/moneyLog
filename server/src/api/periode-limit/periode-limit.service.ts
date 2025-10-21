import db from "@/core/utils/database/connection";
import { periodeLimit } from "@/core/utils/database/schema/periode-limit";
import { spendingLimit } from "@/core/utils/database/schema/spending-limit";
import { groqService } from "@/core/utils/libs/groq/groq.service";
import logger from "@/core/utils/logger";
import { SpendingNotification, SSEManager } from "@/core/utils/sse-connection";
import { and, eq, gte, lte } from "drizzle-orm";

export const sseManager = new SSEManager();
const groq = new groqService();

export const periodeLimitService = {
  getSSEManager: () => sseManager,
  subscribeToNotifications: (
    userId: number,
    sendCallback: (data: SpendingNotification) => void | Promise<void>,
  ) => {
    sseManager.addClient(userId, sendCallback);

    periodeLimitService.sendSpendingNotification(userId).catch((error) => {
      logger.error("error sending initial notification: ", error);
    });

    return () => {
      sseManager.removeClient(userId, sendCallback);
    };
  },

  sendSpendingNotification: async (userId: number) => {
    try {
      const limitData = await db
        .select({
          currentSpending: periodeLimit.currentSpending,
          maxLimit: spendingLimit.amount,
          period: spendingLimit.period,
          alertPercentage: spendingLimit.alertPercentage,
          periodeStart: periodeLimit.periodeStart,
          periodeEnd: periodeLimit.periodeEnd,
        })
        .from(periodeLimit)
        .innerJoin(
          spendingLimit,
          eq(periodeLimit.spendingLimitId, spendingLimit.id),
        )
        .where(
          and(
            eq(periodeLimit.userId, userId),
            eq(spendingLimit.isActive, true),
            lte(periodeLimit.periodeStart, new Date()),
            gte(periodeLimit.periodeEnd, new Date()),
          ),
        )
        .limit(1);

      if (limitData.length === 0) {
        logger.warn(`No spending limit found for user ${userId}`);
        return;
      }

      const data = limitData[0];
      const currentPercentage = (data.currentSpending / data.maxLimit) * 100;
      const isAlert = currentPercentage >= data.alertPercentage;
      const messageResponse = await groq.messageAlert(
        data.alertPercentage,
        currentPercentage,
        data.period,
      );

      let alertMessage;

      if (messageResponse) {
        const parsed = JSON.parse(messageResponse);
        alertMessage = parsed.message;
      }

      const notifications: SpendingNotification = {
        userId,
        currentSpending: data.currentSpending,
        maxSpending: data.maxLimit,
        alertPercentage: data.alertPercentage,
        currentPercentage: parseFloat(currentPercentage.toFixed(2)),
        message: alertMessage,
        isAlert,
        timestamp: new Date(),
      };

      // Send to all connected clients
      await sseManager.sendToUser(userId, notifications);

      return notifications;
    } catch (error) {
      logger.error("Error sending spending notification:", error);
      throw error;
    }
  },

  getSpendingStatus: async (userId: number) => {
    try {
      const limitData = await db
        .select({
          currentSpending: periodeLimit.currentSpending,
          maxLimit: spendingLimit.amount,
          alertPercentage: spendingLimit.alertPercentage,
          periodeStart: periodeLimit.periodeStart,
          periodeEnd: periodeLimit.periodeEnd,
        })
        .from(periodeLimit)
        .innerJoin(
          spendingLimit,
          eq(periodeLimit.spendingLimitId, spendingLimit.id),
        )
        .where(
          and(
            eq(periodeLimit.userId, userId),
            eq(spendingLimit.isActive, true),
            lte(periodeLimit.periodeStart, new Date()),
            gte(periodeLimit.periodeEnd, new Date()),
          ),
        )
        .limit(1);

      if (limitData.length === 0) {
        return null;
      }

      const data = limitData[0];
      const currentPercentage = (data.currentSpending / data.maxLimit) * 100;
      const isAlert = currentPercentage >= data.alertPercentage;

      return {
        currentSpending: data.currentSpending,
        maxLimit: data.maxLimit,
        alertPercentage: data.alertPercentage,
        currentPercentage: parseFloat(currentPercentage.toFixed(2)),
        isAlert,
        periodeStart: data.periodeStart,
        periodeEnd: data.periodeEnd,
      };
    } catch (error) {
      logger.error("Error getting spending status:", error);
      throw error;
    }
  },

  // Broadcast notification to all connected clients of a user
  broadcastToUser: async (userId: number) => {
    try {
      await periodeLimitService.sendSpendingNotification(userId);
    } catch (error) {
      logger.error(`Error broadcasting to user ${userId}:`, error);
    }
  },
};
