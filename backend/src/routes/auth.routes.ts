import { Router } from "express";
import { loginHandler, meHandler, signupHandler } from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { asyncHandler } from "../utils/asyncHandler";
import { loginSchema, signupSchema } from "../validators/auth.schema";

const router = Router();

router.post("/signup", validateBody(signupSchema), asyncHandler(signupHandler));
router.post("/login", validateBody(loginSchema), asyncHandler(loginHandler));
router.get("/me", requireAuth, asyncHandler(meHandler));

export default router;
