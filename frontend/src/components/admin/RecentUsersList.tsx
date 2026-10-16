import { Chip, List, ListItem, ListItemText, Paper, Typography } from "@mui/material";
import type { User } from "../../types/models";

export function RecentUsersList({ users }: { users: Pick<User, "id" | "name" | "email" | "role" | "createdAt">[] }): JSX.Element {
  return (
    <Paper sx={{ p: 2.5 }}>
      <Typography variant="subtitle1" mb={1}>
        Recently Registered Users
      </Typography>
      <List dense>
        {users.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No users registered yet.
          </Typography>
        )}
        {users.map((user) => (
          <ListItem key={user.id} disableGutters>
            <ListItemText
              primary={user.name}
              secondary={`${user.email} · ${new Date(user.createdAt).toLocaleDateString()}`}
            />
            {user.role === "ADMIN" && <Chip label="Admin" size="small" color="primary" />}
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
