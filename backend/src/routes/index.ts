import { Router } from "express";
import adminRoutes from "./admin.routes";
import authRoutes from "./auth.routes";
import budgetRoutes from "./budget.routes";
import categoryRoutes from "./category.routes";
import dashboardRoutes from "./dashboard.routes";
import expenseRoutes from "./expense.routes";

const router = Router();

router.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));

router.use("/auth", authRoutes);
router.use("/expenses", expenseRoutes);
router.use("/budgets", budgetRoutes);
router.use("/categories", categoryRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/admin", adminRoutes);

export default router;
