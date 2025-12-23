import { Divider, Paper, Typography, Box, Button, Container, Stack } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function ServerError() {
  const { state } = useLocation();
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          height: "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          pt: 2,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            bgcolor: "#fff5f5", // Subtle red tint
            border: "1px solid #fee2e2",
            width: "100%",
          }}
        >
          <ErrorOutlineIcon sx={{ fontSize: 64, color: "#ef4444", mb: 2 }} />

          <Typography
            variant="h5"
            sx={{ fontWeight: 800, color: "#111827", mb: 1 }}
          >
            {state?.error?.title || "Server Error"}
          </Typography>

          <Divider sx={{ my: 2, opacity: 0.5 }} />

          <Typography
            variant="body1"
            sx={{
              color: "#6b7280",
              mb: 4,
              lineHeight: 1.6,
              wordBreak: "break-word",
            }}
          >
            {state?.error?.detail ||
              "Something went wrong on our end. Please try again later."}
          </Typography>

          <Stack spacing={2}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => window.location.reload()}
              sx={{
                bgcolor: "#ef4444",
                fontWeight: 700,
                py: 1.5,
                borderRadius: 3,
                "&:hover": { bgcolor: "#dc2626" },
              }}
            >
              Try Again
            </Button>
            
            <Button
              variant="text"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/home")}
              sx={{ color: "#374151", fontWeight: 700 }}
            >
              Back to Home
            </Button>
          </Stack>
        </Paper>

        {/* Technical Footer (Optional) */}
        <Typography variant="caption" sx={{ mt: 4, color: "#9ca3af" }}>
          Error Code: 500 Internal Server Error
        </Typography>
      </Box>
    </Container>
  );
}