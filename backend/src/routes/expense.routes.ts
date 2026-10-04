import { Router } from "express";
import {
  createHandler,
  deleteHandler,
  getHandler,
  listHandler,
  updateHandler,
} from "../controllers/expense.controller";
import { requireAuth } from "../middleware/auth";
import { validateBody, validateQuery } from "../middleware/validate";
import { asyncHandler } from "../utils/asyncHandler";
import { expenseBodySchema, expenseListQuerySchema } from "../validators/expense.schema";

const router = Router();

router.use(requireAuth);

router.get("/", validateQuery(expenseListQuerySchema), asyncHandler(listHandler));
router.get("/:id", asyncHandler(getHandler));
router.post("/", validateBody(expenseBodySchema), asyncHandler(createHandler));
router.put("/:id", validateBody(expenseBodySchema), asyncHandler(updateHandler));
router.delete("/:id", asyncHandler(deleteHandler));

export default router;
