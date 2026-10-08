import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setPage, setPageSize } from "../../store/slices/expensesSlice";
import type { Expense } from "../../types/models";

interface ExpenseTableProps {
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

export function ExpenseTable({ onEdit, onDelete }: ExpenseTableProps): JSX.Element {
  const dispatch = useAppDispatch();
  const { items, total, page, pageSize } = useAppSelector((state) => state.expenses);

  return (
    <Paper sx={{ overflowX: "auto" }}>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{expense.title}</TableCell>
                <TableCell>{expense.category.name}</TableCell>
                <TableCell>{expense.paymentMethod.replace("_", " ")}</TableCell>
                <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                <TableCell align="right">${expense.amount.toFixed(2)}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => onEdit(expense)} aria-label="edit">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => onDelete(expense)} aria-label="delete">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={total}
        page={page - 1}
        onPageChange={(_e, newPage) => dispatch(setPage(newPage + 1))}
        rowsPerPage={pageSize}
        onRowsPerPageChange={(e) => dispatch(setPageSize(Number(e.target.value)))}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </Paper>
  );
}
