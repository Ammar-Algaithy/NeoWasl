import { Box, Typography, Card, CardActionArea } from "@mui/material";
import { useNavigate } from "react-router-dom";

type Category = {
  name: string;
  image: string;
  slug: string;
};

const categories: Category[] = [
  { name: "Drinks", slug: "Beverages", image: "https://neowaslstorage.blob.core.windows.net/images/categories/bev.jpg" },
  { name: "Candy", slug: "Candy", image: "https://neowaslstorage.blob.core.windows.net/images/categories/candies.png" },
  { name: "Snacks & Cookies", slug: "Snacks%20%26%20Cookies", image: "https://neowaslstorage.blob.core.windows.net/images/categories/snacksandcookies.png" },
  { name: "Cakes", slug: "Cakes", image: "https://neowaslstorage.blob.core.windows.net/images/categories/cakes.jpg" },
  { name: "Gums", slug: "Gum", image: "https://neowaslstorage.blob.core.windows.net/images/categories/GUMS.jpg" },
  { name: "Meds", slug: "MED", image: "https://neowaslstorage.blob.core.windows.net/images/categories/MEDS.jpg" },
  { name: "Essentials", slug: "Essentials", image: "https://neowaslstorage.blob.core.windows.net/images/categories/essentials.png" },
  { name: "All", slug: "All", image: "https://neowaslstorage.blob.core.windows.net/images/categories/all.png" },
];

function CategoryCard({ name, image, slug }: Category) {
  const navigate = useNavigate();

  return (
    <Card
      elevation={0}
      sx={{
        position: "relative",
        height: 140, // keep consistent so 2 rows = "4 at a time"
        borderRadius: 1,
        overflow: "hidden",
        cursor: "pointer",
        border: "1px solid rgba(0,0,0,0.08)",
        boxShadow: "0 14px 28px rgba(0,0,0,0.18)",
        transition: "transform 200ms ease",
        "&:active": { transform: "scale(0.98)" },
      }}
    >
      <CardActionArea
        onClick={() => navigate(`/products/${slug}`)}
        sx={{ height: "100%" }}
      >
        {/* Background image */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "contrast(1.05) saturate(1.05)",
          }}
        />

        {/* Dark overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0.15))",
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
            borderRadius: 1,
            bgcolor: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            boxShadow: "0 6px 14px rgba(0,0,0,0.25)",
          }}
        >
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1,
              maxWidth: 140,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {name}
          </Typography>
        </Box>
      </CardActionArea>
    </Card>
  );
}

export default function CategoriesSection() {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography
        sx={{
          fontSize: 22,
          fontWeight: 900,
          mb: 2,
          color: "#0b0f14",
        }}
      >
        Categories
      </Typography>

      {/* Scroll container: shows 4 at a time */}
      <Box
        sx={{
          height: 140 * 2 + 16, // 2 rows * 140px + gap (16px) => 4 visible cards
          overflowY: "auto",
          overflowX: "hidden",
          pr: 0.5, // small space so content doesn't sit under scrollbar

          // optional: hide scrollbar but keep scroll working
          scrollbarWidth: "none", // Firefox
          "&::-webkit-scrollbar": { display: "none" }, // Chrome/Safari/Edge
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 2,
          }}
        >
          {categories.map((cat) => (
            <CategoryCard key={cat.slug} {...cat} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
