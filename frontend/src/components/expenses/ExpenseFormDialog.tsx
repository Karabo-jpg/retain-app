import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAppSelector } from "../../store/hooks";
import type { ExpenseFormValues } from "../../types/api";
import { PAYMENT_METHODS, type Expense } from "../../types/models";

const schema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(1000).optional(),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  date: z.string().min(1, "Date is required"),
  paymentMethod: z.enum(["CASH", "CARD", "BANK_TRANSFER", "MOBILE_MONEY", "OTHER"]),
  categoryId: z.string().uuid("Select a category"),
  notes: z.string().max(1000).optional(),
});

interface ExpenseFormDialogProps {
  open: boolean;
  initialValue?: Expense | null;
  onClose: () => void;
  onSubmit: (values: ExpenseFormValues) => Promise<void>;
}

export function ExpenseFormDialog({ open, initialValue, onClose, onSubmit }: ExpenseFormDialogProps): JSX.Element {
  const categories = useAppSelector((state) => state.categories.items);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (open) {
      reset(
        initialValue
          ? {
              title: initialValue.title,
              description: initialValue.description ?? "",
              amount: initialValue.amount,
              date: initialValue.date.slice(0, 10),
              paymentMethod: initialValue.paymentMethod,
              categoryId: initialValue.categoryId,
              notes: initialValue.notes ?? "",
            }
          : {
              title: "",
              description: "",
              amount: 0,
              date: new Date().toISOString().slice(0, 10),
              paymentMethod: "CASH",
              categoryId: categories[0]?.id ?? "",
              notes: "",
            },
      );
    }
  }, [open, initialValue, reset, categories]);

  async function handleFormSubmit(values: ExpenseFormValues): Promise<void> {
    await onSubmit(values);
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialValue ? "Edit Expense" : "Add Expense"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="Title"
              fullWidth
              {...register("title")}
              error={!!errors.title}
              helperText={errors.title?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Description" fullWidth {...register("description")} />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Amount"
              type="number"
              fullWidth
              inputProps={{ step: "0.01" }}
              InputProps={{ startAdornment: <InputAdornment position="start">UGX</InputAdornment> }}
              {...register("amount")}
              error={!!errors.amount}
              helperText={errors.amount?.message}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              {...register("date")}
              error={!!errors.date}
              helperText={errors.date?.message}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              select
              label="Category"
              fullWidth
              defaultValue={initialValue?.categoryId ?? ""}
              {...register("categoryId")}
              error={!!errors.categoryId}
              helperText={errors.categoryId?.message}
            >
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              select
              label="Payment Method"
              fullWidth
              defaultValue={initialValue?.paymentMethod ?? "CASH"}
              {...register("paymentMethod")}
            >
              {PAYMENT_METHODS.map((pm) => (
                <MenuItem key={pm} value={pm}>
                  {pm.replace("_", " ")}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField label="Notes" fullWidth multiline rows={2} {...register("notes")} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" disabled={isSubmitting} onClick={handleSubmit(handleFormSubmit)}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
