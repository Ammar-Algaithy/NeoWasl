import React from "react";
import { motion, type MotionProps } from "framer-motion";
import {
  Box,
  Typography,
  Paper,
  Link,
  Stack,
  Divider,
  type BoxProps,
  type PaperProps,
  type TypographyProps,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";

// Motion typed wrappers
const MotionPaper = motion.create(Paper) as React.FC<
  PaperProps & MotionProps & { component?: React.ElementType }
>;
const MotionTypography = motion.create(Typography) as React.FC<
  TypographyProps & MotionProps & { component?: React.ElementType }
>;
const MotionBox = motion.create(Box) as React.FC<
  BoxProps & MotionProps & { component?: React.ElementType }
>;

export default function ContactUsSection() {
  return (
    <MotionPaper
      elevation={0}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      sx={{
        bgcolor: "#fff",
        p: { xs: 3, md: 4 },
        borderRadius: 1, // match WhyChoose card style (rounded-3xl feel)
        boxShadow: 6,
        my: 2,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* soft background accent (same vibe as WhyChoose, no color changes to your palette) */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.9,
          background:
            "radial-gradient(800px 220px at 50% 0%, rgba(239,68,68,0.10), transparent 60%)",
        }}
      />

      <MotionTypography
        variant="h5"
        component="h2"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.05, duration: 0.45, ease: "easeOut" }}
        sx={{
          fontWeight: 800,
          textAlign: "center",
          color: "#ef4444",
          position: "relative",
        }}
      >
        Contact Us
      </MotionTypography>

      <Typography
        variant="body1"
        sx={{
          mt: 1.5,
          textAlign: "center",
          color: "text.secondary",
          maxWidth: 560,
          mx: "auto",
          lineHeight: 1.7,
          position: "relative",
        }}
      >
        Have questions, or want to advertise or sell your products with us? Reach
        out directly—we’d love to hear from you!
      </Typography>

      <Divider sx={{ my: 3, opacity: 0.7 }} />

      {/* Contact cards (same “feature card” style as WhyChoose) */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        justifyContent="center"
        sx={{ position: "relative" }}
      >
        {/* Email Card */}
        <MotionBox
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ delay: 0.1, duration: 0.45, ease: "easeOut" }}
          sx={{
            flex: 1,
            minWidth: { xs: "100%", sm: 260 },
            bgcolor: "#f3f4f6", // same as WhyChoose item bg
            borderRadius: 1,
            boxShadow: 3,
            p: 2.25,
            textAlign: "left",
          }}
        >
          <Stack direction="row" spacing={1.25} alignItems="center">
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 1,
                display: "grid",
                placeItems: "center",
                bgcolor: "rgba(239,68,68,0.10)",
              }}
            >
              <EmailOutlinedIcon sx={{ color: "#ef4444" }} />
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                Email
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.25 }}>
                Support and partnerships
              </Typography>
            </Box>
          </Stack>

          <Box sx={{ mt: 1.5 }}>
            <Link
              href="mailto:support@neowasl.com"
              underline="hover"
              sx={{
                color: "text.primary",
                fontWeight: 600,
                wordBreak: "break-word",
                transition: "color 0.2s ease",
                "&:hover": { color: "#ef4444" },
              }}
            >
              support@neowasl.com
            </Link>
          </Box>
        </MotionBox>

        {/* Phone Card */}
        <MotionBox
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ delay: 0.18, duration: 0.45, ease: "easeOut" }}
          sx={{
            flex: 1,
            minWidth: { xs: "100%", sm: 260 },
            bgcolor: "#f3f4f6",
            borderRadius: 1,
            boxShadow: 3,
            p: 2.25,
            textAlign: "left",
          }}
        >
          <Stack direction="row" spacing={1.25} alignItems="center">
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                display: "grid",
                placeItems: "center",
                bgcolor: "rgba(239,68,68,0.10)",
              }}
            >
              <PhoneOutlinedIcon sx={{ color: "#ef4444" }} />
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                Phone
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.25 }}>
                Fast response hours
              </Typography>
            </Box>
          </Stack>

          <Box sx={{ mt: 1.5 }}>
            <Link
              href="tel:+16464559869"
              underline="hover"
              sx={{
                color: "text.primary",
                fontWeight: 600,
                transition: "color 0.2s ease",
                "&:hover": { color: "#ef4444" },
              }}
            >
              +1 (646) 455-9869
            </Link>
          </Box>
        </MotionBox>
      </Stack>
    </MotionPaper>
  );
}
