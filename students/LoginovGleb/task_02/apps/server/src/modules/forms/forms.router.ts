import { Router } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import {
  createFormHandler,
  deleteFormHandler,
  getFormHandler,
  listFormsHandler,
  updateFormHandler
} from "./forms.controller";
import { authenticate, authenticateOptional } from "../../middleware/auth";
import { authorizeRoles } from "../../middleware/authorize";

const router = Router();

router.get("/", authenticateOptional, asyncHandler(listFormsHandler));
router.get("/:id", authenticateOptional, asyncHandler(getFormHandler));
router.post("/", authenticate, authorizeRoles("admin"), asyncHandler(createFormHandler));
router.put("/:id", authenticate, authorizeRoles("admin"), asyncHandler(updateFormHandler));
router.delete("/:id", authenticate, authorizeRoles("admin"), asyncHandler(deleteFormHandler));

export const formsRouter = router;
