import { Paper, Typography, Box, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ExploreOffIcon from "@mui/icons-material/ExploreOff";
import HomeIcon from "@mui/icons-material/Home";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f4f6f8", // Slightly different background to signal "off-path"
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, sm: 8 },
            borderRadius: { xs: 4, sm: 8 },
            textAlign: "center",
            boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
            border: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          {/* Large Stylized Number or Icon */}
          <Box sx={{ position: "relative", mb: 2 }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "6rem", sm: "8rem" },
                fontWeight: 900,
                color: "rgba(0,0,0,0.03)", // Ghost "404" in background
                lineHeight: 1,
              }}
            >
              404
            </Typography>
            <ExploreOffIcon
              sx={{
                fontSize: { xs: 60, sm: 80 },
                color: "error.main",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          </Box>

          <Typography
            variant="h4"
            sx={{ fontWeight: 800, mb: 1, color: "text.primary" }}
          >
            Page not found
          </Typography>

          <Typography
            variant="body1"
            sx={{ color: "text.secondary", mb: 4, px: { sm: 4 } }}
          >
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </Typography>

          <Button
            variant="contained"
            size="large"
            startIcon={<HomeIcon />}
            onClick={() => navigate("/home")}
            sx={{
              bgcolor: "error.main",
              fontWeight: 700,
              px: 4,
              py: 1.5,
              borderRadius: 3,
              textTransform: "none",
              fontSize: "1rem",
              boxShadow: "0 8px 16px rgba(211, 47, 47, 0.24)",
              "&:hover": {
                bgcolor: "error.dark",
                boxShadow: "none",
              },
            }}
          >
            Go to Homepage
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}