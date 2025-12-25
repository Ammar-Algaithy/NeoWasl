import { useEffect, useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import LocalShippingTwoToneIcon from "@mui/icons-material/LocalShippingTwoTone";
import WhatshotTwoToneIcon from "@mui/icons-material/WhatshotTwoTone";
import ElectricalServicesTwoToneIcon from "@mui/icons-material/ElectricalServicesTwoTone";
import AutoAwesomeTwoToneIcon from "@mui/icons-material/AutoAwesomeTwoTone";

type PageMode = "grocery" | "smoke" | "electronics" | "accessories";

// 1. Define specific visual configurations including Icons and Gradients
type CategoryConfig = {
  containerSx: Record<string, unknown>;
  textSx: Record<string, unknown>;
  icon: React.ReactNode;
  iconColor: string;
};

const PROMOS: Record<PageMode, string[]> = {
  grocery: [
    "Free delivery on orders over $50.",
    "Buy 2 Get 1 Free on select energy drinks.",
    "Deals refreshed daily — check back often.",
    "Bulk savings available on top brands.",
  ],
  smoke: [
    "New smoke gear just arrived ",
    "Limited-time deals on wraps & hookahs.",
    "Stock moves fast — order early.",
    "Premium accessories now available.",
  ],
  electronics: [
    "New arrivals in accessories and essentials.",
    "Bundle deals available on top items.",
    "Limited-time discounts while inventory lasts.",
    "Fast restocks — check weekly.",
  ],
  accessories: [
    "New essentials and add-ons just landed.",
    "Save more when you bundle items.",
    "Popular items restocked — limited quantities.",
    "Seasonal offers available now.",
  ],
};

function getModeFromPath(pathname: string): PageMode {
  if (pathname.startsWith("/smoke")) return "smoke";
  if (pathname.startsWith("/electronics")) return "electronics";
  if (pathname.startsWith("/accessories")) return "accessories";
  return "grocery";
}

function getDesignConfig(mode: PageMode): CategoryConfig {
  switch (mode) {
    case "smoke":
      return {
        containerSx: {
          // Deep dark background to let the gradient pop
          bgcolor: "#09090b", 
          // Border uses the purple from the gradient start
          border: "1px solid rgba(168, 85, 247, 0.3)",
          // Glow uses the red from the gradient end
          boxShadow: "0 4px 20px rgba(239, 68, 68, 0.15), inset 0 0 20px rgba(0,0,0,0.5)",
        },
        textSx: {
          // The specific "Neo Wasl Smoke" gradient
          background: "linear-gradient(90deg, #a855f7, #ef4444)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          color: "transparent",
          // Heavier weight needed to make the gradient visible on text
          fontWeight: 800,
          letterSpacing: 0.5,
          // Drop shadow to ensure legibility against the dark bg
          filter: "drop-shadow(0px 2px 2px rgba(0,0,0,0.5))",
        },
        icon: <WhatshotTwoToneIcon fontSize="small" />,
        iconColor: "#ef4444", // The "Wasl" red
      };
    case "electronics":
      return {
        containerSx: {
          background: "linear-gradient(135deg, #f3f4f6 0%, #ffffff 100%)",
          border: "1px solid #e5e7eb",
          boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
        },
        textSx: { color: "#374151" },
        icon: <ElectricalServicesTwoToneIcon fontSize="small" />,
        iconColor: "#6366f1",
      };
    case "accessories":
      return {
        containerSx: {
          bgcolor: "#fff7ed", // warm orange tint
          border: "1px solid #ffedd5",
          boxShadow: "0 2px 4px rgba(234, 88, 12, 0.08)",
        },
        textSx: { color: "#9a3412" },
        icon: <AutoAwesomeTwoToneIcon fontSize="small" />,
        iconColor: "#ea580c",
      };
    case "grocery":
    default:
      return {
        containerSx: {
          background: "linear-gradient(135deg, #ffeff3ff 0%, #fedbe2ff 100%)",
          border: "1px solid #febfcfff",
          boxShadow: "0 2px 8px rgba(246, 59, 96, 0.15)",
        },
        textSx: { color: "#f51f1fff" },
        icon: <LocalShippingTwoToneIcon fontSize="small" />,
        iconColor: "#f51f1fff",
      };
  }
}

export default function PromoBanner() {
  const location = useLocation();
  const mode = useMemo(() => getModeFromPath(location.pathname), [location.pathname]);
  const messages = useMemo(() => PROMOS[mode] ?? [], [mode]);
  const config = useMemo(() => getDesignConfig(mode), [mode]);

  // Reset logic is handled by the key prop in the parent render
  return <PromoBannerInner key={mode} messages={messages} config={config} />;
}

function PromoBannerInner({
  messages,
  config,
}: {
  messages: string[];
  config: CategoryConfig;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Simple interval instead of complex animation controls
  useEffect(() => {
    if (messages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 5000); // Change every 5 seconds
    return () => clearInterval(interval);
  }, [messages.length]);

  if (!messages.length) return null;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        mt: 2,
        mb: 1,
      }}
    >
      <Box
        component={motion.div}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        sx={{
          position: "relative",
          width: { xs: "95%", sm: "90%", md: "600px" },
          height: 48, // Fixed height prevents layout shift
          borderRadius: 1, // Pill shape
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          px: 2,
          gap: 1.5,
          transition: "all 0.3s ease",
          ...config.containerSx,
        }}
      >
        {/* Static Icon on the left */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: config.iconColor,
            minWidth: 24,
          }}
        >
          {config.icon}
        </Box>

        {/* Animated Text Area */}
        <Box sx={{ position: "relative", flex: 1, height: "100%", overflow: "hidden" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600, // base weight, overridden by config.textSx for smoke
                  fontSize: { xs: "0.85rem", sm: "0.95rem" },
                  lineHeight: 1.2,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "100%",
                  ...config.textSx,
                }}
              >
                {messages[currentIndex]}
              </Typography>
            </motion.div>
          </AnimatePresence>
        </Box>
      </Box>
    </Box>
  );
}