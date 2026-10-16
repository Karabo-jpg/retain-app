export function formatCurrency(amount: number): string {
  return `UGX ${amount.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}
