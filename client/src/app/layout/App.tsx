import { useEffect, useMemo, useState } from "react";
import { Box, Container, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import type { Product } from "../models/product";
import Catalog from "../../features/catalog/Catalog";
import NavBar from "./NavBar";

function App() {
  const [products, setProducts] = useState<Product[]>([]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: "light",
          primary: { main: "#ef4444" }, // red-500

          // NeoWasl: clean black/white surfaces
          background: {
            default: "#ffffff",
            paper: "#ffffff",
          },

          text: {
            primary: "#0b0f14",   // near-black (better than pure #000)
            secondary: "#374151", // muted gray for descriptions
          },

          divider: "rgba(0,0,0,0.10)",
          action: {
            hover: "rgba(0,0,0,0.04)",
            selected: "rgba(0,0,0,0.06)",
          },
        },

        shape: { borderRadius: 14 },

        typography: {
          fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
          h5: { fontWeight: 800, letterSpacing: 0.2 },
          subtitle2: { fontWeight: 700, letterSpacing: 0.4 },
          button: { textTransform: "none", fontWeight: 700 },
        },

        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                backgroundColor: "#ffffff",
                color: "#0b0f14",
              },
              "::selection": {
                background: "rgba(239,68,68,0.22)",
              },
            },
          },

          MuiAppBar: {
            defaultProps: { elevation: 0 },
            styleOverrides: {
              root: {
                backgroundImage: "none",
                backgroundColor: "#ffffff",
                borderBottom: "1px solid rgba(0,0,0,0.10)",
                color: "#0b0f14",
              },
            },
          },

          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
              },
            },
          },

          MuiCard: {
            defaultProps: { elevation: 0 },
            styleOverrides: {
              root: {
                border: "1px solid rgba(0,0,0,0.10)",
                backgroundImage: "none",
              },
            },
          },

          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                minHeight: 44, // mobile-friendly tap target
              },
              contained: {
                boxShadow: "none",
              },
              outlined: {
                borderColor: "rgba(0,0,0,0.18)",
              },
            },
          },
        },
      }),
    []
  );

  useEffect(() => {
    fetch("https://localhost:5001/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* NavBar no longer receives theme toggle props */}
      <NavBar />

      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <Container maxWidth="lg" sx={{ mt: { xs: 10, sm: 12 }, pb: 4 }}>
          <Catalog products={products} />
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
