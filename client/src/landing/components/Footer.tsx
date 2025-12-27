export default function FooterSection() {
  return (
    <footer
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        backgroundColor: "#111827", // gray-900
        color: "#ffffff",
        padding: "12px 16px",
        textAlign: "center",
        zIndex: 1300,
      }}
    >
      <p style={{ margin: 0, fontSize: "0.875rem" }}>
        © {new Date().getFullYear()} NeoWasl. All rights reserved.
      </p>
    </footer>
  );
}
