import env from "./src/core/utils/env";
import { Config } from "drizzle-kit";

export default {
  schema: "./src/core/utils/database/schema/**/*.ts",
  out: "./src/core/utils/database/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: `postgresql://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`,
  },
} satisfies Config;
