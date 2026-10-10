import { Typography } from "@mui/material";
import { useEffect } from "react";
import { AdminNavTabs } from "../components/admin/AdminNavTabs";
import { CategoryManagerTable } from "../components/admin/CategoryManagerTable";
import { PageContainer } from "../components/common/PageContainer";
import { useAppDispatch } from "../store/hooks";
import { fetchCategories } from "../store/slices/categoriesSlice";

export function AdminCategoriesPage(): JSX.Element {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <PageContainer>
      <Typography variant="h4" mb={1}>
        Admin Dashboard
      </Typography>
      <AdminNavTabs />
      <CategoryManagerTable />
    </PageContainer>
  );
}
