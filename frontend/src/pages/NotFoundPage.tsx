import { Box, Button, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export function NotFoundPage(): JSX.Element {
  return (
    <Box textAlign="center" mt={10}>
      <Typography variant="h3">404</Typography>
      <Typography variant="body1" mb={2}>
        Page not found.
      </Typography>
      <Button component={RouterLink} to="/dashboard" variant="contained">
        Back to Dashboard
      </Button>
    </Box>
  );
}
