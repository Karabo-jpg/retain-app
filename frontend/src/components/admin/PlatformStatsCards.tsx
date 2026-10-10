import { Grid } from "@mui/material";
import { SummaryCard } from "../dashboard/SummaryCard";
import type { AdminInsights } from "../../types/models";

export function PlatformStatsCards({ insights }: { insights: AdminInsights }): JSX.Element {
  const cards = [
    { label: "Total Users", value: String(insights.totalUsers) },
    { label: "Total Expenses", value: String(insights.totalExpenses) },
    { label: "Total Expense Value", value: `$${insights.totalExpenseValue.toFixed(2)}` },
    { label: "Expenses This Month", value: String(insights.expensesThisMonth) },
  ];

  return (
    <Grid container spacing={2} mb={3}>
      {cards.map((card) => (
        <Grid item xs={12} sm={6} md={3} key={card.label}>
          <SummaryCard label={card.label} value={card.value} />
        </Grid>
      ))}
    </Grid>
  );
}
