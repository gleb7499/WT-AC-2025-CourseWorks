import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { authorizeRoles } from "../../middleware/authorize";
import { asyncHandler } from "../../lib/asyncHandler";
import {
  changeStatusHandler,
  createApplicationHandler,
  deleteApplicationHandler,
  getApplicationHandler,
  listApplicationsHandler,
  submitApplicationHandler,
  updateApplicationHandler,
  withdrawApplicationHandler
} from "./applications.controller";

const router = Router();

router.use(authenticate);

router.get("/", asyncHandler(listApplicationsHandler));
router.get("/:id", asyncHandler(getApplicationHandler));
router.post("/", authorizeRoles("user", "admin"), asyncHandler(createApplicationHandler));
router.put("/:id", authorizeRoles("user", "admin"), asyncHandler(updateApplicationHandler));
router.delete("/:id", authorizeRoles("user", "admin"), asyncHandler(deleteApplicationHandler));
router.post("/:id/submit", authorizeRoles("user", "admin"), asyncHandler(submitApplicationHandler));
router.put("/:id/status", authorizeRoles("admin", "moderator"), asyncHandler(changeStatusHandler));
router.post("/:id/withdraw", authorizeRoles("user", "admin"), asyncHandler(withdrawApplicationHandler));

export const applicationsRouter = router;
