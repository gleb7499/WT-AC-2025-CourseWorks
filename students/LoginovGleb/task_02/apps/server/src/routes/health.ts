import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../lib/asyncHandler.js";

const router = Router();

// Liveness probe - checks if the server is running
router.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// Readiness probe - checks if the server is ready to accept traffic
router.get(
  "/ready",
  asyncHandler(async (_req: import("express").Request, res: import("express").Response) => {
    const checks: Record<string, string> = {};
    let isReady = true;

    // Check database connection
    try {
      await prisma.$queryRaw`SELECT 1`;
      checks.database = "ok";
    } catch (err) {
      checks.database = "error";
      isReady = false;
    }

    // TODO: Add Redis check when implemented
    // checks.redis = "ok" or "error"

    if (isReady) {
      res.json({
        status: "ready",
        timestamp: new Date().toISOString(),
        checks,
      });
    } else {
      res.status(503).json({
        status: "unavailable",
        timestamp: new Date().toISOString(),
        checks,
      });
    }
  })
);

export const healthRouter = router;
