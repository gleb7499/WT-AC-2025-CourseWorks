import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { authorizeRoles } from "../../middleware/authorize";
import { asyncHandler } from "../../lib/asyncHandler";
import {
  createStatusHandler,
  deleteStatusHandler,
  getStatusHandler,
  listStatusesHandler,
  updateStatusHandler
} from "./statuses.controller";

const router = Router();

router.get("/", authenticate, asyncHandler(listStatusesHandler));
router.get("/:id", authenticate, asyncHandler(getStatusHandler));
router.post("/", authenticate, authorizeRoles("admin"), asyncHandler(createStatusHandler));
router.put("/:id", authenticate, authorizeRoles("admin"), asyncHandler(updateStatusHandler));
router.delete("/:id", authenticate, authorizeRoles("admin"), asyncHandler(deleteStatusHandler));

export const statusesRouter = router;
