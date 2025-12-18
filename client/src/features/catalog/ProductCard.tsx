import {
  Box,
  Button,
  Card,
  CardMedia,
  Typography,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import type { Product } from "../../app/models/product";
import { useState } from "react";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const [qty, setQty] = useState(1);

  return (
    <Card
      elevation={1}
      sx={{
        display: "flex",
        gap: 2,
        p: 2,
        borderRadius: 2,
        alignItems: "center",
        bgcolor: "background.paper",
      }}
    >
      {/* Product Image */}
      <CardMedia
        component="img"
        image={product.pictureUrl}
        alt={product.name}
        sx={{
          width: 90,
          height: 90,
          borderRadius: 1,
          objectFit: "cover",
        }}
      />

      {/* Product Info */}
      <Box sx={{ flexGrow: 1 }}>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 700, textTransform: "uppercase" }}
        >
          {product.name}
        </Typography>

        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Brand: {product.brand ?? "Unknown"}
        </Typography>

        <Typography
          variant="h6"
          sx={{ color: "primary.main", fontWeight: 700, mt: 0.5 }}
        >
          ${product.price.toFixed(2)}
        </Typography>

        {/* Quantity Selector */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mt: 1,
            gap: 1,
          }}
        >
          <IconButton
            size="small"
            onClick={() => setQty(q => Math.max(1, q - 1))}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              width: 28,
              height: 28,
            }}
          >
            <RemoveIcon fontSize="small" />
          </IconButton>

          <Typography sx={{ fontWeight: 600 }}>{qty}</Typography>

          <IconButton
            size="small"
            onClick={() => setQty(q => q + 1)}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              width: 28,
              height: 28,
            }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Buttons */}
        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
          <Button
            variant="outlined"
            sx={{
              textTransform: "none",
              borderRadius: 1,
              borderColor: "primary.main",
              color: "primary.main",
              flex: 1,
            }}
          >
            Recurring
          </Button>

          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              borderRadius: 1,
              flex: 1,
            }}
          >
            Add to Cart
          </Button>
        </Box>
      </Box>
    </Card>
  );
}