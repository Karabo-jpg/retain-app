import { List, ListItem, ListItemText, Paper, Typography } from "@mui/material";
import type { Expense } from "../../types/models";
import { formatCurrency } from "../../utils/currency";

export function RecentExpensesList({ expenses }: { expenses: Expense[] }): JSX.Element {
  return (
    <Paper sx={{ p: 2.5 }}>
      <Typography variant="subtitle1" mb={1}>
        Recent Expenses
      </Typography>
      <List dense>
        {expenses.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No expenses recorded yet.
          </Typography>
        )}
        {expenses.map((expense) => (
          <ListItem key={expense.id} disableGutters>
            <ListItemText
              primary={expense.title}
              secondary={`${expense.category.name} · ${new Date(expense.date).toLocaleDateString()}`}
            />
            <Typography variant="body2">{formatCurrency(expense.amount)}</Typography>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
