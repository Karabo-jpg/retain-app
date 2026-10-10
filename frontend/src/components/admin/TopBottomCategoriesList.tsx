import { Grid, List, ListItem, ListItemText, Paper, Typography } from "@mui/material";
import type { CategoryUsage } from "../../types/models";

function CategoryUsageList({ title, items }: { title: string; items: CategoryUsage[] }): JSX.Element {
  return (
    <Paper sx={{ p: 2.5, height: "100%" }}>
      <Typography variant="subtitle1" mb={1}>
        {title}
      </Typography>
      <List dense>
        {items.map((item) => (
          <ListItem key={item.categoryId} disableGutters>
            <ListItemText primary={item.categoryName} secondary={`${item.count} expense(s)`} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export function TopBottomCategoriesList({
  top,
  bottom,
}: {
  top: CategoryUsage[];
  bottom: CategoryUsage[];
}): JSX.Element {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <CategoryUsageList title="Top 5 Most-Used Categories" items={top} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CategoryUsageList title="Bottom 5 Least-Used Categories" items={bottom} />
      </Grid>
    </Grid>
  );
}
