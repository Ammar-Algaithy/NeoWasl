import { Box, Typography, Card, CardActionArea, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

export type CategoryItem = {
  name: string;
  image: string;
  slug: string;
};

type Props = {
  title?: string;
  categories: CategoryItem[];

  // navigation
  buildUrl?: (slug: string) => string; // default: /products/:slug

  // layout
  columns?: number; // default 2
  gap?: number; // default 2 (theme spacing units)
  cardHeight?: number; // default 140
  borderRadius?: number; // default 1

  // style
  variant?: "light" | "dark"; // default light

  // ✅ show fixed rows and scroll inside
  scrollRows?: number; // set to 2 for "two rows only"

  // scrollbar
  hideScrollbar?: boolean; // default true
};

export default function CategorySection({
  title = "Categories",
  categories,
  buildUrl = (slug) => `/products/${slug}`,

  columns = 2,
  gap = 2,
  cardHeight = 140,
  borderRadius = 1,

  variant = "light",
  scrollRows = 2, // ✅ default to 2 rows visible
  hideScrollbar = true,
}: Props) {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDark = variant === "dark";

  // ✅ Use theme spacing to match the grid gap exactly
  const gapPx = Number(theme.spacing(gap).replace("px", "")) || 0;

  // ✅ Height = rows * cardHeight + (rows - 1) * gapPx
  const containerHeight =
    scrollRows && scrollRows > 0
      ? scrollRows * cardHeight + (scrollRows - 1) * gapPx
      : undefined;

  return (
    <Box>
      {title ? (
        <Typography
          sx={{
            fontSize: 22,
            fontWeight: 900,
            mb: 2,
            color: isDark ? "common.white" : "#0b0f14",
            letterSpacing: 0.2,
          }}
        >
          {title}
        </Typography>
      ) : null}

      {/* ✅ ONLY THIS CONTAINER SCROLLS */}
      <Box
        sx={{
          height: containerHeight, // ✅ 2 rows visible
          overflowY: "auto",
          overflowX: "hidden",
          pr: 0.5,

          WebkitOverflowScrolling: "touch",
          overscrollBehaviorY: "contain",

          ...(hideScrollbar
            ? {
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": { display: "none" },
              }
            : {}),
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            gap,
          }}
        >
          {categories.map((cat) => (
            <Card
              key={cat.slug}
              elevation={0}
              sx={{
                position: "relative",
                height: cardHeight,
                borderRadius,
                overflow: "hidden",
                bgcolor: "transparent",
                cursor: "pointer",

                boxShadow: isDark
                  ? "0 6px 22px rgba(0,0,0,0.45)"
                  : "0 6px 18px rgba(0,0,0,0.10)",
                transition: "transform 160ms ease, box-shadow 160ms ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: isDark
                    ? "0 10px 28px rgba(0,0,0,0.55)"
                    : "0 10px 24px rgba(0,0,0,0.14)",
                },
                "&:active": { transform: "scale(0.98)" },
              }}
            >
              <CardActionArea
                onClick={() => navigate(buildUrl(cat.slug))}
                sx={{
                  height: "100%",
                  borderRadius,
                  "&:focus-visible": {
                    outline: isDark
                      ? "3px solid rgba(239,68,68,0.55)"
                      : "3px solid rgba(11,15,20,0.35)",
                    outlineOffset: "2px",
                  },
                }}
              >
                {/* Background image */}
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `url(${cat.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: isDark
                      ? "contrast(1.08) saturate(1.08)"
                      : "contrast(1.05) saturate(1.05)",
                  }}
                />

                {/* Overlay */}
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background: isDark
                      ? "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.05) 62%)"
                      : "linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0.12))",
                  }}
                />

                {/* Label pill */}
                <Box
                  sx={{
                    position: "absolute",
                    left: 12,
                    bottom: 12,
                    px: 1.5,
                    py: 0.75,
                    borderRadius,
                    bgcolor: "rgba(0,0,0,0.45)",
                    backdropFilter: "blur(6px)",
                    WebkitBackdropFilter: "blur(6px)",
                    boxShadow: "0 6px 14px rgba(0,0,0,0.25)",
                    maxWidth: "80%",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: "common.white",
                      lineHeight: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={cat.name}
                  >
                    {cat.name}
                  </Typography>
                </Box>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
