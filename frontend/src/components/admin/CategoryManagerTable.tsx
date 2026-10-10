import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
} from "@mui/material";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  createCategoryThunk,
  deleteCategoryThunk,
  updateCategoryThunk,
} from "../../store/slices/categoriesSlice";
import type { Category } from "../../types/models";

export function CategoryManagerTable(): JSX.Element {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories.items);

  const [newName, setNewName] = useState("");
  const [editing, setEditing] = useState<Category | null>(null);
  const [editName, setEditName] = useState("");
  const [deleting, setDeleting] = useState<Category | null>(null);

  async function handleCreate(): Promise<void> {
    if (!newName.trim()) return;
    await dispatch(createCategoryThunk(newName.trim()));
    setNewName("");
  }

  async function handleUpdate(): Promise<void> {
    if (!editing || !editName.trim()) return;
    await dispatch(updateCategoryThunk({ id: editing.id, name: editName.trim() }));
    setEditing(null);
  }

  async function handleDelete(): Promise<void> {
    if (!deleting) return;
    await dispatch(deleteCategoryThunk(deleting.id));
    setDeleting(null);
  }

  return (
    <Paper sx={{ p: 2.5, overflowX: "auto" }}>
      <Box display="flex" gap={2} mb={2} flexWrap="wrap">
        <TextField
          label="New category name"
          size="small"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <Button variant="contained" onClick={handleCreate}>
          Add Category
        </Button>
      </Box>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>
                  {category.isDefault && <Chip label="Default (protected)" size="small" />}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    disabled={category.isDefault}
                    onClick={() => {
                      setEditing(category);
                      setEditName(category.name);
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" disabled={category.isDefault} onClick={() => setDeleting(category)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={!!editing} onClose={() => setEditing(null)}>
        <DialogTitle>Rename Category</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            sx={{ mt: 1 }}
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditing(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdate}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleting} onClose={() => setDeleting(null)}>
        <DialogTitle>Delete category?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Expenses in &quot;{deleting?.name}&quot; will be moved to the Uncategorized category. This cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleting(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
