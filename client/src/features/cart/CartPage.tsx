import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetCartItemsQuery,
  useAddCartItemMutation,
  useRemoveCartItemMutation,
} from "../../features/cart/cartApi";
import { currencyFormat } from "../../lib/util";
import OrderSummary from "../../app/shared/components/OrderSummary";
import TopNavBar from "../../app/layout/TopNavBar";
import { Box, Button, Typography, Skeleton } from "@mui/material";
import BottomNav from "../../app/layout/BottomNav";

type PaymentMethod = "card" | "cash";

export default function CartPage() {
  const { data: cart, isLoading, isError } = useGetCartItemsQuery();
  const [addCartItem] = useAddCartItemMutation();
  const [removeCartItem] = useRemoveCartItemMutation();
  const navigate = useNavigate();

  const HEADER_H = 64;
  const BOTTOM_NAV_H = 78;
  const CHECKOUT_H = 84;

  const [summaryOpen, setSummaryOpen] = useState(false);
  const [pressedId, setPressedId] = useState<number | null>(null);

  // Lock page scroll
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

  // ✅ Safe Calculations
  const hasItems = cart?.products && cart.products.length > 0;

  const totalItems = hasItems
    ? cart!.products.reduce((sum, item) => sum + Number(item.quantity ?? 0), 0)
    : 0;

  const subtotalCents = hasItems
    ? cart!.products.reduce((sum, item) => {
        const price = Number(item.price ?? 0);
        const qty = Number(item.quantity ?? 0);
        return sum + price * qty;
      }, 0)
    : 0;

  const deliveryFee = 0;
  const discount = 0;
  const subtotal = subtotalCents / 100;
  const total = subtotal + deliveryFee - discount;

  const handleCheckout = () => setSummaryOpen(true);

  const handleConfirmCheckout = (method: PaymentMethod) => {
    setSummaryOpen(false);
    if (!cart) return;

    const checkoutState = {
      paymentMethod: method,
      cart,
      totalItems,
      subtotal,
      total: Number(total.toFixed(2)),
      deliveryFee,
      discount,
    };
    navigate("/checkout", { state: checkoutState });
  };

  const shellMaxW = 520;

  const shimmer = useMemo(
    () => (
      <div style={{ maxWidth: shellMaxW, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 2, marginBottom: 10 }}>
          <div style={{ fontWeight: 900, fontSize: 18 }}>Your Cart</div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 900,
              color: "#0f172a",
              background: "#f1f5f9",
              border: "1px solid #e5e7eb",
              padding: "6px 10px",
              borderRadius: 999,
              letterSpacing: 0.2,
            }}
          >
            Loading
          </div>
        </div>

        <div style={{ height: 1, background: "#e5e7eb", marginBottom: 12 }} />

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 14,
                padding: 12,
                background: "#fff",
              }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "84px 1fr auto", gap: 12, alignItems: "center" }}>
                <Skeleton variant="rounded" width={84} height={84} sx={{ borderRadius: "12px" }} />
                <div style={{ minWidth: 0 }}>
                  <Skeleton variant="text" width="70%" />
                  <Skeleton variant="text" width="40%" />
                  <Skeleton variant="text" width="30%" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end" }}>
                  <Skeleton variant="rounded" width={118} height={34} sx={{ borderRadius: "10px" }} />
                  <Skeleton variant="rounded" width={92} height={34} sx={{ borderRadius: "10px" }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ height: 12 }} />
      </div>
    ),
    []
  );

  const onCardPress = (id: number) => setPressedId(id);
  const onCardRelease = () => setPressedId(null);

  // ✅ Define Content based on state
  let content;
  if (isLoading) {
    // ✅ enhanced loading without changing logic
    content = (
      <div style={{ padding: "6px 0" }}>
        {shimmer}
      </div>
    );
  } else if (isError) {
    content = (
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            maxWidth: `${shellMaxW}px`,
            mx: "auto",
            bgcolor: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 3,
            boxShadow: "0 14px 30px rgba(15,23,42,0.06)",
            p: 2.25,
          }}
        >
          <Typography sx={{ fontWeight: 900, color: "#0f172a", fontSize: 16 }}>
            Something went wrong
          </Typography>
          <Typography sx={{ mt: 0.75, color: "#64748b", fontSize: 13.5, lineHeight: 1.6 }}>
            Failed to load your cart. Please try again.
          </Typography>

          <Box sx={{ display: "flex", gap: 1.25, mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate("/home")}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                fontWeight: 900,
                borderColor: "#e5e7eb",
                color: "#0f172a",
                "&:hover": { borderColor: "#d1d5db", bgcolor: "#f9fafb" },
              }}
            >
              Go Home
            </Button>
            <Button
              variant="contained"
              onClick={() => window.location.reload()}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                fontWeight: 900,
                bgcolor: "#0f172a",
                "&:hover": { bgcolor: "#111827" },
              }}
            >
              Reload
            </Button>
          </Box>
        </Box>
      </Box>
    );
  } else if (!hasItems) {
    // ✅ Enhanced Empty State (same colors/borders)
    content = (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 8, px: 2, gap: 2 }}>
        <Box
          sx={{
            width: "100%",
            maxWidth: `${shellMaxW}px`,
            bgcolor: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 3,
            boxShadow: "0 18px 40px rgba(15, 23, 42, 0.06)",
            p: 3,
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "18px",
              bgcolor: "#f1f5f9",
              border: "1px solid #e5e7eb",
              mx: "auto",
              display: "grid",
              placeItems: "center",
              boxShadow: "0 10px 22px rgba(15,23,42,0.06)",
            }}
          >
            <span style={{ fontSize: 28, fontWeight: 900, color: "#0f172a" }}>🛒</span>
          </Box>

          <Typography sx={{ mt: 2, fontSize: 18, fontWeight: 900, color: "#0f172a" }}>
            Your cart is empty
          </Typography>
          <Typography sx={{ mt: 0.75, fontSize: 13.5, color: "#64748b", lineHeight: 1.65 }}>
            Browse the catalog and add items to your cart. Your total will show here instantly.
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", gap: 1.25, mt: 2.25 }}>

            <Button
              variant="contained"
              onClick={() => navigate("/home")}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                fontWeight: 600,
                bgcolor: "linear-gradient(135deg, #ef4444, #dc2626)",
                background: "linear-gradient(135deg, #ef4444, #dc2626)",
                boxShadow: "0 10px 20px rgba(239,68,68,0.28)",
                "&:hover": {
                  background: "linear-gradient(135deg, #ef4444, #b91c1c)",
                },
              }}
            >
              Start Shopping
            </Button>
          </Box>
        </Box>
      </Box>
    );
  } else {
    // ✅ Enhanced Cart Items List (same colors/borders, just added polish)
    content = (
      <div style={{ maxWidth: shellMaxW, margin: "0 auto" }}>
        {/* Header row */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 10, marginTop: 2, marginBottom: 10 }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: 18, lineHeight: 1.1 }}>Your <span style={{color: "red"}}>Cart</span></div>
          </div>
        </div>

        <div style={{ height: 1, background: "#e5e7eb", marginBottom: 12 }} />

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {cart!.products.map((item) => {
            const isPressed = pressedId === item.productId;

            return (
              <div
                key={item.productId}
                onMouseDown={() => onCardPress(item.productId)}
                onMouseUp={onCardRelease}
                onMouseLeave={onCardRelease}
                onTouchStart={() => onCardPress(item.productId)}
                onTouchEnd={onCardRelease}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 14,
                  padding: 12,
                  background: "#fff",
                  boxShadow: isPressed ? "0 10px 22px rgba(15,23,42,0.08)" : "0 12px 30px rgba(15,23,42,0.06)",
                  transform: isPressed ? "scale(0.995)" : "scale(1)",
                  transition: "transform 140ms ease, box-shadow 140ms ease",
                }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "84px 1fr auto", gap: 12, alignItems: "center" }}>
                  {/* Image */}
                  <div
                    style={{
                      width: 84,
                      height: 84,
                      borderRadius: 12,
                      overflow: "hidden",
                      background: "#f3f4f6",
                      border: "1px solid #f3f4f6",
                      position: "relative",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate(`/catalog/${item.productId}`)}
                    role="button"
                    tabIndex={0}
                  >
                    <img
                      src={item.pictureUrl}
                      alt={item.name}
                      loading="eager"
                      decoding="async"
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                    {/* subtle shine */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.18) 35%, rgba(255,255,255,0) 70%)",
                        transform: "translateX(-40%)",
                        pointerEvents: "none",
                      }}
                    />
                  </div>

                  {/* Details */}
                  <div
                    style={{ minWidth: 0, cursor: "pointer" }}
                    onClick={() => navigate(`/catalog/${item.productId}`)}
                    role="button"
                    tabIndex={0}
                  >
                    <div
                      style={{
                        fontWeight: 900,
                        fontSize: 15,
                        lineHeight: 1.2,
                        marginBottom: 4,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        color: "#0f172a",
                      }}
                      title={item.name}
                    >
                      {item.name}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 13,
                          color: "#374151",
                          marginBottom: 6,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          minWidth: 0,
                          flex: 1,
                        }}
                        title={item.brand}
                      >
                        {item.brand}
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                      <div style={{ fontWeight: 900, fontSize: 14, color: "#0f172a" }}>
                        {currencyFormat(Number(item.price))}
                      </div>
                    </div>
                  </div>

                  {/* Controls */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        background: "#f9fafb",
                        border: "1px solid #e5e7eb",
                        padding: "6px 8px",
                        borderRadius: 12,
                      }}
                    >
                      <button
                        onClick={() => removeCartItem({ productId: item.productId, quantity: 1 })}
                        style={qtyBtn}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>

                      <div style={{ minWidth: 22, textAlign: "center", fontWeight: 900, color: "#0f172a" }}>
                        {item.quantity}
                      </div>

                      <button
                        onClick={() => addCartItem({ productId: item.productId, quantity: 1 })}
                        style={qtyBtn}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeCartItem({ productId: item.productId, quantity: item.quantity })}
                      style={{
                        border: "1px solid #d1d5db",
                        background: "#fff",
                        color: "#ef4444",
                        fontWeight: 900,
                        padding: "8px 12px",
                        borderRadius: 10,
                        cursor: "pointer",
                        fontSize: 13,
                        transition: "transform 120ms ease, box-shadow 120ms ease, background 120ms ease",
                      }}
                      onMouseDown={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)")}
                      onMouseUp={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1)")}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* breathing room */}
        <div style={{ height: 12 }} />
      </div>
    );
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "#fff", overflow: "hidden" }}>
      <TopNavBar />

      {/* Main Scroll Area */}
      <div
        style={{
          position: "absolute",
          top: HEADER_H,
          left: 0,
          right: 0,
          bottom: hasItems ? CHECKOUT_H + BOTTOM_NAV_H : 0,
          overflowY: "auto",
          padding: "12px 14px",
          WebkitOverflowScrolling: "touch",
          overscrollBehavior: "contain",
        }}
      >
        {content}
      </div>

      {/* Checkout Bar */}
      {hasItems && (
        <div
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: BOTTOM_NAV_H,
            height: CHECKOUT_H,
            background: "linear-gradient(to top, #ffffff 70%, #f9fafb)",
            borderTop: "1px solid #e5e7eb",
            boxShadow: "0 -6px 16px rgba(0,0,0,0.06)",
            zIndex: 60,
            display: "flex",
            alignItems: "center",
            padding: "12px 14px",
          }}
        >
          <div style={{ maxWidth: shellMaxW, margin: "0 auto", width: "100%", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#6b7280", letterSpacing: 0.3, marginBottom: 2 }}>
                TOTAL
              </div>
              <div style={{ fontSize: 18, fontWeight: 900, lineHeight: 1.1 }}>${total.toFixed(2)}</div>
              <div style={{ fontSize: 12, color: "#374151", fontWeight: 700 }}>{totalItems} items</div>
            </div>

            <button
              onClick={handleCheckout}
              style={{
                border: "none",
                background: "linear-gradient(135deg, #ef4444, #dc2626)",
                color: "#fff",
                fontWeight: 900,
                fontSize: 15,
                padding: "16px 18px",
                borderRadius: 16,
                cursor: "pointer",
                minWidth: 160,
                boxShadow: "0 10px 20px rgba(239,68,68,0.35)",
                transition: "transform 140ms ease, box-shadow 140ms ease",
              }}
              onMouseDown={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.transform = "scale(0.99)";
                el.style.boxShadow = "0 8px 18px rgba(239,68,68,0.28)";
              }}
              onMouseUp={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.transform = "scale(1)";
                el.style.boxShadow = "0 10px 20px rgba(239,68,68,0.35)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.transform = "scale(1)";
                el.style.boxShadow = "0 10px 20px rgba(239,68,68,0.35)";
              }}
            >
              Checkout
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      <OrderSummary
        open={summaryOpen}
        onClose={() => setSummaryOpen(false)}
        onConfirm={handleConfirmCheckout}
        subtotal={subtotalCents}
        deliveryFee={0}
        discount={0}
        totalItems={totalItems}
      />
      <BottomNav children={undefined} />
    </div>
  );
}

const qtyBtn: React.CSSProperties = {
  width: 34,
  height: 34,
  borderRadius: 10,
  border: "1px solid #d1d5db",
  background: "#fff",
  cursor: "pointer",
  fontWeight: 900,
  fontSize: 16,
  lineHeight: "34px",
  color: "#0f172a",
  transition: "transform 120ms ease, background 120ms ease, box-shadow 120ms ease",
};
