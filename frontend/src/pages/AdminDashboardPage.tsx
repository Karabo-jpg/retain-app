import { Grid, Typography } from "@mui/material";
import { useEffect } from "react";
import { AdminNavTabs } from "../components/admin/AdminNavTabs";
import { PlatformStatsCards } from "../components/admin/PlatformStatsCards";
import { RecentUsersList } from "../components/admin/RecentUsersList";
import { TopBottomCategoriesList } from "../components/admin/TopBottomCategoriesList";
import { ErrorAlert } from "../components/common/ErrorAlert";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { PageContainer } from "../components/common/PageContainer";
import { CategoryBreakdownChart } from "../components/dashboard/CategoryBreakdownChart";
import { RecentExpensesList } from "../components/dashboard/RecentExpensesList";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchAdminInsights } from "../store/slices/adminSlice";
import type { AdminInsights } from "../types/models";

export function AdminDashboardPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const { insights, status } = useAppSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminInsights());
  }, [dispatch]);

  return (
    <PageContainer>
      <Typography variant="h4" mb={1}>
        Admin Dashboard
      </Typography>
      <AdminNavTabs />
      {status === "loading" || !insights ? (
        <LoadingSpinner />
      ) : status === "failed" ? (
        <ErrorAlert message="Failed to load admin insights" />
      ) : (
        <AdminInsightsContent insights={insights} />
      )}
    </PageContainer>
  );
}

function AdminInsightsContent({ insights }: { insights: AdminInsights }): JSX.Element {
  return (
    <>
      <PlatformStatsCards insights={insights} />
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={7}>
          <CategoryBreakdownChart data={insights.spendingByCategory} />
        </Grid>
        <Grid item xs={12} md={5}>
          <RecentExpensesList expenses={insights.recentExpenses} />
        </Grid>
      </Grid>
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12}>
          <RecentUsersList users={insights.recentUsers} />
        </Grid>
      </Grid>
      <TopBottomCategoriesList top={insights.topCategories} bottom={insights.bottomCategories} />
    </>
  );
}
