import { Box, CircularProgress } from "@mui/material";

export function LoadingSpinner(): JSX.Element {
  return (
    <Box display="flex" justifyContent="center" py={4}>
      <CircularProgress />
    </Box>
  );
}
