import { Router } from "express";
import { getHandler, upsertHandler } from "../controllers/budget.controller";
import { requireAuth } from "../middleware/auth";
import { validateBody, validateQuery } from "../middleware/validate";
import { asyncHandler } from "../utils/asyncHandler";
import { budgetQuerySchema, budgetUpsertSchema } from "../validators/budget.schema";

const router = Router();

router.use(requireAuth);

router.get("/", validateQuery(budgetQuerySchema), asyncHandler(getHandler));
router.put("/", validateBody(budgetUpsertSchema), asyncHandler(upsertHandler));

export default router;
