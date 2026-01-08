import pinoHttp from "pino-http";
import { logger } from "../lib/logger.js";

const pinoHttpMiddleware = pinoHttp as unknown as typeof pinoHttp.default;

export const requestLogger = pinoHttpMiddleware({
  logger,
  customSuccessMessage: function () {
    return "request completed";
  },
  customErrorMessage: function () {
    return "request errored";
  }
});
