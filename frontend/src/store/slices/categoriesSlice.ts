import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as categoryApi from "../../api/categoryApi";
import type { Category } from "../../types/models";

interface CategoriesState {
  items: Category[];
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: CategoriesState = { items: [], status: "idle" };

export const fetchCategories = createAsyncThunk("categories/fetchAll", categoryApi.fetchCategories);

export const createCategoryThunk = createAsyncThunk("categories/create", categoryApi.createCategory);

export const updateCategoryThunk = createAsyncThunk(
  "categories/update",
  ({ id, name }: { id: string; name: string }) => categoryApi.updateCategory(id, name),
);

export const deleteCategoryThunk = createAsyncThunk("categories/delete", async (id: string) => {
  await categoryApi.deleteCategory(id);
  return id;
});

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(createCategoryThunk.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateCategoryThunk.fulfilled, (state, action) => {
        const index = state.items.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteCategoryThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.id !== action.payload);
      });
  },
});

export default categoriesSlice.reducer;
