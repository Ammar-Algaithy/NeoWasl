import { useEffect } from "react";
import { Container, Typography } from "@mui/material";
import TopNavBar from "../../app/layout/TopNavBar";
import BottomNav from "../../app/layout/BottomNav";

export default function Favorite() {
  // Match your real layout heights
  const HEADER_H = 64;
  const BOTTOM_NAV_H = 78;

  // 🔒 Lock page scroll while this page is mounted
  useEffect(() => {
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

  return (
    <>
    <TopNavBar />
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#fff",
        overflow: "hidden",

        // ❌ no scrolling anywhere by default
        touchAction: "none",
      }}
    >
      {/* ✅ ONLY THIS AREA SCROLLS */}
      <div
        style={{
          position: "absolute",
          top: HEADER_H,
          left: 0,
          right: 0,
          bottom: BOTTOM_NAV_H,

          overflowY: "auto",
          overflowX: "hidden",
          WebkitOverflowScrolling: "touch",
          overscrollBehaviorY: "contain",

          padding: "12px 14px",

          // ✅ enable vertical scroll ONLY here
          touchAction: "pan-y",
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="h4" gutterBottom>
            Favorites
          </Typography>

          <Typography variant="body1" color="text.secondary">
            Your favorite items will appear here.
          </Typography>
        </Container>
      </div>
    </div>
    <BottomNav children={undefined} />
    </>
  );
}
