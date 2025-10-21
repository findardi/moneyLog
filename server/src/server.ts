import app from ".";
import { testConnectionDB } from "./core/utils/database/connection";
import env from "./core/utils/env";
import logger from "./core/utils/logger";

const port = env.PORT || "3838";

const setupServer = async () => {
  await testConnectionDB();
  const message = `server is running on port ${port}`;
  env.NODE_ENV === "production" ? console.log(message) : logger.info(message);
};

setupServer();

Bun.serve({
  fetch: app.fetch,
  port,
  idleTimeout: 255,
});
