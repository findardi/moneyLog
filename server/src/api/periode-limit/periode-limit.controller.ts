import { AccessMiddleware } from "@/core/utils/middleware/access.middleware";
import { JWTPayload } from "@/core/utils/middleware/jwt";
import { Context, Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { periodeLimitService } from "./periode-limit.service";
import logger from "@/core/utils/logger";
import { SpendingNotification } from "@/core/utils/sse-connection";

const periodeLimitRoute = new Hono();
const accessMiddleware = new AccessMiddleware();

// Health check endpoint for SSE
periodeLimitRoute.get(
  "/notifications/health",
  accessMiddleware.authenticate,
  accessMiddleware.isActive,
  async (c: Context) => {
    const payload = c.get("payload") as JWTPayload;
    const userId = payload.id;

    const clientCount = periodeLimitService
      .getSSEManager()
      .getClientCount(userId);
    const totalClients = periodeLimitService
      .getSSEManager()
      .getTotalClientCount();

    return c.json({
      status: "healthy",
      userId,
      connectedClients: clientCount,
      totalSystemClients: totalClients,
    });
  },
);

// Get current spending status
periodeLimitRoute.get(
  "/notifications/status",
  accessMiddleware.authenticate,
  accessMiddleware.isActive,
  async (c: Context) => {
    const payload = c.get("payload") as JWTPayload;
    const userId = payload.id;

    try {
      const status = await periodeLimitService.getSpendingStatus(userId);

      if (!status) {
        return c.json(
          {
            error: "No active spending limit found",
          },
          404,
        );
      }

      return c.json(status);
    } catch (error) {
      logger.error("Error getting spending status:", error);
      return c.json(
        {
          error: "Failed to get spending status",
        },
        500,
      );
    }
  },
);

periodeLimitRoute.get(
  "/notifications/stream",
  accessMiddleware.authenticate,
  accessMiddleware.isActive,
  async (c: Context) => {
    const payload = c.get("payload") as JWTPayload;
    const userId = payload.id;

    logger.info(`SSE stream started for user ${userId}`);

    return streamSSE(c, async (stream) => {
      let isConnected = true;
      let heartbeatInterval: Timer | null = null;

      // Subscribe to SSE manager
      const unsubscribe = periodeLimitService.subscribeToNotifications(
        userId,
        async (data: SpendingNotification) => {
          if (!isConnected) return;

          try {
            await stream.writeSSE({
              event: "notification",
              data: JSON.stringify(data),
            });
          } catch (err) {
            logger.error(`SSE write error for user ${userId}:`, err);
            cleanup();
          }
        },
      );

      // Setup cleanup function
      const cleanup = () => {
        if (!isConnected) return;
        isConnected = false;

        logger.info(`SSE connection closed for user ${userId}`);

        if (heartbeatInterval) {
          clearInterval(heartbeatInterval);
          heartbeatInterval = null;
        }

        if (unsubscribe) {
          unsubscribe();
        }
      };

      try {
        // Send initial connected event
        await stream.writeSSE({
          event: "connected",
          data: JSON.stringify({
            message: "Connected to Spending notifications",
          }),
        });

        // Heartbeat every 30 seconds to keep connection alive
        heartbeatInterval = setInterval(async () => {
          if (!isConnected) {
            cleanup();
            return;
          }

          try {
            await stream.writeSSE({
              event: "heartbeat",
              data: JSON.stringify({ timestamp: Date.now() }),
            });
          } catch (err) {
            logger.error(`Heartbeat failed for user ${userId}:`, err);
            cleanup();
          }
        }, 30_000);

        // Register cleanup handlers
        stream.onAbort(() => {
          logger.info(`SSE stream aborted for user ${userId}`);
          cleanup();
        });

        c.req.raw.signal.addEventListener("abort", () => {
          logger.info(`Request aborted for user ${userId}`);
          cleanup();
        });

        await stream.sleep(2147483647);
      } catch (error) {
        logger.error(`SSE error for user ${userId}:`, error);
        cleanup();
        throw error;
      }
    });
  },
);

// Graceful shutdown handler
if (typeof process !== "undefined") {
  const gracefulShutdown = () => {
    logger.info("Shutting down SSE connections...");
    periodeLimitService.getSSEManager().clearAllClients();
    process.exit(0);
  };

  process.on("SIGTERM", gracefulShutdown);
  process.on("SIGINT", gracefulShutdown);
}

export default periodeLimitRoute;
