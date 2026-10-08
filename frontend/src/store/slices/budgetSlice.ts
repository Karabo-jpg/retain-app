import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as budgetApi from "../../api/budgetApi";
import type { BudgetUpsertRequest } from "../../types/api";
import type { Budget } from "../../types/models";

interface BudgetState {
  current: Budget | null;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: BudgetState = { current: null, status: "idle" };

export const fetchBudget = createAsyncThunk("budget/fetch", ({ month, year }: { month: number; year: number }) =>
  budgetApi.fetchBudget(month, year),
);

export const upsertBudgetThunk = createAsyncThunk("budget/upsert", (payload: BudgetUpsertRequest) =>
  budgetApi.upsertBudget(payload),
);

const budgetSlice = createSlice({
  name: "budget",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudget.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBudget.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.current = action.payload;
      })
      .addCase(fetchBudget.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(upsertBudgetThunk.fulfilled, (state, action) => {
        state.current = action.payload;
      });
  },
});

export default budgetSlice.reducer;
