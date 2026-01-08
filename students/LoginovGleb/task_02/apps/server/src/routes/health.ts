import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../lib/asyncHandler.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

router.get(
  "/ready",
  asyncHandler(async (_req: import("express").Request, res: import("express").Response) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.json({ status: "ready" });
    } catch (err) {
      res
        .status(503)
        .json({ status: "error", error: { code: "db_unavailable", message: "Database not reachable" } });
    }
  })
);

export const healthRouter = router;
