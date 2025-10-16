import pino from "pino";
import * as fs from "node:fs";
import * as path from "node:path";
import env from "./env";

export class Logger {
  private static instance: Logger;
  private logger: pino.Logger;

  constructor() {
    const isProd = env.NODE_ENV === "PRODUCTION";

    this.logger = isProd
      ? pino({
          level: "info",
          formatters: {
            level(label) {
              return { level: label };
            },
            log(object) {
              const { req, res, ...rest } = object;
              return rest;
            },
          },
          timestamp: pino.stdTimeFunctions.isoTime,
          transport: {
            target: "pino/file",
            options: {
              destination: this.getLogFilePath(),
              mkdir: true,
              maxSize: 10 * 1024 * 1024, // 10MB
            },
          },
        })
      : pino({
          level: "debug",
          formatters: {
            level(label) {
              return { level: label };
            },
          },
          timestamp: pino.stdTimeFunctions.isoTime,
          transport: {
            target: "pino-pretty",
            options: {
              colorize: true,
              ignore: "pid,hostname",
              translateTime: "yyyy-mm-dd HH:MM:ss",
              singleLine: true,
            },
          },
        });
  }

  /**
   * Generates the log file path with the format app.dd-mm-yyyy-sequence.log
   * Checks for existing log files for the current day and increments sequence if needed
   * @returns The path to the log file
   */
  private getLogFilePath(): string {
    const logsDir = path.join(process.cwd(), "logs");

    // Create logs directory if it doesn't exist
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    // Get current date in dd-mm-yyyy format
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const dateStr = `${day}-${month}-${year}`;

    // Find the next sequence number
    let sequence = 1;
    const basePattern = `app.${dateStr}-`;

    // Read all files in the logs directory
    const files = fs.readdirSync(logsDir);

    // Filter files that match today's date pattern and find the highest sequence
    const todayFiles = files.filter((file) => file.startsWith(basePattern));

    if (todayFiles.length > 0) {
      // Extract sequence numbers and find the highest
      const sequences = todayFiles.map((file) => {
        const match = file.match(new RegExp(`${basePattern}(\\d+)\\.log$`));
        return match ? parseInt(match[1], 10) : 0;
      });

      // Find the highest sequence number
      const maxSequence = Math.max(...sequences);

      // Check if the latest log file is less than 10MB
      const latestFile = `app.${dateStr}-${String(maxSequence).padStart(
        2,
        "0"
      )}.log`;
      const latestFilePath = path.join(logsDir, latestFile);

      if (fs.existsSync(latestFilePath)) {
        const stats = fs.statSync(latestFilePath);
        // If the file is less than 10MB, use the same sequence number
        if (stats.size < 10 * 1024 * 1024) {
          sequence = maxSequence;
        } else {
          // Otherwise, increment the sequence
          sequence = maxSequence + 1;
        }
      }
    }

    // Format the sequence with leading zeros (e.g., 01, 02)
    const sequenceStr = String(sequence).padStart(2, "0");

    // Create the final log file path
    const logFileName = `app.${dateStr}-${sequenceStr}.log`;
    return path.join(logsDir, logFileName);
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Enhanced info logging with context
   * @param message Main log message or object
   * @param context Additional context object or parameters
   */
  public info(message: string | object, context?: object | any): void {
    if (typeof message === "string" && context) {
      // Extract key information from context if it's an object
      if (
        typeof context === "object" &&
        context !== null &&
        !Array.isArray(context)
      ) {
        const { id, userId, email, action, resource, ...rest } = context;

        // Build a more informative log message with key context
        const contextStr = [
          id ? `id=${id}` : "",
          userId ? `userId=${userId}` : "",
          email ? `email=${email}` : "",
          action ? `action=${action}` : "",
          resource ? `resource=${resource}` : "",
        ]
          .filter(Boolean)
          .join(" ");

        // Log the enhanced message with remaining context as object
        this.logger.info({
          ...rest,
          msg: `${message}${contextStr ? ` [${contextStr}]` : ""}`,
        });
      } else {
        // Handle non-object context
        this.logger.info(message, context);
      }
    } else {
      // Handle object messages or simple string messages
      this.logger.info(message);
    }
  }

  public error(message: string | object, ...args: any[]): void {
    if (typeof message === "object" && message !== null) {
      if (message instanceof Error) {
        const errorObj = {
          message: message.message,
          ...(message as any),
        };

        if (env.NODE_ENV === "PRODUCTION") {
          delete errorObj.stack;
        }

        this.logger.error(errorObj, ...args);
      } else {
        // For regular objects
        this.logger.error(message, ...args);
      }
    } else {
      // For string messages
      this.logger.error(message, ...args);
    }
  }

  /**
   * Enhanced warning logging with context
   * @param message Main log message or object
   * @param context Additional context object or parameters
   */
  public warn(message: string | object, context?: object | any): void {
    if (typeof message === "string" && context && typeof context === "object") {
      const { id, userId, email, action, resource, ...rest } = context;

      const contextStr = [
        id ? `id=${id}` : "",
        userId ? `userId=${userId}` : "",
        email ? `email=${email}` : "",
        action ? `action=${action}` : "",
        resource ? `resource=${resource}` : "",
      ]
        .filter(Boolean)
        .join(" ");

      this.logger.warn({
        ...rest,
        msg: `${message}${contextStr ? ` [${contextStr}]` : ""}`,
      });
    } else {
      this.logger.warn(message, context);
    }
  }

  public debug(message: string | object, ...args: any[]): void {
    this.logger.debug(message, ...args);
  }

  public trace(message: string | object, ...args: any[]): void {
    this.logger.trace(message, ...args);
  }

  public fatal(message: string | object, ...args: any[]): void {
    this.logger.fatal(message, ...args);
  }
}

// For backward compatibility
const logger = Logger.getInstance();
export default logger;
