import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";


import { useFetchProductDetailsQuery } from "./catalogApi";
import LoadingComponent from "../../app/layout/LoadingComponent";

export default function ProductsDetailes() {
  const { id } = useParams<{ id: string }>();
  const {data: product, isLoading} = useFetchProductDetailsQuery(id ? parseInt(id, 10) : 0);
  
  const navigate = useNavigate();
  
  const [quantity, setQuantity] = useState(1);
  const [expanded, setExpanded] = useState(false);



  const canAdd = !!product && product.quantityInStock > 0;

  const handleAddToCart = () => {
    if (!product || !canAdd) return;

    // TODO: Replace with your real add-to-cart logic
    console.log("Add to cart", { productId: product.id, quantity });
  };

  if (isLoading) return <LoadingComponent message="Loading Product..." />;

  if (!product) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#fff", p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
          Product not found
        </Typography>
        <Button onClick={() => navigate("/catalog")}>Back</Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100vh",
        bgcolor: "#fff",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Scrollable */}
      <Box sx={{ flex: 1, overflowY: "auto", pb: 3 }}>
        {/* IMAGE */}
        <Box sx={{ px: 2, pt: 1 }}>
          <Box
            sx={{
              height: "42vh",
              minHeight: 260,
              borderRadius: 3,
              border: "1px solid #f1f1f1",
              bgcolor: "#fafafa",
              mt: -2,
              overflow: "hidden",
              p: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Inner rounded wrapper (makes radius visible) */}
            <Box
              sx={{
                width: "100%",
                height: "100%",
                borderRadius: 1,
                overflow: "hidden",
                bgcolor: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={product.pictureUrl || "/placeholder.png"}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* INFO */}
        <Box sx={{ px: 2, pt: 2 }}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              letterSpacing: 0.7,
              color: "text.secondary",
              textTransform: "uppercase",
            }}
          >
            {product.brand} • {product.type}
          </Typography>

          <Typography
            sx={{
              fontSize: "1.35rem",
              fontWeight: 800,
              lineHeight: 1.2,
              mt: 0.5,
            }}
          >
            {product.name}
          </Typography>

          {/* PRICE + STOCK ROW */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mt: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: "1.6rem",
                fontWeight: 900,
                letterSpacing: -0.4,
                color: "#ef4444",
              }}
            >
              $
              {product.price.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Typography>

            <Chip
              label={canAdd ? "In Stock" : "Out of Stock"}
              size="small"
              color={canAdd ? "success" : "error"}
              sx={{
                fontWeight: 800,
                borderRadius: 2,
                height: 22,
                fontSize: "0.7rem",
              }}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* DESCRIPTION */}
          <Typography sx={{ fontWeight: 900, mb: 0.75 }}>
            Description
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              lineHeight: 1.55,
              display: "-webkit-box",
              WebkitLineClamp: expanded ? "unset" : 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {product.description}
          </Typography>

          {/* IMPORTANT: make "Read more" a real button for accessibility */}
          <Button
            variant="text"
            disableRipple
            onClick={() => setExpanded((v) => !v)}
            aria-label={expanded ? "Collapse description" : "Expand description"}
            sx={{
              p: 0,
              minWidth: 0,
              mt: 0.6,
              textTransform: "none",
              fontWeight: 900,
              color: "#ef4444",
              justifyContent: "flex-start",
              "&:hover": { bgcolor: "transparent", textDecoration: "underline" },
            }}
          >
            {expanded ? "Read less" : "Read more"}
          </Button>

          {/* ACTIONS */}
          <Box sx={{ mt: 1.75 }}>
            <Box sx={{ display: "flex", gap: 1.25 }}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  width: "38%",
                  minWidth: 120,
                  bgcolor: "#f8f9fa",
                  borderRadius: 3,
                  border: "1px solid #eee",
                }}
              >
                <IconButton
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={!canAdd}
                >
                  <RemoveIcon />
                </IconButton>

                <Typography sx={{ fontWeight: 900 }}>{quantity}</Typography>

                <IconButton
                  aria-label="Increase quantity"
                  onClick={() => setQuantity((q) => q + 1)}
                  disabled={!canAdd}
                >
                  <AddIcon />
                </IconButton>
              </Stack>

              <Button
                fullWidth
                variant="contained"
                disableElevation
                startIcon={<ShoppingCartIcon />}
                disabled={!canAdd}
                onClick={handleAddToCart}
                aria-label="Add product to cart"
                sx={{
                  borderRadius: 3,
                  fontWeight: 900,
                  textTransform: "none",
                  bgcolor: "#ef4444",
                  "&:hover": { bgcolor: "#dc2626" },
                  "&.Mui-disabled": { bgcolor: "#f3f4f6", color: "#9ca3af" },
                }}
              >
                Add to Cart
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
