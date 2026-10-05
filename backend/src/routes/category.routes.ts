import { Router } from "express";
import {
  createHandler,
  deleteHandler,
  listHandler,
  updateHandler,
} from "../controllers/category.controller";
import { requireAuth } from "../middleware/auth";
import { requireAdmin } from "../middleware/requireAdmin";
import { validateBody } from "../middleware/validate";
import { asyncHandler } from "../utils/asyncHandler";
import { categoryBodySchema } from "../validators/category.schema";

const router = Router();

router.use(requireAuth);

router.get("/", asyncHandler(listHandler));
router.post("/", requireAdmin, validateBody(categoryBodySchema), asyncHandler(createHandler));
router.put("/:id", requireAdmin, validateBody(categoryBodySchema), asyncHandler(updateHandler));
router.delete("/:id", requireAdmin, asyncHandler(deleteHandler));

export default router;
