import { Paper, Typography } from "@mui/material";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { CategorySpending } from "../../types/models";

export function CategoryBreakdownChart({ data }: { data: CategorySpending[] }): JSX.Element {
  return (
    <Paper sx={{ p: 2.5 }}>
      <Typography variant="subtitle1" mb={1}>
        Spending by Category
      </Typography>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="categoryName" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
          <Bar dataKey="total" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}
