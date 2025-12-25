import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";

import LoadingComponent from "../../app/layout/LoadingComponent";
import ProductList from "./ProductList";
import type { RootState } from "../../app/store/store";
import { useGetProductsByCategoryQuery } from "./catalogApi";
import CatalogControls from "./CatalogControls";

function CategoryPageInner({ category }: { category: string }) {
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));
  const isMdDown = useMediaQuery(theme.breakpoints.down("md"));

  const {
    businessType,
    searchTerm,
    orderBy,
    selectedBrands,
    selectedTypes,
    pageSize,
  } = useSelector((state: RootState) => state.catalog);

  const [pageNumber, setPageNumber] = useState(1);

  const { data, isLoading, isFetching, isError } = useGetProductsByCategoryQuery({
    category,
    businessType,
    pageNumber,
    pageSize,
    searchTerm: searchTerm.trim() || undefined,
    orderBy,
    brands: selectedBrands,
    types: selectedTypes,
  });

  const items = data?.items ?? [];
  const meta = data?.meta;

  const hasMore = useMemo(() => {
    if (!meta) return true;
    return meta.currentPage < meta.totalPages;
  }, [meta]);

  // Keep your existing “app shell” heights
  const HEADER_H = 64;
  const BOTTOM_NAV_H = 78;

  // Lock page scroll (keep your behavior)
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyHeight = body.style.height;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.height = "100%";

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      body.style.height = prevBodyHeight;
    };
  }, []);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (!first.isIntersecting) return;
        if (isFetching || !hasMore) return;

        setPageNumber((p) => p + 1);
      },
      { root: null, rootMargin: "700px", threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isFetching, hasMore]);

  if (isLoading) return <LoadingComponent message={`Fetching ${category}...`} />;

  if (isError) {
    return (
      <Box sx={{ pt: `${HEADER_H + 40}px`, textAlign: "center", color: "#dc2626", fontWeight: 700 }}>
        Failed to load products.
      </Box>
    );
  }

  /**
   * Responsive width strategy (same UI pattern):
   * - Mobile: tight (like your current)
   * - Tablet: a bit wider
   * - Desktop: wider but still centered (not full width)
   */
  const contentMaxWidth = isSmDown ? 520 : isMdDown ? 720 : 980;

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        bgcolor: "#f3f4f6",
        overflow: "hidden",
        touchAction: "none",
      }}
    >
      {/* Scroll area under header and above bottom nav */}
      <Box
        sx={{
          position: "absolute",
          top: `${HEADER_H}px`,
          left: 0,
          right: 0,
          bottom: `${BOTTOM_NAV_H}px`,
          overflowY: "auto",
          overflowX: "hidden",
          WebkitOverflowScrolling: "touch",
          overscrollBehaviorY: "contain",
          touchAction: "pan-y",

          // Responsive padding keeps the same pattern but feels better on desktop
          px: { xs: 1.25, sm: 2, md: 3 },
          pt: { xs: 1.25, sm: 1.5 },
          pb: { xs: 2, sm: 2.5 },
        }}
      >
        {/* Centered “content column” (pattern preserved) */}
        <Box
          sx={{
            maxWidth: `${contentMaxWidth}px`,
            mx: "auto",
          }}
        >
          {/* Controls */}
          <CatalogControls category={category} />

          {/* Products */}
          {items.length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                mt: 5,
                color: "#9ca3af",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography sx={{ fontSize: 40, lineHeight: 1 }}>📦</Typography>
              <Typography sx={{ fontWeight: 700 }}>
                No items found in {category}
              </Typography>
            </Box>
          ) : (
            <>
              <ProductList products={items} />

              <Box ref={sentinelRef} sx={{ height: 1 }} />

              <Box sx={{ py: 2, textAlign: "center", color: "#6b7280", fontWeight: 700 }}>
                {isFetching && <span>Loading more…</span>}
                {!isFetching && meta && !hasMore && <span>No more products.</span>}
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = slug || "All";

  const {
    businessType,
    searchTerm,
    orderBy,
    selectedBrands,
    selectedTypes,
    pageSize,
  } = useSelector((state: RootState) => state.catalog);

  // Remount on filter changes to reset paging (your pattern preserved)
  const resetKey = useMemo(() => {
    return JSON.stringify({
      category,
      businessType,
      searchTerm: searchTerm.trim(),
      orderBy,
      brands: [...selectedBrands].sort(),
      types: [...selectedTypes].sort(),
      pageSize,
    });
  }, [category, businessType, searchTerm, orderBy, selectedBrands, selectedTypes, pageSize]);

  return <CategoryPageInner key={resetKey} category={category} />;
}
