import { Router } from "express";
import { loginHandler, logoutHandler, refreshHandler, registerHandler } from "./auth.controller";
import { asyncHandler } from "../../lib/asyncHandler";

const router = Router();

router.post("/register", asyncHandler(registerHandler));
router.post("/login", asyncHandler(loginHandler));
router.post("/refresh", asyncHandler(refreshHandler));
router.post("/logout", asyncHandler(logoutHandler));

export const authRouter = router;
