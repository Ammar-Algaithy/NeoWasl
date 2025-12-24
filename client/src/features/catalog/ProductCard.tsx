// ProductCard.tsx
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
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import type { Product } from "../../app/models/product";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  useGetCartItemsQuery,
  useAddCartItemMutation,
  useRemoveCartItemMutation,
} from "../cart/cartApi"; // ✅ adjust path if needed
import { currencyFormat } from "../../lib/util";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const [toastOpen, setToastOpen] = useState(false);
  const [toastText, setToastText] = useState("Updated cart");

  // ✅ local quantity used ONLY when NOT in cart
  const [localQty, setLocalQty] = useState(1);

  // ✅ cart is the source of truth for whether it's "In cart"
  const { data: cart } = useGetCartItemsQuery();

  const [addCartItem, { isLoading: isAdding }] = useAddCartItemMutation();
  const [removeCartItem, { isLoading: isRemoving }] = useRemoveCartItemMutation();

  const busy = isAdding || isRemoving;


  const brandText = useMemo(() => {
    const b = product.brand?.trim();
    return b ? b.toUpperCase() : "GENERIC";
  }, [product.brand]);

  const goToDetails = () => navigate(`/catalog/${product.id}`);

  // ✅ find this item in cart
  const cartItem = useMemo(() => {
    return cart?.products?.find((p) => p.productId === product.id);
  }, [cart, product.id]);

  const cartQty = Number(cartItem?.quantity ?? 0);
  const inCart = cartQty > 0;

  // ✅ display qty:
  // - show cart qty when IN cart
  // - show local qty when NOT in cart
  const displayQty = inCart ? cartQty : localQty;

  const showToast = (msg: string) => {
    setToastText(msg);
    setToastOpen(true);
  };

  // ✅ + :
  // - if IN cart => increase cart qty via API
  // - if NOT in cart => only increase local qty (NO API)
  const handleInc = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!inCart) {
      setLocalQty((q) => Math.min(99, q + 1));
      return;
    }

    try {
      await addCartItem({ productId: product.id, quantity: 1 }).unwrap();
      showToast("Updated cart");
    } catch {
      // optional error toast
    }
  };

  // ✅ - :
  // - if IN cart => decrease cart qty via API
  // - if NOT in cart => only decrease local qty down to 1 (NO API)
  const handleDec = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!inCart) {
      setLocalQty((q) => Math.max(1, q - 1));
      return;
    }

    try {
      await removeCartItem({ productId: product.id, quantity: 1 }).unwrap();
      showToast(cartQty === 1 ? "Removed from cart" : "Updated cart");
    } catch {
      // optional error toast
    }
  };

  // ✅ Add button is the ONLY thing that can add to cart.
  // When adding:
  // - add quantity = localQty
  // - then reset localQty back to 1 (optional, clean UX)
  const handlePrimaryAction = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inCart) return;

    try {
      await addCartItem({ productId: product.id, quantity: localQty }).unwrap();
      showToast(`Added ${localQty} to cart`);
      setLocalQty(1);
    } catch {
      // optional error toast
    }
  };

  const QtyControl = (
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
      onClick={(e) => e.stopPropagation()}
    >
      <IconButton
        onClick={handleDec}
        disabled={busy}
        sx={{ width: 44, height: 40, borderRadius: 0 }}
        aria-label="Decrease quantity"
      >
        <RemoveIcon fontSize="small" />
      </IconButton>

      <Box
        sx={{
          width: isMobile ? 90 : 48,
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderLeft: "1px solid",
          borderRight: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography sx={{ fontWeight: 900 }}>
          {busy && inCart ? <CircularProgress size={16} /> : displayQty}
        </Typography>
      </Box>

      <IconButton
        onClick={handleInc}
        disabled={busy}
        sx={{ width: 44, height: 40, borderRadius: 0 }}
        aria-label="Increase quantity"
      >
        <AddIcon fontSize="small" />
      </IconButton>
    </Box>
  );

  // ✅ ONLY styling helper (no UI structure change)
  const addBtnSx = {
    height: 40,
    textTransform: "none",
    borderRadius: 1.5,
    fontWeight: 900,

    ...(inCart
      ? {
          // ✅ red text + red border when "In cart"
          color: "#ef4444",
          borderColor: "#ef4444",
          "&:hover": {
            borderColor: "#dc2626",
            backgroundColor: "rgba(239,68,68,0.06)",
          },
          // ✅ keep the red even while disabled
          "&.Mui-disabled": {
            color: "#ef4444",
            borderColor: "#ef4444",
            opacity: 1,
          },
        }
      : {}),
  } as const;

  return (
    <>
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
                  <Typography variant="body2" sx={{ color: "success.main", fontWeight: 700 }}>
                    In stock
                  </Typography>
                </Box>
              </Box>

              {/* Favorite */}
              <IconButton
                size={isMobile ? "medium" : "small"}
                onClick={(e) => e.stopPropagation()}
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
                      {currencyFormat(product.price)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>
                      Price per item
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {QtyControl}

                    <Button
                      variant={inCart ? "outlined" : "contained"}
                      disableElevation
                      fullWidth
                      disabled={busy || inCart}
                      onClick={handlePrimaryAction}
                      sx={addBtnSx}
                    >
                      {busy ? "Updating..." : inCart ? "In cart" : "Add"}
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
                    {currencyFormat(product.price)}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>
                    Price per item
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {QtyControl}

                  <Button
                    variant={inCart ? "outlined" : "contained"}
                    disableElevation
                    fullWidth
                    disabled={busy || inCart}
                    onClick={handlePrimaryAction}
                    sx={addBtnSx}
                  >
                    {busy ? "Updating..." : inCart ? "In cart" : "Add to cart"}
                  </Button>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Card>

      {/* ✅ notification at top */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={1400}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setToastOpen(false)} severity="success" sx={{ fontWeight: 800 }}>
          {toastText}
        </Alert>
      </Snackbar>
    </>
  );
}
