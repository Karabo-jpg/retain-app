import { prisma } from "../config/prisma";
import { serializeDecimals } from "../utils/serialize";

export async function getAdminInsights() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const [totalUsers, totalExpenses, allExpenses, expensesThisMonth, recentExpenses, recentUsers, categories] =
    await Promise.all([
      prisma.user.count(),
      prisma.expense.count(),
      prisma.expense.findMany({ select: { amount: true, categoryId: true } }),
      prisma.expense.count({ where: { date: { gte: monthStart, lt: monthEnd } } }),
      prisma.expense.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { category: true, user: { select: { id: true, name: true, email: true } } },
      }),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, name: true, email: true, role: true, createdAt: true },
      }),
      prisma.category.findMany(),
    ]);

  const totalExpenseValue = allExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

  const usageByCategory = new Map<string, { categoryId: string; categoryName: string; count: number; total: number }>();
  for (const category of categories) {
    usageByCategory.set(category.id, { categoryId: category.id, categoryName: category.name, count: 0, total: 0 });
  }
  for (const expense of allExpenses) {
    const entry = usageByCategory.get(expense.categoryId);
    if (entry) {
      entry.count += 1;
      entry.total += Number(expense.amount);
    }
  }

  const usageList = Array.from(usageByCategory.values());
  const spendingByCategory = [...usageList].sort((a, b) => b.total - a.total);
  const byUsageCount = [...usageList].sort((a, b) => b.count - a.count);
  const topCategories = byUsageCount.slice(0, 5);
  const bottomCategories = [...byUsageCount].reverse().slice(0, 5);

  return serializeDecimals({
    totalUsers,
    totalExpenses,
    totalExpenseValue,
    expensesThisMonth,
    spendingByCategory,
    topCategories,
    bottomCategories,
    recentExpenses,
    recentUsers,
  });
}
