import { buildApp } from "./app";
import { config } from "./lib/config";
import { logger } from "./lib/logger";

const app = buildApp();

app.listen(config.port, config.host, () => {
  logger.info(`API server running at http://${config.host}:${config.port}`);
});
