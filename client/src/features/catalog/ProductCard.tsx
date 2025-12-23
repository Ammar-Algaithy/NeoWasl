import {
  Box,
  Button,
  Card,
  CardMedia,
  Divider,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import type { Product } from "../../app/models/product";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const [qty, setQty] = useState(1);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const price = useMemo(() => Number(product.price ?? 0), [product.price]);
  const priceText = useMemo(
    () => (Number.isFinite(price) ? price.toFixed(2) : "0.00"),
    [price]
  );

  const brandText = useMemo(() => {
    const b = product.brand?.trim();
    return b ? b.toUpperCase() : "GENERIC";
  }, [product.brand]);

  const handleDec = () => setQty((q) => Math.max(1, q - 1));
  const handleInc = () => setQty((q) => q + 1);

  const goToDetails = () => navigate(`/catalog/${product.id}`);

  return (
    <Card
      elevation={0}
      onClick={goToDetails}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          goToDetails();
        }
      }}
      role="link"
      tabIndex={0}
      aria-label={`View details for ${product.name}`}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        bgcolor: "background.paper",
        overflow: "hidden",
        cursor: "pointer",
        outline: "none",
        transition:
          "box-shadow 160ms ease, border-color 160ms ease, transform 160ms ease",
        "&:hover": {
          borderColor: "rgba(0,0,0,0.18)",
          boxShadow: { xs: "none", sm: "0 10px 26px rgba(0,0,0,0.06)" },
          transform: { xs: "none", sm: "translateY(-1px)" },
        },
        "&:focus-visible": {
          boxShadow: "0 0 0 3px rgba(25, 118, 210, 0.25)",
        },
      }}
    >
      {/* IMPORTANT:
          We handle click on the Card itself.
          Anything interactive must stop propagation. */}

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: { xs: 1.25, sm: 2 },
          p: { xs: 1.5, sm: 2 },
          alignItems: { xs: "flex-start", sm: "stretch" },
        }}
      >
        {/* Image */}
        <Box
          component={Link}
          to={`/catalog/${product.id}`}
          onClick={(e) => e.stopPropagation()}
          sx={{
            flexShrink: 0,
            width: { xs: 96, sm: 150 },
            height: { xs: 96, sm: 150 },
            borderRadius: 1,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "grey.50",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
          }}
        >
          <CardMedia
            component="img"
            image={product.pictureUrl}
            alt={product.name}
            sx={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 1,
              alignItems: "flex-start",
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="overline"
                sx={{
                  color: "text.secondary",
                  fontWeight: 800,
                  letterSpacing: 1.2,
                  lineHeight: 1.1,
                }}
              >
                {brandText}
              </Typography>

              <Typography
                component={Link}
                to={`/catalog/${product.id}`}
                onClick={(e) => e.stopPropagation()}
                sx={{
                  display: "block",
                  mt: 0.25,
                  textDecoration: "none",
                  color: "text.primary",
                  fontWeight: 700,
                  lineHeight: 1.25,
                  fontSize: { xs: "1rem", sm: "1.15rem" },
                  displayWebkitBox: "true",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                {product.name}
              </Typography>

              <Box sx={{ mt: 0.75, display: "flex", gap: 1.25, flexWrap: "wrap" }}>
                <Typography
                  variant="body2"
                  sx={{ color: "success.main", fontWeight: 700 }}
                >
                  In stock
                </Typography>
              </Box>
            </Box>

            {/* Favorite (stop propagation so it won't navigate) */}
            <IconButton
              size={isMobile ? "medium" : "small"}
              onClick={(e) => {
                e.stopPropagation();
                // TODO: favorite toggle logic
              }}
              sx={{
                color: "text.secondary",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1.5,
                width: isMobile ? 42 : 34,
                height: isMobile ? 42 : 34,
              }}
              aria-label="Add to favorites"
            >
              <FavoriteBorderIcon fontSize={isMobile ? "medium" : "small"} />
            </IconButton>
          </Box>

          {/* Mobile actions */}
          {isMobile && (
            <Box sx={{ mt: 1.1 }} onClick={(e) => e.stopPropagation()}>
              <Divider sx={{ mb: 1 }} />

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography sx={{ fontWeight: 900, fontSize: "1.1rem", lineHeight: 1 }}>
                    ${priceText}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>
                    Price per item
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      height: 40,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 1.5,
                      overflow: "hidden",
                      bgcolor: "background.paper",
                    }}
                  >
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDec();
                      }}
                      sx={{ width: 44, height: 40, borderRadius: 0 }}
                      aria-label="Decrease quantity"
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>

                    <Box
                      sx={{
                        width: 90,
                        height: 40,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderLeft: "1px solid",
                        borderRight: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Typography sx={{ fontWeight: 900 }}>{qty}</Typography>
                    </Box>

                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInc();
                      }}
                      sx={{ width: 44, height: 40, borderRadius: 0 }}
                      aria-label="Increase quantity"
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <Button
                    variant="contained"
                    disableElevation
                    fullWidth
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: add-to-cart logic
                    }}
                    sx={{
                      height: 40,
                      textTransform: "none",
                      borderRadius: 1.5,
                      fontWeight: 900,
                    }}
                  >
                    Add
                  </Button>
                </Box>
              </Box>
            </Box>
          )}
        </Box>

        {/* Desktop action column */}
        {!isMobile && (
          <Box
            sx={{ display: "flex", alignItems: "stretch", gap: 2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Divider orientation="vertical" flexItem />

            <Box
              sx={{
                width: 240,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 1.2,
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 900, fontSize: "1.35rem", lineHeight: 1 }}>
                  ${priceText}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>
                  Price per item
                </Typography>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    height: 40,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1.5,
                    overflow: "hidden",
                    bgcolor: "background.paper",
                  }}
                >
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDec();
                    }}
                    sx={{ width: 44, height: 40, borderRadius: 0 }}
                    aria-label="Decrease quantity"
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>

                  <Box
                    sx={{
                      width: 48,
                      height: 40,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderLeft: "1px solid",
                      borderRight: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Typography sx={{ fontWeight: 900 }}>{qty}</Typography>
                  </Box>

                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleInc();
                    }}
                    sx={{ width: 44, height: 40, borderRadius: 0 }}
                    aria-label="Increase quantity"
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Button
                  variant="contained"
                  disableElevation
                  fullWidth
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: add-to-cart logic
                  }}
                  sx={{
                    height: 40,
                    textTransform: "none",
                    borderRadius: 1.5,
                    fontWeight: 900,
                  }}
                >
                  Add to cart
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Card>
  );
}
