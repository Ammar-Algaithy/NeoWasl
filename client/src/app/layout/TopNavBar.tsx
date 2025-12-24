import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Badge,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
  useTheme
} from "@mui/material";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

type Props = {
  onLogout?: () => void;
};

export default function TopNavBar({ onLogout }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const isProductDetails = location.pathname.includes("/catalog/");

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: "#fff",
        color: "#0b0f14",
        borderBottom: `1px solid ${theme.palette.divider}`,
        // Remove all default positioning offsets
        top: 0,
        left: 0,
        right: 0,
        width: "100%",
      }}
    >
      <Toolbar 
        disableGutters 
        sx={{ 
          height: 64, 
          px: { xs: 2, sm: 3 }, // Horizontal padding only
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left Side: Contextual Button */}
        <Box sx={{ minWidth: 100, display: 'flex', justifyContent: 'flex-start' }}>
          {isProductDetails ? (
            <Button
              onClick={() => navigate(-1)}
              startIcon={<ArrowBackIosNewIcon sx={{ fontSize: "14px !important" }} />}
              sx={{
                color: "#0b0f14",
                fontWeight: 800,
                textTransform: "none",
                "&:hover": { bgcolor: "transparent", color: "#ef4444" },
              }}
            >
              Back
            </Button>
          ) : (
            <Button
              onClick={onLogout}
              variant="contained"
              disableElevation
              sx={{
                borderRadius: 2, // Slightly more retail-standard than 999
                height: 36,
                px: 2,
                fontWeight: 800,
                textTransform: "none",
                bgcolor: "#ef4444",
                "&:hover": { bgcolor: "#dc2626" },
              }}
            >
              Log Out
            </Button>
          )}
        </Box>

        {/* Center: Brand */}
        <Typography
          onClick={() => navigate("/")}
          sx={{
            fontWeight: 900,
            fontSize: { xs: 20, sm: 24 },
            cursor: "pointer",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            gap: 0.5
          }}
        >
          <Box component="span" sx={{ color: "#0b0f14" }}>Neo</Box>
          <Box component="span" sx={{ color: "#ef4444" }}>Wasl</Box>
        </Typography>

        {/* Right Side: Icons */}
        <Box sx={{ minWidth: 100, display: "flex", justifyContent: "flex-end" }}>
          <IconButton
            onClick={() => navigate("/notifications")}
            sx={{ color: "#0b0f14" }}
          >
            <Badge
              variant="dot"
              color="error"
              sx={{
                "& .MuiBadge-badge": {
                  position: "relative",
                  // keep the dot normal (no scaling)
                  transform: "none",
                  // optional: make the dot a bit crisp
                  boxShadow: "0 0 0 2px #fff",
                },

                // the expanding ripple ring
                "& .MuiBadge-badge::after": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  border: "2px solid #ef4444",
                  opacity: 0.9,
                  transform: "scale(1)",
                  animation: "ripple 1.6s infinite",
                  pointerEvents: "none",
                },

                "@keyframes ripple": {
                  "0%": {
                    transform: "scale(1)",
                    opacity: 0.85,
                  },
                  "100%": {
                    transform: "scale(2.6)",
                    opacity: 0,
                  },
                },
              }}
            >
              <NotificationsNoneOutlinedIcon />
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}