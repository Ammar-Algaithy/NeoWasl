import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Badge,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
  useTheme,
  CircularProgress
} from "@mui/material";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useLogoutMutation } from "../../features/account/accountApi";

export default function TopNavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const [logoutUser, { isLoading: isLoggingOut }] = useLogoutMutation();

  // 1. Improved Child Detection
  // Checks if we are deep in a structure, e.g., /products/1 or /account/settings
  // You can add more main routes to the exclusion list if needed.
  const isChildPage = location.pathname !== "/" && location.pathname !== "/home";

  // 2. Fix: Split by "/" instead of "/home"
  const getPageTitle = () => {
    // splits "/products/Snacks%20" -> ["products", "Snacks%20"]
    const parts = location.pathname.split('/').filter(Boolean);
    
    if (parts.length === 0) return "NeoWasl";

    const lastPart = parts[parts.length - 1];
    
    // Check if the last part is a number (like an ID: /products/24)
    if (!isNaN(Number(lastPart))) {
       return "Product Details"; // Fallback for IDs
    }

    // Decode and replace hyphens/underscores with spaces
    return decodeURIComponent(lastPart).replace(/[-_]/g, " ");
  };

  const pageTitle = getPageTitle();

  const handleLogout = async () => {
    try {
      // Attempt to tell server to clear cookies
      await logoutUser().unwrap();
    } catch (error) {
      // If 401 happens here, it usually means the session was already expired.
      console.warn("Logout API failed (likely session expired):", error);
    } finally {
      // ✅ CRITICAL: This runs whether the API succeeded OR failed.
      // We always want to send the user to the sign-in screen.
      navigate("/sign-in"); 
    }
  };

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
        zIndex: 1200
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
                ml: -1 
              }}
            >
              <ArrowBackIosNewIcon sx={{ fontSize: 20 }} />
            </IconButton>
          ) : (
            <Button
              onClick={handleLogout}
              disabled={isLoggingOut} // Disable while loading
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
                "&.Mui-disabled": { bgcolor: "#fca5a5", color: "white" }
              }}
            >
              {isLoggingOut ? <CircularProgress size={20} color="inherit" /> : "Log Out"}
            </Button>
          )}
        </Box>

        {/* CENTER SECTION */}
        <Typography
          onClick={() => !isChildPage && navigate("/")}
          noWrap
          sx={{
            fontWeight: 900,
            fontSize: { xs: 18, sm: 22 },
            cursor: isChildPage ? "default" : "pointer",
            textAlign: "center",
            color: "#0b0f14",
            textTransform: isChildPage ? "capitalize" : "none",
            maxWidth: "60%",
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

        {/* RIGHT SECTION */}
        <Box sx={{ minWidth: 80, display: "flex", justifyContent: "flex-end" }}>
          <IconButton
            onClick={() => navigate("/notifications")}
            sx={{ color: "#0b0f14", mr: -1 }}
          >
            <Badge
              variant="dot"
              color="error"
              sx={{
                "& .MuiBadge-badge": { boxShadow: "0 0 0 2px #fff" },
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