import { Button, Grid, MenuItem, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setFilters, setSort, type ExpenseFilters } from "../../store/slices/expensesSlice";
import { PAYMENT_METHODS } from "../../types/models";

export function ExpenseFilterBar(): JSX.Element {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories.items);
  const filters = useAppSelector((state) => state.expenses.filters);
  const sortBy = useAppSelector((state) => state.expenses.sortBy);
  const sortDir = useAppSelector((state) => state.expenses.sortDir);

  const [searchInput, setSearchInput] = useState(filters.search ?? "");
  const debouncedSearch = useDebouncedValue(searchInput, 400);

  useEffect(() => {
    dispatch(setFilters({ ...filters, search: debouncedSearch || undefined }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  function updateFilter(partial: Partial<ExpenseFilters>): void {
    dispatch(setFilters({ ...filters, ...partial }));
  }

  return (
    <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          label="Search"
          fullWidth
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
        <TextField
          select
          label="Category"
          fullWidth
          value={filters.category ?? ""}
          onChange={(e) => updateFilter({ category: e.target.value || undefined })}
        >
          <MenuItem value="">All</MenuItem>
          {categories.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.name}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
        <TextField
          select
          label="Payment Method"
          fullWidth
          value={filters.paymentMethod ?? ""}
          onChange={(e) => updateFilter({ paymentMethod: (e.target.value || undefined) as never })}
        >
          <MenuItem value="">All</MenuItem>
          {PAYMENT_METHODS.map((pm) => (
            <MenuItem key={pm} value={pm}>
              {pm.replace("_", " ")}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={6} sm={3} md={1.5}>
        <TextField
          label="From"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={filters.dateFrom ?? ""}
          onChange={(e) => updateFilter({ dateFrom: e.target.value || undefined })}
        />
      </Grid>
      <Grid item xs={6} sm={3} md={1.5}>
        <TextField
          label="To"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={filters.dateTo ?? ""}
          onChange={(e) => updateFilter({ dateTo: e.target.value || undefined })}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={1}>
        <TextField
          select
          label="Sort By"
          fullWidth
          value={sortBy}
          onChange={(e) => dispatch(setSort({ sortBy: e.target.value as never, sortDir }))}
        >
          <MenuItem value="date">Date</MenuItem>
          <MenuItem value="amount">Amount</MenuItem>
          <MenuItem value="title">Title</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={12} sm={6} md={1}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => dispatch(setSort({ sortBy, sortDir: sortDir === "asc" ? "desc" : "asc" }))}
        >
          {sortDir === "asc" ? "Asc" : "Desc"}
        </Button>
      </Grid>
    </Grid>
  );
}
