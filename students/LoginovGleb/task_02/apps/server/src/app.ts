import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import swaggerUi from "swagger-ui-express";
import YAML from "yaml";
import { requestLogger } from "./middleware/requestLogger.js";
import { apiRouter } from "./routes/index.js";
import { notFoundHandler } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { config } from "./lib/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const openapiPath = join(__dirname, "..", "openapi.yaml");
const openapiDocument = YAML.parse(readFileSync(openapiPath, "utf8"));

export const buildApp = () => {
  const app = express();

  app.use(requestLogger);
  app.use(
    cors({
      origin: config.corsOrigins.length > 0 ? config.corsOrigins : false,
      credentials: true
    })
  );
  app.use(helmet());
  app.use(express.json());
  app.use(cookieParser());

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiDocument));
  app.get("/api-docs.json", (_req, res) => res.json(openapiDocument));

  app.use(apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
