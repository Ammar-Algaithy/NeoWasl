import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  IconButton,
  AppBar,
} from "@mui/material";

// Icons
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

// ✅ import your cart query hook
import { useGetCartItemsQuery } from "../../features/cart/cartApi";

// --- Configuration ---
const DRAWER_WIDTH = 280;

const mainNavItems = [
  { label: "Home", value: "/home", icon: <HomeOutlinedIcon /> },
  { label: "Favorites", value: "/favorites", icon: <FavoriteBorderOutlinedIcon /> },
  { label: "Cart", value: "/cart", icon: <ShoppingCartOutlinedIcon /> },
];

const bottomNavItems = [
  { label: "Settings", value: "/settings", icon: <SettingsOutlinedIcon /> },
  { label: "Account", value: "/account", icon: <PersonOutlineOutlinedIcon /> },
];

// --- Sub-Component: Cart Badge ---
function CartIconWithBadge({ count, selected }: { count: number; selected: boolean }) {
  if (count <= 0) return <ShoppingCartOutlinedIcon />;
  const display = count > 9 ? "9+" : count;

  return (
    <Box sx={{ position: "relative", display: "flex" }}>
      <ShoppingCartOutlinedIcon />
      <Box
        sx={{
          position: "absolute",
          top: -8,
          right: -10,
          minWidth: 18,
          height: 18,
          px: 0.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 5,
          fontSize: 10,
          fontWeight: 800,
          color: "#fff",
          background: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)",
          border: "2px solid #fff",
          boxShadow: "0 2px 8px rgba(239,68,68,0.3)",
          transform: selected ? "scale(1.05)" : "scale(1)",
          transition: "0.2s ease",
        }}
      >
        {display}
      </Box>
    </Box>
  );
}

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // ✅ Get cart from RTK Query cache
  // IMPORTANT: If your backend returns 204/NoContent sometimes, your baseQuery should map it to a valid empty cart object,
  // or you can safely handle undefined here (we do).
  const { data: cart } = useGetCartItemsQuery();

  // ✅ cartCount = sum of quantities
  const cartCount = React.useMemo(() => {
    if (!cart?.products?.length) return 0;
    return cart.products.reduce((sum, item) => sum + Number(item.quantity ?? 0), 0);
  }, [cart]);

  // Desktop drawer open state (PC only)
  const [desktopNavOpen, setDesktopNavOpen] = React.useState(false);

  const currentValue = React.useMemo(() => {
    const allItems = [...mainNavItems, ...bottomNavItems];
    const hit = allItems.find(
      (x) => pathname === x.value || pathname.startsWith(x.value + "/")
    );
    return hit?.value ?? false;
  }, [pathname]);

  React.useEffect(() => {
    setDesktopNavOpen(false);
  }, [pathname]);

  const renderNavListItem = (item: (typeof mainNavItems)[0]) => {
    const selected = currentValue === item.value;

    return (
      <ListItem key={item.value} disablePadding sx={{ mb: 1 }}>
        <ListItemButton
          onClick={() => navigate(item.value)}
          sx={{
            borderRadius: 4,
            py: 1.2,
            px: 2,
            transition: "0.2s ease",
            bgcolor: selected ? "rgba(239, 68, 68, 0.10)" : "transparent",
            border: selected
              ? "1px solid rgba(239, 68, 68, 0.18)"
              : "1px solid transparent",
            "&:hover": {
              bgcolor: selected ? "rgba(239, 68, 68, 0.14)" : "rgba(0,0,0,0.03)",
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 50 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                display: "grid",
                placeItems: "center",
                borderRadius: "12px",
                bgcolor: selected ? "error.main" : "transparent",
                color: selected ? "#fff" : "text.secondary",
                transition: "0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                boxShadow: selected ? "0 4px 12px rgba(239,68,68,0.25)" : "none",
              }}
            >
              {item.value === "/cart" ? (
                <CartIconWithBadge count={cartCount} selected={selected} />
              ) : (
                item.icon
              )}
            </Box>
          </ListItemIcon>

          <ListItemText
            primary={item.label}
            primaryTypographyProps={{
              fontWeight: selected ? 800 : 600,
              fontSize: "0.95rem",
              color: selected ? "text.primary" : "text.secondary",
            }}
          />
        </ListItemButton>
      </ListItem>
    );
  };

  const desktopDrawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Toolbar
        sx={{
          my: 2.5,
          px: 2.5,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box component="img" src="/logo.svg" sx={{ width: 32, mr: 1.5 }} />
          <Typography
            variant="h6"
            fontWeight={900}
            letterSpacing={-0.5}
            color="text.primary"
          >
            STORE
          </Typography>
        </Box>

        <IconButton onClick={() => setDesktopNavOpen(false)} aria-label="Close navigation">
          <CloseIcon />
        </IconButton>
      </Toolbar>

      <List sx={{ px: 2 }}>{mainNavItems.map(renderNavListItem)}</List>

      <Box sx={{ flexGrow: 1 }} />

      <List sx={{ px: 2, pb: 2 }}>
        {bottomNavItems.map(renderNavListItem)}

        <ListItem disablePadding>
          <ListItemButton
            sx={{
              borderRadius: 4,
              py: 1.2,
              px: 2,
              "&:hover": { bgcolor: "rgba(239, 68, 68, 0.04)" },
            }}
          >
            <ListItemIcon sx={{ minWidth: 50 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  display: "grid",
                  placeItems: "center",
                  color: "text.secondary",
                }}
              >
                <LogoutOutlinedIcon />
              </Box>
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{ fontWeight: 600, color: "text.secondary" }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F9FAFB" }}>
      {!isMobile && (
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            bgcolor: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(14px) saturate(180%)",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            color: "text.primary",
            zIndex: 1400,
          }}
        >
          <Toolbar sx={{ px: { xs: 2, md: 3 } }}>
            <IconButton
              edge="start"
              onClick={() => setDesktopNavOpen(true)}
              aria-label="Open navigation"
              sx={{
                mr: 1.5,
                borderRadius: 2,
                bgcolor: desktopNavOpen ? "rgba(239, 68, 68, 0.10)" : "rgba(0,0,0,0.04)",
                border: desktopNavOpen
                  ? "1px solid rgba(239, 68, 68, 0.18)"
                  : "1px solid transparent",
                "&:hover": {
                  bgcolor: desktopNavOpen ? "rgba(239, 68, 68, 0.14)" : "rgba(0,0,0,0.07)",
                },
              }}
            >
              <MenuIcon />
            </IconButton>

            <Typography fontWeight={900} letterSpacing={-0.3}>
              STORE
            </Typography>

            <Box sx={{ flexGrow: 1 }} />
          </Toolbar>
        </AppBar>
      )}

      {!isMobile && (
        <Drawer
          open={desktopNavOpen}
          onClose={() => setDesktopNavOpen(false)}
          variant="temporary"
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
              borderRight: "1px solid rgba(0,0,0,0.06)",
              bgcolor: "#FFFFFF",
            },
          }}
        >
          {desktopDrawer}
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: "100%",
          p: { xs: 2, sm: 3, md: 5 },
          pb: isMobile ? "100px" : 5,
          pt: !isMobile ? { xs: 10, md: 12 } : undefined,
        }}
      >
        {children}
      </Box>

      {isMobile && (
        <Paper
          elevation={0}
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1300,
            bgcolor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(20px) saturate(180%)",
            borderTop: "1px solid rgba(0,0,0,0.05)",
            pb: "env(safe-area-inset-bottom)",
          }}
        >
          <BottomNavigation
            showLabels
            value={currentValue || false}
            onChange={(_, newValue) => navigate(newValue)}
            sx={{ height: 70, bgcolor: "transparent" }}
          >
            {[...mainNavItems, bottomNavItems[1]].map((item) => {
              const selected = currentValue === item.value;

              return (
                <BottomNavigationAction
                  key={item.value}
                  value={item.value}
                  label={item.label}
                  icon={
                    <Box
                      sx={{
                        position: "relative",
                        width: 42,
                        height: 42,
                        display: "grid",
                        placeItems: "center",
                        transform: selected ? "scale(1.1) translateY(-2px)" : "none",
                        transition: "0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 0,
                          borderRadius: "12px",
                          bgcolor: selected ? "error.main" : "transparent",
                          opacity: selected ? 1 : 0,
                          transition: "0.3s",
                          boxShadow: selected ? "0 4px 12px rgba(239,68,68,0.25)" : "none",
                        }}
                      />
                      <Box
                        sx={{
                          zIndex: 1,
                          display: "flex",
                          color: selected ? "#fff" : "text.secondary",
                        }}
                      >
                        {item.value === "/cart" ? (
                          <CartIconWithBadge count={cartCount} selected={selected} />
                        ) : (
                          item.icon
                        )}
                      </Box>
                    </Box>
                  }
                  sx={{
                    "& .MuiBottomNavigationAction-label": {
                      fontSize: 10,
                      fontWeight: 700,
                      mt: 0.5,
                      color: selected ? "error.main" : "text.secondary",
                    },
                  }}
                />
              );
            })}
          </BottomNavigation>
        </Paper>
      )}
    </Box>
  );
}
