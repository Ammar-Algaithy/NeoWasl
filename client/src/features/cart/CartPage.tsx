import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingComponent from "../../app/layout/LoadingComponent";
import {
  useGetCartItemsQuery,
  useAddCartItemMutation,
  useRemoveCartItemMutation,
} from "../../features/cart/cartApi";
import { currencyFormat } from "../../lib/util";
import OrderSummary from "../../app/shared/components/OrderSummary";

type PaymentMethod = "card" | "cash";

export default function CartPage() {
  const { data: cart, isLoading, isError } = useGetCartItemsQuery();
  const [addCartItem] = useAddCartItemMutation();
  const [removeCartItem] = useRemoveCartItemMutation();
  const navigate = useNavigate();

  // Match your real layout heights
  const HEADER_H = 64;
  const BOTTOM_NAV_H = 78;
  const CHECKOUT_H = 84;

  // ✅ modal state
  const [summaryOpen, setSummaryOpen] = useState(false);

  // ✅ Hard-lock page scrolling while this page is mounted
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

  if (isLoading) return <LoadingComponent message="Loading cart items..." />;
  if (isError) return <div style={{ padding: 16 }}>Failed to load cart.</div>;
  if (!cart || cart.products.length === 0)
    return <div style={{ padding: 16 }}>Your cart is empty.</div>;

  // ✅ totals
  const totalItems = cart.products.reduce(
    (sum, item) => sum + Number(item.quantity ?? 0),
    0
  );

  // ✅ subtotalCents
  const subtotalCents = cart.products.reduce((sum, item) => {
    const priceCents = Number(item.price ?? 0); // 100 = $1.00
    const qty = Number(item.quantity ?? 0);

    if (!Number.isFinite(priceCents) || !Number.isFinite(qty)) return sum;

    return sum + priceCents * qty;
  }, 0);

  const deliveryFee = 0;
  const discount = 0;

  // ✅ dollars for UI + OrderSummary
  const subtotal = subtotalCents / 100;
  const total = subtotal + deliveryFee - discount;

  const handleCheckout = () => {
    setSummaryOpen(true);
  };

  const handleConfirmCheckout = (method: PaymentMethod) => {
    setSummaryOpen(false);

    // (optional) build payload to pass to CheckoutPage
    const checkoutState = {
      paymentMethod: method,
      cart,
      totalItems,
      subtotal: subtotal, // dollars
      total: Number(total.toFixed(2)), // dollars
      deliveryFee,
      discount,
    };

    if (method === "cash") {
      // ✅ go to checkout page for cash flow
      navigate("/checkout", { state: checkoutState });
      return;
    }

    // ✅ go to checkout page for card flow
    navigate("/checkout", { state: checkoutState });
  };


  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#fff",
        overflow: "hidden",
      }}
    >
      {/* ✅ ONLY THIS AREA SCROLLS */}
      <div
        style={{
          position: "absolute",
          top: HEADER_H,
          left: 0,
          right: 0,
          bottom: CHECKOUT_H + BOTTOM_NAV_H,
          overflowY: "auto",
          overflowX: "hidden",
          WebkitOverflowScrolling: "touch",
          overscrollBehaviorY: "contain",
          padding: "12px 14px",
        }}
      >
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <div
            style={{
              fontWeight: 900,
              fontSize: 18,
              marginTop: 2,
              marginBottom: 10,
            }}
          >
            Your Cart
          </div>

          <div style={{ height: 1, background: "#e5e7eb", marginBottom: 12 }} />

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {cart.products.map((item) => (
              <div
                key={item.productId}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 14,
                  padding: 12,
                  background: "#fff",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "84px 1fr auto",
                    gap: 12,
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: 84,
                      height: 84,
                      borderRadius: 12,
                      overflow: "hidden",
                      background: "#f3f4f6",
                      border: "1px solid #f3f4f6",
                    }}
                  >
                    <img
                      src={item.pictureUrl}
                      alt={item.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 900,
                        fontSize: 15,
                        lineHeight: 1.2,
                        marginBottom: 4,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={item.name}
                    >
                      {item.name}
                    </div>

                    <div
                      style={{
                        fontSize: 13,
                        color: "#374151",
                        marginBottom: 6,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={item.brand}
                    >
                      {item.brand}
                    </div>

                    {/* ✅ price is cents -> dollars */}
                    <div style={{ fontWeight: 900, fontSize: 14 }}>
                      {currencyFormat(Number(item.price))}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                      alignItems: "flex-end",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button
                        onClick={() =>
                          removeCartItem({ productId: item.productId, quantity: 1 })
                        }
                        style={qtyBtn}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>

                      <div style={{ minWidth: 22, textAlign: "center", fontWeight: 900 }}>
                        {item.quantity}
                      </div>

                      <button
                        onClick={() =>
                          addCartItem({ productId: item.productId, quantity: 1 })
                        }
                        style={qtyBtn}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() =>
                        removeCartItem({
                          productId: item.productId,
                          quantity: item.quantity,
                        })
                      }
                      style={{
                        border: "1px solid #d1d5db",
                        background: "#fff",
                        color: "#ef4444",
                        fontWeight: 900,
                        padding: "8px 12px",
                        borderRadius: 10,
                        cursor: "pointer",
                        fontSize: 13,
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ height: 12 }} />
        </div>
      </div>

      {/* ✅ FIXED CHECKOUT BAR */}
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
        <div
          style={{
            maxWidth: 520,
            margin: "0 auto",
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 800,
                color: "#6b7280",
                letterSpacing: 0.3,
                marginBottom: 2,
              }}
            >
              TOTAL
            </div>

            <div style={{ fontSize: 18, fontWeight: 900, lineHeight: 1.1 }}>
              ${total.toFixed(2)}
            </div>

            <div style={{ fontSize: 12, color: "#374151", fontWeight: 700 }}>
              {totalItems} item{totalItems === 1 ? "" : "s"}
            </div>
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
              transition: "transform 0.12s ease, box-shadow 0.12s ease",
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            Checkout
          </button>
        </div>
      </div>

      {/* ✅ SUMMARY MODAL WITH BLUR */}
      <OrderSummary
        open={summaryOpen}
        onClose={() => setSummaryOpen(false)}
        onConfirm={handleConfirmCheckout} // ✅ now receives method
        subtotal={subtotalCents} // ✅ dollars
        deliveryFee={0}
        discount={0}
        totalItems={totalItems}
      />
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
};
