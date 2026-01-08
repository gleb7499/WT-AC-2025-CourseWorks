import pinoHttp from "pino-http";
import { logger } from "../lib/logger.js";

export const requestLogger = pinoHttp({
  logger,
  customSuccessMessage: function () {
    return "request completed";
  },
  customErrorMessage: function () {
    return "request errored";
  },
  serializers: {
    err: pinoHttp.stdSerializers.err,
    req: pinoHttp.stdSerializers.req,
    res: pinoHttp.stdSerializers.res
  }
});
