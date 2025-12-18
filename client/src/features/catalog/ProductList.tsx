import { Box } from "@mui/material";
import type { Product } from "../../app/models/product";
import ProductCard from "./ProductCard";


type Props = {
  products: Product[];
};

export default function ProductList({ products }: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        px: 1,
      }}
    >
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </Box>
  );
}