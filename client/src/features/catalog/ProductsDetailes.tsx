// ProductsDetailes.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  Stack,
  GlobalStyles,
  Fade,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import { useFetchProductDetailsQuery } from "./catalogApi";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAddCartItemMutation } from "../cart/cartApi"; // ✅ adjust path if needed
import BottomNav from "../../app/layout/BottomNav";

export default function ProductsDetailes() {
  const { id } = useParams<{ id: string }>();
  const productId = id ? parseInt(id, 10) : 0;

  const { data: product, isLoading } = useFetchProductDetailsQuery(productId);
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);

  const [addCartItem, { isLoading: isAdding }] = useAddCartItemMutation();

  useEffect(() => {
    if (!showToast) return;
    const timer = setTimeout(() => setShowToast(false), 2500);
    return () => clearTimeout(timer);
  }, [showToast]);

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      await addCartItem({ productId: product.id, quantity }).unwrap();
      setShowToast(true);
      setQuantity(1); // optional reset after add
    } catch {
      // optionally show an error toast
    }
  };

  if (isLoading) return <LoadingComponent message="Loading Product..." />;

  if (!product)
    return (
      <Box
        sx={{
          height: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button onClick={() => navigate("/catalog")}>Back</Button>
      </Box>
    );

  const price = product.price / 100;

  return (
    <>
      <GlobalStyles
        styles={{
          body: {
            margin: 0,
            padding: 0,
            overflow: "hidden !important",
            height: "100dvh !important",
          },
          html: { overflow: "hidden !important", height: "100dvh !important" },
        }}
      />

      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          height: "100dvh",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          bgcolor: "#fff",
          zIndex: 1000,
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Button
            sx={{ color: "black", fontWeight: 800, textTransform: "none" }}
            onClick={() => navigate(-1)}
          >
            ‹ Back
          </Button>

          <Typography sx={{ fontWeight: 900, fontSize: "1.2rem" }}>
            Neo <span style={{ color: "#ef4444" }}>Wasl</span>
          </Typography>

          <Box sx={{ width: 60 }} />
        </Box>

        {/* IMAGE SECTION */}
        <Box
          sx={{
            height: "45dvh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
          }}
        >
          <img
            src={product.pictureUrl || "/placeholder.png"}
            alt={product.name}
            style={{
              maxHeight: "100%",
              maxWidth: "100%",
              objectFit: "contain",
            }}
          />
        </Box>

        {/* INFO SECTION */}
        <Box sx={{ flex: 1, px: 3, display: "flex", flexDirection: "column" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Typography
              sx={{ fontSize: "1.8rem", fontWeight: 900, color: "#ef4444" }}
            >
              ${Number(price ?? 0).toLocaleString()}
            </Typography>
            <Chip
              label="In Stock"
              color="success"
              size="small"
              sx={{ fontWeight: 800 }}
            />
          </Stack>

          <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
            {product.name}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              mb: 2,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {product.description}
          </Typography>

          {/* ACTIONS ROW - Pinned High */}
          <Box sx={{ mt: "auto", mb: 14 }}>
            {/* Notification directly above the buttons */}
            <Box
              sx={{
                height: 24,
                mb: 1,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Fade in={showToast}>
                <Typography
                  sx={{ color: "#ef4444", fontWeight: 800, fontSize: "0.9rem" }}
                >
                  ✓ Added to cart
                </Typography>
              </Fade>
            </Box>

            <Stack direction="row" spacing={2}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  width: "110px",
                  height: "50px",
                  bgcolor: "#f5f5f5",
                  borderRadius: "25px",
                  px: 1,
                }}
              >
                <IconButton
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={isAdding}
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <Typography sx={{ fontWeight: 900 }}>{quantity}</Typography>
                <IconButton
                  onClick={() => setQuantity((q) => q + 1)}
                  disabled={isAdding}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Stack>

              <Button
                fullWidth
                variant="contained"
                onClick={handleAddToCart}
                disabled={isAdding}
                startIcon={<ShoppingCartIcon />}
                sx={{
                  height: "50px",
                  bgcolor: "#ef4444",
                  borderRadius: "25px",
                  fontWeight: 900,
                  textTransform: "none",
                  boxShadow: "0 4px 14px 0 rgba(239, 68, 68, 0.39)",
                  "&:hover": { bgcolor: "#dc2626" },
                }}
              >
                {isAdding ? "Adding..." : "Add to Cart"}
              </Button>
            </Stack>
          </Box>
        </Box>
      </Box>
      <BottomNav children={undefined} />
    </>
  );
}
