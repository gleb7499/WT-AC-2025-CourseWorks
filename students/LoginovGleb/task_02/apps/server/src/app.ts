import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { requestLogger } from "./middleware/requestLogger";
import { apiRouter } from "./routes";
import { notFoundHandler } from "./middleware/notFound";
import { errorHandler } from "./middleware/errorHandler";
import { config } from "./lib/config";

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

  app.use(apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
