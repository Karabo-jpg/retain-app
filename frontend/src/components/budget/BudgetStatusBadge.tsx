import { Chip } from "@mui/material";
import type { BudgetStatus } from "../../types/models";

const STATUS_CONFIG: Record<BudgetStatus, { label: string; color: "default" | "success" | "warning" | "error" }> = {
  no_budget: { label: "No budget set", color: "default" },
  within: { label: "Within budget", color: "success" },
  approaching: { label: "Approaching budget", color: "warning" },
  over: { label: "Over budget", color: "error" },
};

export function BudgetStatusBadge({ status }: { status: BudgetStatus }): JSX.Element {
  const config = STATUS_CONFIG[status];
  return <Chip label={config.label} color={config.color} />;
}
