import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { asyncHandler } from "../../lib/asyncHandler";
import {
  createAttachmentHandler,
  deleteAttachmentHandler,
  getAttachmentHandler,
  listAttachmentsHandler
} from "./attachments.controller";

const router = Router();

router.use(authenticate);

router.get("/", asyncHandler(listAttachmentsHandler));
router.get("/:id", asyncHandler(getAttachmentHandler));
router.post("/", asyncHandler(createAttachmentHandler));
router.delete("/:id", asyncHandler(deleteAttachmentHandler));

export const attachmentsRouter = router;
