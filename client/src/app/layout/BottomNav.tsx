import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Box,
} from "@mui/material";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

type NavItem = {
  label: string;
  value: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  { label: "Home", value: "/", icon: <HomeOutlinedIcon /> },
  { label: "Favorites", value: "/favorites", icon: <FavoriteBorderOutlinedIcon /> },
  { label: "Cart", value: "/cart", icon: <ShoppingCartOutlinedIcon /> },
  { label: "Account", value: "/account", icon: <PersonOutlineOutlinedIcon /> },
];

function CartIconWithBadge({
  count,
  selected,
}: {
  count: number;
  selected: boolean;
}) {
  if (count <= 0) return <ShoppingCartOutlinedIcon />;
  const display = count > 9 ? "9+" : count;

  return (
    <Box sx={{ position: "relative", display: "flex" }}>
      <ShoppingCartOutlinedIcon />
      <Box
        sx={{
          position: "absolute",
          top: -5,
          right: -8,
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
          // Retail red gradient
          background: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)",
          border: "2px solid",
          // The border matches the icon blob color when selected, or background when not
          borderColor: selected ? "#ef4444" : "#fff",
          boxShadow: "0 2px 8px rgba(239,68,68,0.3)",
          transition: "all 0.2s ease",
        }}
      >
        {display}
      </Box>
    </Box>
  );
}

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  // Hard-coded for demo
  const cartCount: number = 3;

  const currentValue = React.useMemo(() => {
    const hit = navItems.find((x) => x.value === location.pathname);
    return hit?.value ?? "/";
  }, [location.pathname]);

  return (
    <Paper
      elevation={0}
      sx={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0, // Reset bottom to 0 for safe area handling
        zIndex: 1300,
        // Glassmorphism effect
        bgcolor: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(12px) saturate(180%)",
        WebkitBackdropFilter: "blur(12px) saturate(180%)",
        borderTop: "1px solid",
        borderColor: "divider",
        // Responsive Padding for notched phones
        pb: "calc(env(safe-area-inset-bottom) + 8px)",
        pt: 1,
      }}
    >
      <BottomNavigation
        showLabels
        value={currentValue}
        onChange={(_, newValue) => navigate(newValue)}
        sx={{
          height: 60,
          bgcolor: "transparent",
        }}
      >
        {navItems.map((item) => {
          const selected = currentValue === item.value;

          return (
            <BottomNavigationAction
              key={item.value}
              value={item.value}
              label={item.label}
              icon={
                <Box
                  sx={{
                    transform: selected ? "translateY(-4px)" : "translateY(0px)",
                    transition: "all 250ms cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    width: 44,
                    height: 44,
                    borderRadius: 999,
                    display: "grid",
                    placeItems: "center",
                    position: "relative",
                  }}
                >
                  {/* Active Background Circle */}
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: 999,
                      opacity: selected ? 1 : 0,
                      transform: selected ? "scale(1)" : "scale(0.5)",
                      transition: "all 200ms ease",
                      background: "linear-gradient(135deg, #ef4444 0%, #fb7185 100%)",
                      boxShadow: "0 8px 20px rgba(239,68,68,0.3)",
                    }}
                  />

                  {/* Icon */}
                  <Box
                    sx={{
                      position: "relative",
                      zIndex: 1,
                      display: "flex",
                      "& .MuiSvgIcon-root": {
                        fontSize: 26,
                        color: selected ? "#fff" : "text.secondary",
                        transition: "color 200ms ease",
                      },
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
                minWidth: 0,
                transition: "all 0.2s ease",
                "& .MuiBottomNavigationAction-label": {
                  fontSize: 10,
                  fontWeight: selected ? 700 : 500,
                  mt: 0.5,
                  color: selected ? "primary.main" : "text.secondary",
                  transition: "all 0.2s ease",
                },
                "&.Mui-selected": {
                  color: "primary.main",
                },
              }}
            />
          );
        })}
      </BottomNavigation>
    </Paper>
  );
}