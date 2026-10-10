import { Tabs, Tab } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const TABS = [
  { label: "Insights", path: "/admin" },
  { label: "Categories", path: "/admin/categories" },
];

export function AdminNavTabs(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const activeIndex = TABS.findIndex((t) => t.path === location.pathname);

  return (
    <Tabs value={activeIndex === -1 ? 0 : activeIndex} sx={{ mb: 2 }}>
      {TABS.map((tab) => (
        <Tab key={tab.path} label={tab.label} onClick={() => navigate(tab.path)} />
      ))}
    </Tabs>
  );
}
