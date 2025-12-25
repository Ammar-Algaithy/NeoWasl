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

  // 1. Detect if we are on a "Child" page (Category or Product Details)
  // Assumes your routes are like /products/candy or /products/1
  const isChildPage = location.pathname.includes("/products");

  // 2. Extract the Title from the URL
  // Example: /products/Snacks%20%26%20Cookies -> "Snacks & Cookies"
  const getLastSegment = () => {
      const parts = location.pathname.split('/').filter(Boolean);
      const lastPart = parts[parts.length - 1];
      return decodeURIComponent(lastPart); // Fixes %20 to spaces
  };

  const pageTitle = isChildPage ? getLastSegment() : "NeoWasl";

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: "#fff",
        color: "#0b0f14",
        borderBottom: `1px solid ${theme.palette.divider}`,
        top: 0,
        left: 0,
        right: 0,
        width: "100%",
        zIndex: 1200 // Ensure it stays above content
      }}
    >
      <Toolbar 
        disableGutters 
        sx={{ 
          height: 64, 
          px: { xs: 2, sm: 3 }, 
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* LEFT SECTION */}
        <Box sx={{ minWidth: 80, display: 'flex', justifyContent: 'flex-start' }}>
          {isChildPage ? (
            <IconButton
              onClick={() => navigate(-1)}
              sx={{ 
                color: "#0b0f14",
                p: 1,
                ml: -1 // Align icon visually with page margin
              }}
            >
              <ArrowBackIosNewIcon sx={{ fontSize: 20 }} />
            </IconButton>
          ) : (
            <Button
              onClick={onLogout}
              variant="contained"
              disableElevation
              sx={{
                borderRadius: 2,
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

        {/* CENTER SECTION: Dynamic Title */}
        <Typography
          onClick={() => !isChildPage && navigate("/")} // Only clickable on Home
          noWrap
          sx={{
            fontWeight: 900,
            fontSize: { xs: 18, sm: 22 }, // Slightly smaller for long category names
            cursor: isChildPage ? "default" : "pointer",
            textAlign: "center",
            color: "#0b0f14",
            textTransform: isChildPage ? "capitalize" : "none",
            maxWidth: "60%", // Prevent long titles from hitting icons
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
        >
          {isChildPage ? (
             pageTitle
          ) : (
             <>
               <Box component="span">Neo</Box>
               <Box component="span" sx={{ color: "#ef4444" }}>Wasl</Box>
             </>
          )}
        </Typography>

        {/* RIGHT SECTION: Notifications */}
        <Box sx={{ minWidth: 80, display: "flex", justifyContent: "flex-end" }}>
          <IconButton
            onClick={() => navigate("/notifications")}
            sx={{ color: "#0b0f14", mr: -1 }} // mr-1 aligns icon to edge
          >
            <Badge
              variant="dot"
              color="error"
              sx={{
                "& .MuiBadge-badge": {
                  boxShadow: "0 0 0 2px #fff",
                },
                // Optional: Keeping your ripple effect
                "& .MuiBadge-badge::after": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  border: "2px solid #ef4444",
                  animation: "ripple 1.6s infinite",
                },
                "@keyframes ripple": {
                  "0%": { transform: "scale(1)", opacity: 0.85 },
                  "100%": { transform: "scale(2.6)", opacity: 0 },
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