import app from ".";
import env from "./core/utils/env";
import logger from "./core/utils/logger";

const port = env.PORT || "3838";

const message = `server is running on port ${port}`;

env.NODE_ENV === "production" ? console.log(message) : logger.info(message);

Bun.serve({
    fetch:app.fetch,
    port
})