import { Grid, Typography } from "@mui/material";
import { useEffect } from "react";
import { ErrorAlert } from "../components/common/ErrorAlert";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { PageContainer } from "../components/common/PageContainer";
import { CategoryBreakdownChart } from "../components/dashboard/CategoryBreakdownChart";
import { RecentExpensesList } from "../components/dashboard/RecentExpensesList";
import { SummaryCard } from "../components/dashboard/SummaryCard";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchDashboard } from "../store/slices/dashboardSlice";
import { formatCurrency } from "../utils/currency";

export function DashboardPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const { data, status } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    const now = new Date();
    dispatch(fetchDashboard({ month: now.getMonth() + 1, year: now.getFullYear() }));
  }, [dispatch]);

  if (status === "loading" || !data) return <LoadingSpinner />;
  if (status === "failed") return <ErrorAlert message="Failed to load dashboard" />;

  return (
    <PageContainer>
      <Typography variant="h4" mb={3}>
        Dashboard
      </Typography>
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard label="Total Spent" value={formatCurrency(data.totalSpent)} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            label="Remaining Budget"
            value={data.remainingBudget !== null ? formatCurrency(data.remainingBudget) : "No budget set"}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            label="Highest Expense"
            value={data.highestExpense ? formatCurrency(data.highestExpense.amount) : "—"}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard label="Categories Used" value={String(data.spendingByCategory.length)} />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <CategoryBreakdownChart data={data.spendingByCategory} />
        </Grid>
        <Grid item xs={12} md={5}>
          <RecentExpensesList expenses={data.recentExpenses} />
        </Grid>
      </Grid>
    </PageContainer>
  );
}
