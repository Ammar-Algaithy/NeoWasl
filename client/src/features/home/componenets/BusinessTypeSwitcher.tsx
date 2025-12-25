import { Box, Button } from "@mui/material";

export type BusinessType = "Grocery" | "Electronics" | "Smoke Gear" | "Accessories";

// Shared data source
const businessTypes: BusinessType[] = ["Grocery", "Electronics", "Smoke Gear", "Accessories"];

// ✅ Central routing map (THIS is why Grocery was going to "" / "/")
const BUSINESS_ROUTES: Record<BusinessType, string> = {
  Grocery: "/home",
  Electronics: "/electronics",
  "Smoke Gear": "/smoke",
  Accessories: "/accessories",
};

interface Props {
  activeType: BusinessType;
  onSelect?: (type: BusinessType) => void;

  // ✅ If you do not pass onSelect, the switcher can navigate by itself.
  // This prevents repeating mapping logic across pages.
  navigateTo?: (path: string) => void;

  variant?: "light" | "dark"; // Controls the visual style
}

export default function BusinessTypeSwitcher({
  activeType,
  onSelect,
  navigateTo,
  variant = "light",
}: Props) {
  // Styles for "Light Mode" (Grocery/Electronics pages)
  const lightStyles = {
    bgcolor: "#fff",
    color: "#1f2937",
    border: "1px solid #e5e7eb",
    hoverBg: "#f9fafb",
    hoverBorder: "#d1d5db",
  };

  // Styles for "Dark Mode" (Smoke page)
  const darkStyles = {
    bgcolor: "#1f2937",
    color: "#d1d5db",
    border: "1px solid #374151",
    hoverBg: "#374151",
    hoverBorder: "#4b5563",
  };

  const currentStyle = variant === "dark" ? darkStyles : lightStyles;

  const handleSelect = (type: BusinessType) => {
    // ✅ Update state in parent if provided
    onSelect?.(type);

    // ✅ Navigate if navigateTo provided
    const route = BUSINESS_ROUTES[type];
    if (navigateTo && route) navigateTo(route);
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1.5,
        overflowX: "auto",
        justifyContent: "center",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      {businessTypes
        .filter((type) => type !== activeType) // Hide current active type
        .map((type) => (
          <Button
            key={type}
            onClick={() => handleSelect(type)}
            sx={{
              minWidth: "auto",
              borderRadius: 2,
              textTransform: "none",
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              fontWeight: 700,
              px: 2,
              py: 0.5,
              flexShrink: 0,
              transition: "all 0.2s",

              // Apply dynamic styles
              bgcolor: currentStyle.bgcolor,
              color: currentStyle.color,
              border: currentStyle.border,
              boxShadow:
                variant === "light"
                  ? "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
                  : "none",

              "&:hover": {
                bgcolor: currentStyle.hoverBg,
                borderColor: currentStyle.hoverBorder,
                transform: "translateY(-1px)",
              },
              "&:active": { transform: "translateY(0)" },
            }}
          >
            {type}
          </Button>
        ))}
    </Box>
  );
}
