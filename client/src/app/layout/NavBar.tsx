import { AppBar, Box, Toolbar, Typography } from "@mui/material";

export default function NavBar() {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        color: "#0b0f14",
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 56, sm: 64 },
          px: { xs: 1.5, sm: 3 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Center Brand */}
        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              letterSpacing: 0.6,
              lineHeight: 1,
              color: "#ef4444", // NeoWasl red
            }}
          >
            NeoWasl
          </Typography>

          {/* Optional subtle tagline (mobile-friendly) */}
          <Typography
            variant="caption"
            sx={{
              display: "block",
              color: "text.secondary",
              letterSpacing: 0.3,
            }}
          >
            Wholesale made simple
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
