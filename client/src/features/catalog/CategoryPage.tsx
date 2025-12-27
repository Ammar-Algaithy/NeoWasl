import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";

import LoadingComponent from "../../app/layout/LoadingComponent";
import ProductList from "./ProductList";
import type { RootState } from "../../app/store/store";
import { useGetProductsByCategoryQuery } from "./catalogApi";
import CatalogControls from "./CatalogControls";
import TopNavBar from "../../app/layout/TopNavBar";
import BottomNav from "../../app/layout/BottomNav";

/**
 * RELATIONSHIP MAP
 * - CatalogControls -> dispatches Redux updates (search/sort/filters)
 * - CategoryPage -> reads Redux + category slug, builds query args, fetches products
 * - ProductList -> pure rendering of products passed from CategoryPage
 */

const HEADER_H = 64;
const BOTTOM_NAV_H = 78;

function lockBodyScroll() {
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
}

function buildQueryArgs(
  category: string,
  pageNumber: number,
  state: RootState["catalog"]
) {
  const { businessType, searchTerm, orderBy, selectedBrands, selectedTypes, pageSize } = state;

  return {
    category,
    businessType,
    pageNumber,
    pageSize,
    searchTerm: searchTerm.trim() || undefined,
    orderBy,
    brands: selectedBrands,
    types: selectedTypes,
  };
}

function CategoryPageInner({ category }: { category: string }) {
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));
  const isMdDown = useMediaQuery(theme.breakpoints.down("md"));

  const catalogState = useSelector((state: RootState) => state.catalog);

  // Paging is local to this page
  const [pageNumber, setPageNumber] = useState(1);

  const args = useMemo(
    () => buildQueryArgs(category, pageNumber, catalogState),
    [category, pageNumber, catalogState]
  );

  const { data, isLoading, isFetching, isError } = useGetProductsByCategoryQuery(args);

  const items = data?.items ?? [];
  const meta = data?.meta;

  const hasMore = useMemo(() => {
    if (!meta) return true;
    return meta.currentPage < meta.totalPages;
  }, [meta]);

  // lock body scrolling while mounted
  useEffect(() => lockBodyScroll(), []);

  // infinite scroll sentinel
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
      {/* Only this region scrolls */}
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
          px: { xs: 1.25, sm: 2, md: 3 },
          pb: { xs: 2, sm: 2.5 },
        }}
      >
        <Box sx={{ maxWidth: `${contentMaxWidth}px`, mx: "auto" }}>
          {/* Controls read/write Redux; CategoryPage reads Redux and fetches */}
          <CatalogControls category={category} />

          {items.length === 0 ? (
            <Box sx={{ textAlign: "center", mt: 5, color: "#9ca3af" }}>
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

  const catalogState = useSelector((state: RootState) => state.catalog);

  // Remount to reset pageNumber when filters change
  const resetKey = useMemo(() => {
    return JSON.stringify({
      category,
      businessType: catalogState.businessType,
      searchTerm: catalogState.searchTerm.trim(),
      orderBy: catalogState.orderBy,
      brands: [...catalogState.selectedBrands].sort(),
      types: [...catalogState.selectedTypes].sort(),
      pageSize: catalogState.pageSize,
    });
  }, [category, catalogState]);

  return (
  <>
    <TopNavBar />
    <CategoryPageInner key={resetKey} category={category} />;
    <BottomNav children={undefined} />
  </>
  );
}
