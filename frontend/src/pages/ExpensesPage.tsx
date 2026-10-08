import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { ErrorAlert } from "../components/common/ErrorAlert";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { PageContainer } from "../components/common/PageContainer";
import { DeleteConfirmDialog } from "../components/expenses/DeleteConfirmDialog";
import { ExpenseFilterBar } from "../components/expenses/ExpenseFilterBar";
import { ExpenseFormDialog } from "../components/expenses/ExpenseFormDialog";
import { ExpenseTable } from "../components/expenses/ExpenseTable";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchCategories } from "../store/slices/categoriesSlice";
import {
  createExpenseThunk,
  deleteExpenseThunk,
  fetchExpenses,
  updateExpenseThunk,
} from "../store/slices/expensesSlice";
import type { ExpenseFormValues } from "../types/api";
import type { Expense } from "../types/models";

export function ExpensesPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const { status, error, filters, sortBy, sortDir, page, pageSize } = useAppSelector((state) => state.expenses);

  const [formOpen, setFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch, filters, sortBy, sortDir, page, pageSize]);

  function handleAdd(): void {
    setEditingExpense(null);
    setFormOpen(true);
  }

  function handleEdit(expense: Expense): void {
    setEditingExpense(expense);
    setFormOpen(true);
  }

  async function handleSubmit(values: ExpenseFormValues): Promise<void> {
    if (editingExpense) {
      await dispatch(updateExpenseThunk({ id: editingExpense.id, payload: values })).unwrap();
    } else {
      await dispatch(createExpenseThunk(values)).unwrap();
    }
  }

  async function handleConfirmDelete(): Promise<void> {
    if (deletingExpense) {
      await dispatch(deleteExpenseThunk(deletingExpense.id));
      setDeletingExpense(null);
    }
  }

  return (
    <PageContainer>
      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} mb={2}>
        <Typography variant="h4">Expenses</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
          Add Expense
        </Button>
      </Box>
      <ExpenseFilterBar />
      {status === "loading" && <LoadingSpinner />}
      {status === "failed" && error && <ErrorAlert message={error} />}
      {status !== "loading" && <ExpenseTable onEdit={handleEdit} onDelete={setDeletingExpense} />}
      <ExpenseFormDialog
        open={formOpen}
        initialValue={editingExpense}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />
      <DeleteConfirmDialog
        open={!!deletingExpense}
        title={deletingExpense?.title ?? ""}
        onCancel={() => setDeletingExpense(null)}
        onConfirm={handleConfirmDelete}
      />
    </PageContainer>
  );
}
