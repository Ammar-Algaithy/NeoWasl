import { useEffect } from "react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import ProductList from "./ProductList";
import { useGetProductsQuery } from "./catalogApi";

export default function Catalog() {
  const { data, isLoading, isError } = useGetProductsQuery();

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

  if (isLoading || !data) return <LoadingComponent message="Fetching Product..." />;
  if (isError) return <div style={{ padding: 16 }}>Failed to load products.</div>;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#fff",
        overflow: "hidden",
        // ✅ prevent swipe scroll everywhere by default
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

          // ✅ allow touch scrolling only here
          touchAction: "pan-y",
        }}
      >
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <ProductList products={data} />
        </div>
      </div>
    </div>
  );
}
