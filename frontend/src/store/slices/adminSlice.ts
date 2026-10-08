import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as adminApi from "../../api/adminApi";
import type { AdminInsights } from "../../types/models";

interface AdminState {
  insights: AdminInsights | null;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: AdminState = { insights: null, status: "idle" };

export const fetchAdminInsights = createAsyncThunk("admin/fetchInsights", adminApi.fetchAdminInsights);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminInsights.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAdminInsights.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.insights = action.payload;
      })
      .addCase(fetchAdminInsights.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default adminSlice.reducer;
