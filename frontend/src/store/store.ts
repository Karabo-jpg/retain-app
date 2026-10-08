import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "./slices/adminSlice";
import budgetReducer from "./slices/budgetSlice";
import categoriesReducer from "./slices/categoriesSlice";
import dashboardReducer from "./slices/dashboardSlice";
import expensesReducer from "./slices/expensesSlice";

export const store = configureStore({
  reducer: {
    expenses: expensesReducer,
    categories: categoriesReducer,
    budget: budgetReducer,
    dashboard: dashboardReducer,
    admin: adminReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
