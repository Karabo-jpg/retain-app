import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, InputAdornment, TextField } from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than 0"),
});
type FormValues = z.infer<typeof schema>;

interface BudgetFormProps {
  currentAmount: number | null;
  onSubmit: (amount: number) => Promise<void>;
}

export function BudgetForm({ currentAmount, onSubmit }: BudgetFormProps): JSX.Element {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    reset({ amount: currentAmount ?? 0 });
  }, [currentAmount, reset]);

  async function onValid(values: FormValues): Promise<void> {
    await onSubmit(values.amount);
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onValid)}
      display="flex"
      gap={2}
      alignItems="flex-start"
      flexWrap="wrap"
    >
      <TextField
        label="Monthly Budget"
        type="number"
        inputProps={{ step: "0.01" }}
        InputProps={{ startAdornment: <InputAdornment position="start">UGX</InputAdornment> }}
        {...register("amount")}
        error={!!errors.amount}
        helperText={errors.amount?.message}
      />
      <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ mt: 1 }}>
        Save Budget
      </Button>
    </Box>
  );
}
