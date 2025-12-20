import {
  Box,
  Button,
  Card,
  CardMedia,
  Typography,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import type { Product } from "../../app/models/product";
import { useState } from "react";
import { Link } from "react-router-dom";

type Props = {
  product: Product;
};

export default function ProductRow({ product }: Props) {
  const [qty, setQty] = useState(1);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Card
      elevation={0}
      sx={{
        display: "flex",
        flexDirection: "row",
        p: { xs: 2, sm: 2.5 },
        gap: { xs: 2, sm: 4 },
        borderBottom: "1px solid",
        borderColor: "grey.200",
        borderRadius: 0,
        transition: "background-color 0.2s ease",
        "&:hover": { bgcolor: "rgba(0, 0, 0, 0.01)" },
        position: "relative",
      }}
    >
      {/* 1. Product Image - Centered and Clean */}
      <Box
        component={Link}
        to={`/catalog/${product.id}`}
        sx={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: { xs: 100, sm: 150 },
          height: { xs: 100, sm: 150 },
          bgcolor: "white",
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        <CardMedia
          component="img"
          image={product.pictureUrl}
          alt={product.name}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </Box>

      {/* 2. Product Info Area */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box>
            <Typography 
              variant="caption" 
              sx={{ color: "text.secondary", fontWeight: 700, letterSpacing: 1 }}
            >
              {product.brand?.toUpperCase() || "GENERIC"}
            </Typography>
            
            <Typography
              component={Link}
              to={`/catalog/${product.id}`}
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "text.primary",
                textDecoration: "none",
                display: "block",
                mt: 0.5,
                fontSize: { xs: "1rem", sm: "1.25rem" },
                lineHeight: 1.3,
                "&:hover": { color: "primary.main" },
              }}
            >
              {product.name}
            </Typography>
          </Box>
          
          <IconButton size="small" sx={{ color: "grey.400", alignSelf: "flex-start" }}>
            <FavoriteBorderIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Secondary Info (Typical for Walmart/BJ style) */}
        <Typography variant="body2" sx={{ color: "success.main", mt: 1, fontWeight: 500 }}>
          Pickup & Delivery available
        </Typography>

        {isMobile && (
          <Typography variant="h6" sx={{ fontWeight: 800, mt: 1.5 }}>
            ${product.price.toFixed(2)}
          </Typography>
        )}
      </Box>

      {/* 3. Desktop Action Column */}
      {!isMobile && (
        <>
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              minWidth: 160,
              textAlign: "right"
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
              ${product.price.toFixed(2)}
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 8, // Very rounded for modern feel
                  px: 0.5,
                  height: 36,
                }}
              >
                <IconButton size="small" onClick={() => setQty(q => Math.max(1, q - 1))}>
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <Typography sx={{ fontSize: "0.9rem", fontWeight: 700 }}>{qty}</Typography>
                <IconButton size="small" onClick={() => setQty(q => q + 1)}>
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>

              <Button
                variant="contained"
                disableElevation
                fullWidth
                sx={{
                  textTransform: "none",
                  borderRadius: 8,
                  fontWeight: 700,
                  py: 1,
                }}
              >
                Add to cart
              </Button>
            </Box>
          </Box>
        </>
      )}

      {/* Mobile Action Row (Sticky-style bottom) */}
      {isMobile && (
        <Box 
          sx={{ 
            position: 'absolute', 
            bottom: 16, 
            right: 16, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1 
          }}
        >
           <Button
            variant="contained"
            disableElevation
            size="small"
            sx={{
              textTransform: "none",
              borderRadius: 8,
              fontWeight: 700,
              px: 3
            }}
          >
            Add
          </Button>
        </Box>
      )}
    </Card>
  );
}