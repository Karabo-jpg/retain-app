import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

interface DeleteConfirmDialogProps {
  open: boolean;
  title: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmDialog({ open, title, onCancel, onConfirm }: DeleteConfirmDialogProps): JSX.Element {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>Delete expense?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete &quot;{title}&quot;? This cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
