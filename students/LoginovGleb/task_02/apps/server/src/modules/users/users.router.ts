import { Router } from "express";
import { meHandler } from "./users.controller";
import { authenticate } from "../../middleware/auth";
import { asyncHandler } from "../../lib/asyncHandler";

const router = Router();

router.get("/me", authenticate, asyncHandler(meHandler));

export const usersRouter = router;
