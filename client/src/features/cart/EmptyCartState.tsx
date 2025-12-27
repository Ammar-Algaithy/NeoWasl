import { Box, Typography, Button, Stack } from "@mui/material";
import { motion } from "framer-motion";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

export default function EmptyCartState() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "60vh", // Takes up meaningful space
        px: 3,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Stack alignItems="center" spacing={3}>
          {/* 1. Icon Container with Soft Glow */}
          <Box
            sx={{
              width: 120,
              height: 120,
              bgcolor: "rgba(239, 68, 68, 0.05)", // Very subtle brand tint
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              mb: 1,
              border: "1px solid rgba(239, 68, 68, 0.1)", // Delicate border
            }}
          >
            <ShoppingBagOutlinedIcon
              sx={{ fontSize: 56, color: "#ef4444", opacity: 0.8 }}
            />
          </Box>

          {/* 2. Text Hierarchy */}
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h5" fontWeight={800} sx={{ color: "#1f2937", mb: 1 }}>
              Your cart is <Box component="span" sx={{ color: "#ef4444" }}>empty</Box>
            </Typography>
            <Typography variant="body1" sx={{ color: "#6b7280", maxWidth: 300, mx: "auto", lineHeight: 1.5 }}>
              Looks like you haven't added anything to your cart yet.
            </Typography>
          </Box>

          {/* 3. Action Button */}
          <Button
            onClick={() => navigate("/home")}
            startIcon={<ArrowBackIcon />}
            variant="contained"
            disableElevation
            sx={{
              bgcolor: "#ef4444",
              color: "#fff",
              px: 4,
              py: 1.5,
              borderRadius: 50, // Pill shape is more modern
              textTransform: "none",
              fontSize: 16,
              fontWeight: 700,
              boxShadow: "0 10px 20px rgba(239, 68, 68, 0.2)", // Soft colored shadow
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                bgcolor: "#dc2626",
                transform: "translateY(-2px)", // Subtle lift effect
                boxShadow: "0 14px 24px rgba(239, 68, 68, 0.3)",
              },
            }}
          >
            Start Shopping
          </Button>
        </Stack>
      </motion.div>
    </Box>
  );
}