import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as dashboardApi from "../../api/dashboardApi";
import type { UserDashboard } from "../../types/models";

interface DashboardState {
  data: UserDashboard | null;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: DashboardState = { data: null, status: "idle" };

export const fetchDashboard = createAsyncThunk(
  "dashboard/fetch",
  ({ month, year }: { month: number; year: number }) => dashboardApi.fetchDashboard(month, year),
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchDashboard.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default dashboardSlice.reducer;
