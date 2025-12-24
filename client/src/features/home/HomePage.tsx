import { useEffect } from "react";
import CategoriesSecion from "./componenets/CategoriesSecion";

export default function HomePage() {
  const HEADER_H = 64;
  const BOTTOM_NAV_H = 78;

  // 🔒 Lock page scroll exactly like CartPage
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
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#fff",
        overflow: "hidden",

        // ❗ Prevent swipe scroll everywhere by default
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

          // ✅ Allow touch scrolling ONLY here
          touchAction: "pan-y",
        }}
      >
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <CategoriesSecion />
        </div>
      </div>
    </div>
  );
}
