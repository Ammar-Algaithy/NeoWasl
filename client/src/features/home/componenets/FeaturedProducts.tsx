import { useMemo } from "react";
import { Box, Typography, Button, Card, Chip, Grid } from "@mui/material";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import WhatshotIcon from "@mui/icons-material/Whatshot";

// --- Types ---
type PageMode = "grocery" | "smoke" | "electronics" | "accessories";

type Product = {
  id: string;
  title: string;
  price: string;
  image: string; 
  tag?: string; 
};

// --- Mock Data ---
const FEATURED_DATA: Record<PageMode, Product[]> = {
  grocery: [
    { id: "g1", title: "RED BULL ENERGY 8.4 FL. OZ., 24 PK.", price: "$31.99", image: "https://neowaslstorage.blob.core.windows.net/images/beverages/RedBull8point4oz.jpg", tag: "Deal" },
    { id: "g2", title: "ORGANIC AVOCADOS (3PK)", price: "$4.99", image: "#e0f2f1", tag: "Fresh" },
    { id: "g3", title: "CLASSIC POTATO CHIPS", price: "$2.25", image: "#fff3e0" },
    { id: "g4", title: "SPRING WATER CASE", price: "$5.99", image: "#f3e5f5" },
  ],
  smoke: [
    { id: "s1", title: "NEO GLOW HOOKAH SET", price: "$120.00", image: "#27272a", tag: "Exclusive" },
    { id: "s2", title: "EXOTIC ROLLING TRAY", price: "$24.99", image: "#18181b", tag: "New Drop" },
    { id: "s3", title: "PREMIUM GLASS PIPE", price: "$45.00", image: "#09090b" },
    { id: "s4", title: "ORGANIC HEMP WRAPS", price: "$2.50", image: "#1c1917", tag: "Best Seller" },
  ],
  electronics: [
    { id: "e1", title: "USB-C FAST CHARGER", price: "$19.99", image: "#f5f5f5", tag: "Fast" },
    { id: "e2", title: "WIRELESS EARBUDS", price: "$49.99", image: "#eeeeee" },
    { id: "e3", title: "SMART LED STRIP", price: "$24.99", image: "#e0e0e0" },
    { id: "e4", title: "PHONE STAND PRO", price: "$12.99", image: "#fafafa" },
  ],
  accessories: [
    { id: "a1", title: "WINTER BEANIE", price: "$14.99", image: "#fff7ed" },
    { id: "a2", title: "LEATHER WALLET", price: "$29.99", image: "#ffedd5" },
    { id: "a3", title: "KEY ORGANIZER", price: "$9.99", image: "#fed7aa" },
    { id: "a4", title: "SUNGLASSES", price: "$18.50", image: "#fdba74" },
  ],
};

// --- Style Logic ---
type ThemeConfig = {
  sectionBg: string;
  headerColor: string;
  cardSx: Record<string, unknown>;
  buttonSx: Record<string, unknown>;
  titleColor: string;
  priceColor: string;
  tagColor: string; 
};

function getModeFromPath(pathname: string): PageMode {
  if (pathname.startsWith("/smoke")) return "smoke";
  if (pathname.startsWith("/electronics")) return "electronics";
  if (pathname.startsWith("/accessories")) return "accessories";
  return "grocery";
}

function getThemeConfig(mode: PageMode): ThemeConfig {
  const brandRed = "#ef4444"; 

  switch (mode) {
    case "smoke":
      return {
        // UPDATED: Transparent background to blend with Smoke Page
        sectionBg: "transparent", 
        headerColor: "#fff",
        cardSx: {
          bgcolor: "#09090b",
          border: "1px solid rgba(168, 85, 247, 0.2)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.5)", 
        },
        buttonSx: {
          background: "linear-gradient(90deg, #a855f7, #ef4444)",
          color: "white",
        },
        titleColor: "#e5e7eb",
        priceColor: "#fca5a5",
        tagColor: "#ef4444",
      };
    case "grocery":
    default:
      return {
        sectionBg: "#f8fafc",
        headerColor: "#0f172a",
        cardSx: {
          bgcolor: "#ffffff",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          border: "none",
        },
        buttonSx: { 
          bgcolor: brandRed, 
          color: "white",
          "&:hover": { bgcolor: "#dc2626" } 
        },
        titleColor: "#1f2937",
        priceColor: brandRed, 
        tagColor: brandRed,
      };
  }
}

// --- Main Component ---
export default function FeaturedProducts() {
  const location = useLocation();
  const mode = useMemo(() => getModeFromPath(location.pathname), [location.pathname]);
  const products = FEATURED_DATA[mode];
  const theme = useMemo(() => getThemeConfig(mode), [mode]);

  return (
    <Box sx={{ py: 3, px: 2, bgcolor: theme.sectionBg, transition: "background 0.3s" }}>
      
      {/* Section Header */}
      <Box sx={{ mb: 2 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            color: theme.headerColor, 
            fontWeight: 700,
            fontSize: "1.1rem"
          }}
        >
          Featured Products
        </Typography>
      </Box>

      {/* Product Grid */}
      <Grid container spacing={2}>
        {products.map((product, index) => (
          <Grid key={product.id} size={{ xs: 6, sm: 6, md: 3 }}>
            <ProductCard product={product} theme={theme} index={index} mode={mode} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

// --- Sub-Component: Product Card ---
function ProductCard({ 
  product, 
  theme, 
  index,
  mode
}: { 
  product: Product; 
  theme: ThemeConfig; 
  index: number;
  mode: PageMode; 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: "12px",
          p: 2, 
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "all 0.3s ease",
          ...theme.cardSx,
        }}
        elevation={0}
      >
        {/* Tag Overlay */}
        {product.tag && (
          <Chip
            label={product.tag}
            size="small"
            icon={mode === 'smoke' ? <WhatshotIcon style={{fontSize: 12, color: 'white'}}/> : undefined}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              bgcolor: theme.tagColor,
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.6rem",
              height: 20,
              zIndex: 10,
            }}
          />
        )}

        {/* Image */}
        <Box
          sx={{
            height: "96px",
            width: "auto",
            mx: "auto",
            mb: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.05))"
          }}
        >
          {product.image.startsWith("#") ? (
             <Box sx={{ width: 60, height: 80, bgcolor: product.image, borderRadius: 1 }} />
          ) : (
            <Box 
                component="img" 
                src={product.image} 
                alt={product.title}
                sx={{ 
                    height: "100%", 
                    width: "auto", 
                    objectFit: "contain" 
                }} 
            />
          )}
        </Box>

        {/* Content Section */}
        <Box sx={{ textAlign: "center", flexGrow: 1, display: "flex", flexDirection: "column" }}>
            <Typography 
                variant="body2" 
                noWrap 
                sx={{ 
                    fontSize: "0.875rem", 
                    fontWeight: 600,      
                    color: theme.titleColor,
                    mb: 0.5 
                }}
            >
                {product.title}
            </Typography>

            <Typography 
                variant="body2"
                sx={{
                    color: theme.priceColor,
                    fontSize: "0.875rem",
                    fontWeight: 700,      
                    mt: 0.5               
                }}
            >
                {product.price}
            </Typography>
        </Box>

        {/* Button */}
        <Button
            variant="contained"
            disableElevation
            fullWidth
            sx={{
                mt: 1.5,             
                py: 1,               
                borderRadius: "12px",
                fontWeight: 600,     
                textTransform: "none",
                fontSize: "0.875rem",
                ...theme.buttonSx,
            }}
        >
            Add to Cart
        </Button>

      </Card>
    </motion.div>
  );
}