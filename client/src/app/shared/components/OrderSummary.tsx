import { useEffect, useState } from "react";
import { currencyFormat } from "../../../lib/util";

type PaymentMethod = "card" | "cash";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: (method: PaymentMethod) => void;

  subtotal: number; // dollars
  deliveryFee?: number; // dollars
  discount?: number; // dollars
  totalItems: number;
};

export default function OrderSummary({
  open,
  onClose,
  onConfirm,
  subtotal,
  deliveryFee = 0,
  discount = 0,
  totalItems,
}: Props) {
  // ✅ default choice = card
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");

  // ✅ close on ESC
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const total = subtotal + deliveryFee - discount;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999,
        display: "grid",
        placeItems: "center",
        padding: 16,
        background: "rgba(0,0,0,0.35)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(520px, 92vw)",
          borderRadius: 18,
          background: "#fff",
          border: "1px solid #e5e7eb",
          boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
          overflow: "hidden",
        }}
      >
        {/* header */}
        <div
          style={{
            padding: "14px 16px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontWeight: 900, fontSize: 16 }}>Order Summary</div>

          <button
            onClick={onClose}
            style={{
              border: "1px solid #e5e7eb",
              background: "#fff",
              width: 36,
              height: 36,
              borderRadius: 12,
              cursor: "pointer",
              fontWeight: 900,
            }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* content */}
        <div style={{ padding: "14px 16px" }}>
          <div
            style={{
              fontSize: 13,
              color: "#6b7280",
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            Review totals and choose payment method.
          </div>

          <SummaryRow label="Subtotal" value={currencyFormat(subtotal)} />

          <SummaryRow
            label="Discount"
            value={discount > 0 ? `-${currencyFormat(discount)}` : "-$0.00"}
            valueColor="#16a34a"
          />

          <SummaryRow label="Delivery fee" value={currencyFormat(deliveryFee)} />

          <div style={{ height: 1, background: "#e5e7eb", margin: "12px 0" }} />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <div style={{ fontWeight: 900, fontSize: 14 }}>Total</div>
            <div style={{ fontWeight: 900, fontSize: 18 }}>
              {currencyFormat(total)}
            </div>
          </div>

          <div
            style={{
              fontSize: 12,
              color: "#374151",
              fontWeight: 700,
              marginTop: 6,
            }}
          >
            {totalItems} item{totalItems === 1 ? "" : "s"}
          </div>

          {/* ✅ PAYMENT METHOD */}
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 8 }}>
              Payment Method
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <PaymentButton
                active={paymentMethod === "card"}
                label="Card"
                onClick={() => setPaymentMethod("card")}
              />

              <PaymentButton
                active={paymentMethod === "cash"}
                label="Cash / Check"
                onClick={() => setPaymentMethod("cash")}
              />
            </div>
          </div>

          {/* actions */}
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                height: 44,
                borderRadius: 14,
                border: "1px solid #e5e7eb",
                background: "#fff",
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              Back
            </button>

            <button
              onClick={() => onConfirm(paymentMethod)}
              style={{
                flex: 1.2,
                height: 44,
                borderRadius: 14,
                border: "none",
                background: "linear-gradient(135deg, #ef4444, #dc2626)",
                color: "#fff",
                fontWeight: 900,
                cursor: "pointer",
                boxShadow: "0 10px 20px rgba(239,68,68,0.30)",
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
      }}
    >
      <div style={{ fontSize: 13, color: "#6b7280", fontWeight: 800 }}>
        {label}
      </div>
      <div
        style={{
          fontSize: 14,
          fontWeight: 900,
          color: valueColor ?? "#111827",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function PaymentButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        height: 44,
        borderRadius: 14,

        // ✅ selected: light red background + solid red border
        border: active ? "2px solid #ef4444" : "1px solid #e5e7eb",
        background: active ? "rgba(239,68,68,0.10)" : "#fff",

        color: "#111827",
        fontWeight: 900,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}
