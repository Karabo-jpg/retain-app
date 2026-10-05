import { Router } from "express";
import { insightsHandler } from "../controllers/admin.controller";
import { requireAuth } from "../middleware/auth";
import { requireAdmin } from "../middleware/requireAdmin";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.use(requireAuth, requireAdmin);

router.get("/insights", asyncHandler(insightsHandler));

export default router;
