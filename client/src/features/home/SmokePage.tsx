import { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setBusinessType } from "../catalog/catalogSlice";
import BusinessTypeSwitcher, { type BusinessType } from "./componenets/BusinessTypeSwitcher";
import type { CategoryItem } from "./componenets/CategoriesSecion";
import CategorySection from "./componenets/CategoriesSecion";
import PromoBanner from "./componenets/PromoBanner";
import FeaturedProducts from "./componenets/FeaturedProducts";
import BottomNav from "../../app/layout/BottomNav";

const BUSINESS_TYPE = "Smoke Gear" as const;

const smokeCategories: CategoryItem[] = [
  { name: "All", slug: "All", image: "https://neowaslstorage.blob.core.windows.net/images/smoke-categories/all.png" },
  { name: "Hookahs", slug: "Hookahs", image: "https://neowaslstorage.blob.core.windows.net/images/smoke-categories/hookah.png" },
  { name: "Wraps & Papers", slug: "Wraps", image: "https://neowaslstorage.blob.core.windows.net/images/smoke-categories/wraps.png" },
  { name: "Grabba & Beyond", slug: "Cigars", image: "https://neowaslstorage.blob.core.windows.net/images/smoke-categories/cigars.png" },
  { name: "Accessories", slug: "Accessories", image: "https://neowaslstorage.blob.core.windows.net/images/smoke-categories/accessories.png" },
];

export default function SmokePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Keep your values (do not change UI/colors)
  const HEADER_H = 64;
  const BOTTOM_NAV_H = 78;

  const activeType: BusinessType = "Smoke Gear";

  // ✅ Lock background (body) scrolling, while allowing the inner container to scroll
  useEffect(() => {
    dispatch(setBusinessType(BUSINESS_TYPE));

    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById("root");

    // Save current scroll position (prevents jumps)
    const scrollY = window.scrollY;

    // Capture previous styles
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyPosition = body.style.position;
    const prevBodyWidth = body.style.width;
    const prevBodyTop = body.style.top;

    // Apply lock
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.width = "100%";
    body.style.top = `-${scrollY}px`;

    if (root) {
      root.style.height = "100%";
      root.style.overflow = "hidden";
    }

    return () => {
      // Restore
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      body.style.position = prevBodyPosition;
      body.style.width = prevBodyWidth;
      body.style.top = prevBodyTop;

      if (root) {
        root.style.height = "";
        root.style.overflow = "";
      }

      // Restore scroll position
      window.scrollTo(0, scrollY);
    };
  }, [dispatch]);

  const handleSelect = (type: BusinessType) => {
    dispatch(setBusinessType(type));
  };

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        bgcolor: "#0f1115",
        overflow: "hidden",
        color: "common.white",
        zIndex: 1300,
      }}
    >
      {/* --- HEADER (Fixed) --- */}
      <Box
        component="header"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          px: 2,
          pt: 2,
          pb: 2.5,
          bgcolor: "rgba(11, 15, 20, 0.86)",
          backdropFilter: "blur(12px)",
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 900,
            letterSpacing: 0.6,
            mb: 1.5,
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          Neo
          <Box component="span" sx={{ color: "#ef4444" }}>
            Wasl
          </Box>
          <Box
            component="span"
            sx={{
              ml: 1,
              background: "linear-gradient(90deg, #a855f7, #ef4444)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Smoke
          </Box>
        </Typography>

        <BusinessTypeSwitcher
          activeType={activeType}
          variant="dark"
          onSelect={handleSelect}
          navigateTo={navigate}
        />

        <Box sx={{ width: "100%", marginBottom: -3 }}>
          <PromoBanner />
        </Box>
      </Box>

      {/* --- SCROLLABLE CONTENT (ONLY THIS SCROLLS) --- */}
      <Box
        sx={{
          position: "absolute",
          top: HEADER_H,
          left: 0,
          right: 0,
          bottom: BOTTOM_NAV_H,
          overflowY: "auto",
          overflowX: "hidden",
          WebkitOverflowScrolling: "touch",
          overscrollBehavior: "none", // ✅ prevents rubber-banding + unnecessary overscroll
          bgcolor: "#0f1115", // ✅ prevents any white showing if content is short
          px: 0,
          py: 2,
        }}
      >
        <Box sx={{ px: 2, pt: 13 }}>
          <CategorySection
            title="Categories"
            categories={smokeCategories}
            variant="dark"
            cardHeight={148}
          />
        </Box>

        <FeaturedProducts />
      </Box>

      {/* ✅ Bottom nav must NOT be inside the scroll container */}
      <BottomNav children={undefined} />
    </Box>
  );
}
