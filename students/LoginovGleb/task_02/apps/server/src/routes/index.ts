import { Router } from "express";
import { authRouter } from "../modules/auth/auth.router";
import { usersRouter } from "../modules/users/users.router";
import { healthRouter } from "./health";
import { formsRouter } from "../modules/forms/forms.router";
import { statusesRouter } from "../modules/statuses/statuses.router";
import { applicationsRouter } from "../modules/applications/applications.router";
import { attachmentsRouter } from "../modules/attachments/attachments.router";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/forms", formsRouter);
router.use("/statuses", statusesRouter);
router.use("/applications", applicationsRouter);
router.use("/attachments", attachmentsRouter);
router.use(healthRouter);

export const apiRouter = router;
