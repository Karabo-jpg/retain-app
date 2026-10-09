import { Paper, Typography } from "@mui/material";

interface SummaryCardProps {
  label: string;
  value: string;
}

export function SummaryCard({ label, value }: SummaryCardProps): JSX.Element {
  return (
    <Paper sx={{ p: 2.5, height: "100%" }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h5" mt={0.5}>
        {value}
      </Typography>
    </Paper>
  );
}
