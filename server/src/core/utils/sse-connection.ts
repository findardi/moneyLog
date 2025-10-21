import { EventEmitter } from "events";
import logger from "./logger";

export interface SpendingNotification {
  userId: number;
  currentSpending: number;
  maxSpending: number;
  alertPercentage: number;
  currentPercentage: number;
  isAlert: boolean;
  message?: string;
  timestamp: Date;
}

type SSECallback = (data: SpendingNotification) => void | Promise<void>;

export class SSEManager extends EventEmitter {
  private clients = new Map<number, Set<SSECallback>>();
  private deadCallbacks = new WeakSet<SSECallback>();

  constructor() {
    super();
    this.setMaxListeners(100);
  }

  addClient(userId: number, callback: SSECallback) {
    if (!this.clients.has(userId)) {
      this.clients.set(userId, new Set());
    }

    const clientSet = this.clients.get(userId)!;
    clientSet.add(callback);

    logger.info(
      `SSE client added for user ${userId}. Total clients: ${clientSet.size}`,
    );
  }

  removeClient(userId: number, callback: SSECallback) {
    const clientSet = this.clients.get(userId);
    if (!clientSet) return;

    clientSet.delete(callback);
    this.deadCallbacks.add(callback);

    if (clientSet.size === 0) {
      this.clients.delete(userId);
      logger.info(`All SSE clients removed for user ${userId}`);
    } else {
      logger.info(
        `SSE client removed for user ${userId}. Remaining: ${clientSet.size}`,
      );
    }
  }

  async sendToUser(userId: number, data: SpendingNotification) {
    const clientSet = this.clients.get(userId);
    if (!clientSet || clientSet.size === 0) {
      logger.debug(`No SSE clients found for user ${userId}`);
      return;
    }

    const deadCallbacks: SSECallback[] = [];
    const promises: Promise<void>[] = [];

    for (const callback of clientSet) {
      if (this.deadCallbacks.has(callback)) {
        deadCallbacks.push(callback);
        continue;
      }

      const promise = (async () => {
        try {
          await callback(data);
        } catch (err) {
          logger.error(`Error sending SSE to user ${userId}:`, err);
        }
      })();

      promises.push(promise);
    }

    // Wait for all callbacks to complete
    await Promise.allSettled(promises);

    // Clean up dead callbacks
    if (deadCallbacks.length > 0) {
      for (const callback of deadCallbacks) {
        this.removeClient(userId, callback);
      }
    }
  }

  getClientCount(userId: number): number {
    return this.clients.get(userId)?.size ?? 0;
  }

  getTotalClientCount(): number {
    let total = 0;
    for (const clientSet of this.clients.values()) {
      total += clientSet.size;
    }
    return total;
  }

  getAllUserIds(): number[] {
    return Array.from(this.clients.keys());
  }

  clearAllClients() {
    const userIds = this.getAllUserIds();
    this.clients.clear();
    logger.info(`Cleared all SSE clients for ${userIds.length} users`);
  }
}
