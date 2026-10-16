import { Box, Paper, Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import { BudgetForm } from "../components/budget/BudgetForm";
import { BudgetStatusBadge } from "../components/budget/BudgetStatusBadge";
import { PageContainer } from "../components/common/PageContainer";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchBudget, upsertBudgetThunk } from "../store/slices/budgetSlice";
import { fetchDashboard } from "../store/slices/dashboardSlice";
import { formatCurrency } from "../utils/currency";

export function BudgetPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const budget = useAppSelector((state) => state.budget.current);
  const dashboard = useAppSelector((state) => state.dashboard.data);

  useEffect(() => {
    dispatch(fetchBudget({ month, year }));
    dispatch(fetchDashboard({ month, year }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  async function handleSubmit(amount: number): Promise<void> {
    await dispatch(upsertBudgetThunk({ month, year, amount })).unwrap();
    dispatch(fetchDashboard({ month, year }));
  }

  return (
    <PageContainer>
      <Typography variant="h4" mb={2}>
        Monthly Budget
      </Typography>
      <Paper sx={{ p: 3 }}>
        <BudgetForm currentAmount={budget?.amount ?? null} onSubmit={handleSubmit} />
        {dashboard && (
          <Stack direction="row" spacing={3} alignItems="center" mt={3} flexWrap="wrap">
            <Box>
              <Typography variant="body2" color="text.secondary">
                Total Spent
              </Typography>
              <Typography variant="h6">{formatCurrency(dashboard.totalSpent)}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Remaining
              </Typography>
              <Typography variant="h6">
                {dashboard.remainingBudget !== null ? formatCurrency(dashboard.remainingBudget) : "—"}
              </Typography>
            </Box>
            <BudgetStatusBadge status={dashboard.budgetStatus} />
          </Stack>
        )}
      </Paper>
    </PageContainer>
  );
}
