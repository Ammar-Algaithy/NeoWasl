import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { motion, type MotionProps } from "framer-motion";
import { Box, Typography, Stack, Button, type ButtonProps } from "@mui/material";

type MotionButtonProps = ButtonProps &
  MotionProps & { component?: React.ElementType; to?: string };

const MotionBox = motion.create(Box);
const MotionTypography = motion.create(Typography);
const MotionButton = motion.create(Button) as React.FC<MotionButtonProps>;

export default function HeroSection() {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{marginTop: -60}}
      sx={{
        bgcolor: "#ef4444",
        color: "white",

        borderRadius: 1,

        // ✅ wider from both sides
        ml: 0,      // was m: 2 (smaller left/right margin)
        my: 2,      // keep top/bottom spacing
        width: "100%",

        position: "relative",
        p: { xs: 4, md: 6 },
        boxShadow: 6,
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      <Box sx={{ maxWidth: 768, mx: "auto" }}>
        <MotionTypography
          variant="h2"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
          sx={{
            fontWeight: 700,
            fontSize: { xs: "2rem", md: "3rem" },
            mb: 2,
            lineHeight: 1.15,
          }}
        >
          Welcome to{" "}
          <Box component="span" sx={{ color: "#000" }}>
            Neo
            <Box component="span" sx={{ color: "#fff" }}>
              Wasl
            </Box>
          </Box>
        </MotionTypography>

        <MotionTypography
          variant="body1"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5, ease: "easeOut" }}
          sx={{
            fontSize: { xs: "1rem", md: "1.125rem" },
            mb: 3,
            lineHeight: 1.6,
            color: "grey.100",
          }}
        >
          Simplify your shopping experience. Order with ease.
        </MotionTypography>
      </Box>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        justifyContent="center"
        alignItems="center"
      >
        <MotionButton
          component={RouterLink}
          to="/explore-offers"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95, y: 1 }}
          transition={{ duration: 0.2 }}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 999,
            fontWeight: 600,
            textTransform: "none",
            bgcolor: "#fff",
            color: "#000",
            border: "1px solid #000",
            boxShadow:
              "0px 4px 0px rgba(0,0,0,0.2), 0px 8px 15px rgba(0,0,0,0.1)",
            "&:hover": {
              bgcolor: "#fff",
              boxShadow:
                "0px 2px 0px rgba(0,0,0,0.3), 0px 10px 20px rgba(0,0,0,0.2)",
            },
            "&:active": {
              boxShadow: "0px 1px 0px rgba(0,0,0,0.4)",
            },
          }}
        >
          Explore Offers
        </MotionButton>

        <Stack direction="row" spacing={2}>
          <MotionButton
            component={RouterLink}
            to="/sign-in"
            variant="outlined"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            sx={{
              px: 3,
              py: 1.5,
              borderRadius: 999,
              fontWeight: 500,
              textTransform: "none",
              color: "#fff",
              borderColor: "#fff",
              "&:hover": {
                bgcolor: "#fff",
                color: "#ef4444",
                borderColor: "#fff",
              },
            }}
          >
            Sign In
          </MotionButton>

          <MotionButton
            component={RouterLink}
            to="/sign-up"
            variant="outlined"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            sx={{
              px: 3,
              py: 1.5,
              borderRadius: 999,
              fontWeight: 500,
              textTransform: "none",
              color: "#fff",
              borderColor: "#fff",
              "&:hover": {
                bgcolor: "#fff",
                color: "#ef4444",
                borderColor: "#fff",
              },
            }}
          >
            Sign Up
          </MotionButton>
        </Stack>
      </Stack>
    </MotionBox>
  );
}
