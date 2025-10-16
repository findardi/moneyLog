import postgres from "postgres";
import env from "../env";
import { drizzle } from "drizzle-orm/postgres-js";
import logger from "../logger";

const connectionString = `postgresql://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`;

const client = postgres(connectionString, {
  prepare: false,
  ssl: env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
  idle_timeout: 20,
  max_lifetime: 60 * 60,
  connect_timeout: 10,
  debug:
    env.NODE_ENV === "PRODUCTION" || "DEVELOPMENT"
      ? (connection, query, parameters) => {
          if (
            !query.includes("pg_catalog") &&
            !query.includes("information_schema")
          ) {
            logger.info("Database Query", {
              action: "db_query",
              resource: "database",
              query: query,
              params: parameters,
              connection: connection,
            });
          }
        }
      : false,
});
const db = drizzle(client);

export default db;
