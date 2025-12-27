import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

import {
  Box,
  Container,
  Typography,
  Chip,
  useTheme,
  alpha,
  IconButton,
} from "@mui/material";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import DiscountOutlinedIcon from "@mui/icons-material/DiscountOutlined";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const HEADER_H = 86;
const BOTTOM_NAV_H = 78;

type UiNotification = {
  id: string;
  title: string;
  message: string;
  type: "system" | "promo" | "order";
  dateLabel: string;
  unread?: boolean;
};

export default function NotificationsPage() {
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    document.title = "Notifications | NeoWasl";

    // Lock page scroll like AccountPage
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyHeight = body.style.height;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.height = "100%";

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      body.style.height = prevBodyHeight;
    };
  }, []);

  const pageBg =
    theme.palette.mode === "dark"
      ? theme.palette.background.default
      : "#f8fafc";
  const cardBorder = alpha(theme.palette.common.black, 0.06);

  // Sample placeholder notifications (replace with real API later)
  const items: UiNotification[] = useMemo(
    () => [
      {
        id: "n1",
        title: "Welcome to NeoWasl",
        message: "Your account is ready. Start browsing offers and place your first order.",
        type: "system",
        dateLabel: "Today",
        unread: true,
      },
      {
        id: "n2",
        title: "New promo available",
        message: "Limited-time deals are live. Check Savings to see eligible discounts.",
        type: "promo",
        dateLabel: "Yesterday",
      },
      {
        id: "n3",
        title: "Order updates",
        message: "Track order status updates here as soon as orders are enabled.",
        type: "order",
        dateLabel: "This week",
      },
    ],
    []
  );

  const iconFor = (t: UiNotification["type"]) => {
    switch (t) {
      case "promo":
        return <DiscountOutlinedIcon sx={{ fontSize: 22, color: "#10b981" }} />;
      case "order":
        return <LocalShippingOutlinedIcon sx={{ fontSize: 22, color: "#6366f1" }} />;
      case "system":
      default:
        return <CampaignOutlinedIcon sx={{ fontSize: 22, color: "#3b82f6" }} />;
    }
  };

  return (
    <Box sx={{ position: "fixed", inset: 0, bgcolor: pageBg, overflow: "hidden", touchAction: "none" }}>
      {/* Header */}
      <Box
        component={motion.header}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          bgcolor: alpha(theme.palette.common.white, 0.8),
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          boxShadow: "0 1px 0 rgba(15, 23, 42, 0.06)",
        }}
      >
        <Container maxWidth="sm" sx={{ py: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <IconButton
              onClick={() => navigate(-1)}
              sx={{
                width: 40,
                height: 40,
                borderRadius: "999px",
                color: "#64748b",
                "&:hover": { bgcolor: "#f1f5f9", color: "#1f2937" },
              }}
            >
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>

            <Box sx={{ textAlign: "center", flex: 1 }}>
              <Typography sx={{ fontSize: 22, fontWeight: 900, color: "#0f172a", lineHeight: 1.1 }}>
                Notifications
              </Typography>
              <Typography sx={{ mt: 0.4, fontSize: 13, color: "#64748b" }}>
                System updates, promos, and order alerts
              </Typography>
            </Box>

            <Box sx={{ width: 40 }} />
          </Box>

          <Box sx={{ mt: 1, display: "flex", justifyContent: "center" }}>
            <Chip
              size="small"
              icon={<NotificationsNoneOutlinedIcon sx={{ fontSize: 16 }} />}
              label={`${items.filter((x) => x.unread).length} unread`}
              sx={{ bgcolor: "#f1f5f9", color: "#0f172a", fontWeight: 800 }}
            />
          </Box>
        </Container>
      </Box>

      {/* Scroll area */}
      <Box
        sx={{
          position: "absolute",
          top: HEADER_H,
          left: 0,
          right: 0,
          bottom: BOTTOM_NAV_H,
          overflowY: "auto",
          overflowX: "hidden",
          WebkitOverflowScrolling: "touch",
          overscrollBehaviorY: "contain",
          px: 2,
          pt: 3,
          pb: 6,
          touchAction: "pan-y",
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.25 }}>
            {items.map((n, idx) => (
              <Box
                key={n.id}
                component={motion.section}
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: idx * 0.06 }}
                sx={{
                  bgcolor: "#fff",
                  borderRadius: 3,
                  border: `1px solid ${cardBorder}`,
                  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.06)",
                  overflow: "hidden",
                }}
              >
                <Box sx={{ px: 2.25, py: 2, display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      bgcolor: "#f1f5f9",
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                    }}
                  >
                    {iconFor(n.type)}
                  </Box>

                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1 }}>
                      <Typography sx={{ fontSize: 15.5, fontWeight: 900, color: "#0f172a" }}>
                        {n.title}
                      </Typography>

                      <Typography sx={{ fontSize: 12, color: "#94a3b8", fontWeight: 800 }}>
                        {n.dateLabel}
                      </Typography>
                    </Box>

                    <Typography sx={{ mt: 0.6, fontSize: 13.5, color: "#475569", lineHeight: 1.65 }}>
                      {n.message}
                    </Typography>

                    {n.unread && (
                      <Box sx={{ mt: 1 }}>
                        <Chip
                          size="small"
                          label="NEW"
                          sx={{
                            bgcolor: "#fee2e2",
                            color: "#991b1b",
                            fontWeight: 900,
                            borderRadius: 999,
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            ))}

            {items.length === 0 && (
              <Box
                component={motion.section}
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                sx={{
                  bgcolor: "#fff",
                  borderRadius: 3,
                  border: `1px solid ${cardBorder}`,
                  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.06)",
                  p: 3,
                  textAlign: "center",
                }}
              >
                <Typography sx={{ fontSize: 16, fontWeight: 900, color: "#0f172a" }}>
                  No notifications
                </Typography>
                <Typography sx={{ mt: 0.75, fontSize: 13, color: "#64748b" }}>
                  Updates and promos will appear here.
                </Typography>
              </Box>
            )}

            <Box sx={{ height: 10 }} />
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
