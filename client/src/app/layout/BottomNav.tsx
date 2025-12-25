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

// ✅ cart query hook
import { useGetCartItemsQuery } from "../../features/cart/cartApi";

// --- Configuration ---
const DRAWER_WIDTH = 280;

type PageMode = "grocery" | "smoke" | "electronics" | "accessories";

const LAST_MODE_KEY = "neoWasl:lastBusinessMode";

function safeReadLastMode(): PageMode {
  try {
    const v = localStorage.getItem(LAST_MODE_KEY);
    if (v === "grocery" || v === "smoke" || v === "electronics" || v === "accessories") return v;
  } catch {
    // ignore
  }
  return "grocery";
}

function safeWriteLastMode(mode: PageMode) {
  try {
    localStorage.setItem(LAST_MODE_KEY, mode);
  } catch {
    // ignore
  }
}

// Strictly detect business mode only on business routes
function getBusinessModeFromPath(pathname: string): PageMode | null {
  if (pathname.startsWith("/smoke")) return "smoke";
  if (pathname.startsWith("/electronics")) return "electronics";
  if (pathname.startsWith("/accessories")) return "accessories";

  // Grocery "business" routes
  if (pathname === "/home" || pathname.startsWith("/home/")) return "grocery";

  // If your grocery product/catalog routes live outside /home, add them here.
  // Example:
  // if (pathname.startsWith("/products") || pathname.startsWith("/catalog")) return "grocery";

  return null;
}

function getHomeRouteForMode(mode: PageMode): string {
  switch (mode) {
    case "smoke":
      return "/smoke";
    case "electronics":
      return "/electronics";
    case "accessories":
      return "/accessories";
    case "grocery":
    default:
      return "/home";
  }
}

// --------------------
// ✅ Universal Bottom Nav Theme (fits all business types)
// --------------------
const NAV = {
  // Neutral “premium” ink
  ink: "#0b0f14",
  muted: "rgba(11, 15, 20, 0.55)",
  line: "rgba(11, 15, 20, 0.10)",
  glassBg: "rgba(255, 255, 255, 0.92)",

  // Universal accent (works with pink/red/indigo/orange around the app)
  accent: "#ef4444", // slate/near-black (clean, universal)
  accentSoft: "rgba(17, 24, 39, 0.10)",

  // Badge stays red universally (classic cart badge)
  badgeBg: "#ef4444",
  badgeBorder: "#fff",
} as const;

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
          background: NAV.badgeBg,
          border: `2px solid ${NAV.badgeBorder}`,
          transform: selected ? "scale(1.05)" : "scale(1)",
          transition: "0.2s ease",
        }}
      >
        {display}
      </Box>
    </Box>
  );
}

export default function BottomNav({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // 1) Determine current business mode:
  //    - If we're on a business route => use it and persist it.
  //    - If we're on a shared route (cart/favorites/etc.) => use last persisted mode.
  const businessModeFromPath = React.useMemo(() => getBusinessModeFromPath(pathname), [pathname]);

  const mode = React.useMemo<PageMode>(() => {
    return businessModeFromPath ?? safeReadLastMode();
  }, [businessModeFromPath]);

  React.useEffect(() => {
    if (businessModeFromPath) {
      safeWriteLastMode(businessModeFromPath);
    }
  }, [businessModeFromPath]);

  // ✅ Home route depends on last/active business mode
  const homeRoute = React.useMemo(() => getHomeRouteForMode(mode), [mode]);

  const mainNavItems = React.useMemo(
    () => [
      { label: "Home", value: homeRoute, icon: <HomeOutlinedIcon /> },
      { label: "Favorites", value: "/favorites", icon: <FavoriteBorderOutlinedIcon /> },
      { label: "Cart", value: "/cart", icon: <ShoppingCartOutlinedIcon /> },
    ],
    [homeRoute]
  );

  const bottomNavItems = React.useMemo(
    () => [
      { label: "Settings", value: "/settings", icon: <SettingsOutlinedIcon /> },
      { label: "Account", value: "/account", icon: <PersonOutlineOutlinedIcon /> },
    ],
    []
  );

  // Cart
  const { data: cart } = useGetCartItemsQuery();

  const cartCount = React.useMemo(() => {
    if (!cart?.products?.length) return 0;
    return cart.products.reduce((sum, item) => sum + Number(item.quantity ?? 0), 0);
  }, [cart]);

  const [desktopNavOpen, setDesktopNavOpen] = React.useState(false);

  const currentValue = React.useMemo(() => {
    const allItems = [...mainNavItems, ...bottomNavItems];

    const exact = allItems.find((x) => pathname === x.value);
    if (exact) return exact.value;

    const prefix = allItems.find((x) => pathname.startsWith(x.value + "/"));
    return prefix?.value ?? false;
  }, [pathname, mainNavItems, bottomNavItems]);

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
            bgcolor: selected ? NAV.accentSoft : "transparent",
            border: selected ? `1px solid ${NAV.line}` : "1px solid transparent",
            "&:hover": {
              bgcolor: selected ? NAV.accentSoft : "rgba(255, 0, 47, 0.03)",
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
                bgcolor: selected ? NAV.accent : "transparent",
                color: selected ? "#fff" : "text.secondary",
                transition: "0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                boxShadow: selected ? "0 6px 18px rgba(243, 6, 53, 0.18)" : "none",
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
              color: selected ? NAV.ink : "text.secondary",
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
          <Typography variant="h6" fontWeight={900} letterSpacing={-0.5} color={NAV.ink}>
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
              "&:hover": { bgcolor: "rgba(244, 9, 64, 0.03)" },
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
            borderBottom: `1px solid ${NAV.line}`,
            color: NAV.ink,
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
                bgcolor: desktopNavOpen ? NAV.accentSoft : "rgba(251, 5, 38, 0.04)",
                border: desktopNavOpen ? `1px solid ${NAV.line}` : "1px solid transparent",
                "&:hover": {
                  bgcolor: desktopNavOpen ? NAV.accentSoft : "rgba(252, 1, 60, 0.07)",
                },
              }}
            >
              <MenuIcon />
            </IconButton>

            <Typography fontWeight={900} letterSpacing={-0.3} color={NAV.ink}>
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
              borderRight: `1px solid ${NAV.line}`,
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
            pb: "env(safe-area-inset-bottom)",
            bgcolor: NAV.glassBg,
            backdropFilter: "blur(20px) saturate(180%)",
            borderTop: `1px solid ${NAV.line}`,
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
                        transform: selected ? "scale(1.08) translateY(-2px)" : "none",
                        transition: "0.28s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 0,
                          borderRadius: "12px",
                          bgcolor: selected ? NAV.accent : "transparent",
                          opacity: selected ? 1 : 0,
                          transition: "0.25s ease",
                          boxShadow: selected ? "0 6px 18px rgba(245, 7, 86, 0.18)" : "none",
                        }}
                      />
                      <Box sx={{ zIndex: 1, display: "flex", color: selected ? "#fff" : NAV.muted }}>
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
                      color: selected ? NAV.ink : NAV.muted,
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
