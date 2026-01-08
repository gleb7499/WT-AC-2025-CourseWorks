import pino from "pino";
import { config } from "./config.js";

export const logger = pino({
  level: process.env.LOG_LEVEL || (config.env === "development" ? "debug" : "info"),
  transport:
    config.env === "development"
      ? {
          target: "pino-pretty",
          options: { colorize: true, translateTime: true }
        }
      : undefined
});
