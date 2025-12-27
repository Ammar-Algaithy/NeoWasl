import { useMemo, useState, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  InputAdornment,
  CircularProgress,
  Alert,
  IconButton,
  Divider,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useRegisterMutation } from "./accountApi";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

// --- Layout Constants ---
const HEADER_H = 64;
const BOTTOM_NAV_H = 78; // to avoid content being covered by bottom nav

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === "object" && error !== null && "status" in error;
}

function isSerializedError(error: unknown): error is SerializedError {
  return typeof error === "object" && error !== null && "message" in error;
}

type ValidationErrorsDictionary = Record<string, string[] | string>;

function normalizeToMessages(x: unknown): string[] {
  if (!x) return [];

  if (typeof x === "string") return [x.trim()].filter(Boolean);

  if (Array.isArray(x)) {
    return x
      .filter((v): v is string => typeof v === "string")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  if (typeof x === "object") {
    const obj = x as ValidationErrorsDictionary;
    const msgs: string[] = [];
    for (const k of Object.keys(obj)) {
      const v = obj[k];
      if (typeof v === "string") {
        const s = v.trim();
        if (s) msgs.push(s);
      } else if (Array.isArray(v)) {
        v.forEach((m) => {
          if (typeof m === "string") {
            const s = m.trim();
            if (s) msgs.push(s);
          }
        });
      }
    }
    return msgs;
  }

  return [];
}

function getErrorMessages(error: unknown): string[] {
  if (isFetchBaseQueryError(error)) {
    const data = error.data;

    if (typeof data === "string") {
      const s = data.trim();
      return s ? [s] : ["Registration failed. Please try again."];
    }

    if (data && typeof data === "object") {
      const d = data as {
        message?: unknown;
        errors?: unknown;
        title?: unknown;
        detail?: unknown;
      };

      if (typeof d.message === "string") {
        const parts = d.message
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        if (parts.length) return parts;
      }

      const modelErrors = normalizeToMessages(d.errors);
      if (modelErrors.length) return modelErrors;

      if (typeof d.detail === "string" && d.detail.trim()) return [d.detail.trim()];
      if (typeof d.title === "string" && d.title.trim()) return [d.title.trim()];
    }

    return ["Registration failed. Please try again."];
  }

  if (isSerializedError(error) && typeof error.message === "string") {
    const s = error.message.trim();
    return s ? [s] : ["Registration failed. Please try again."];
  }

  if (error instanceof Error && typeof error.message === "string") {
    const s = error.message.trim();
    return s ? [s] : ["Registration failed. Please try again."];
  }

  return ["Registration failed. Please try again."];
}

export default function Register() {
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  /**
   * ✅ IMPORTANT SCROLL FIX
   * - Do NOT set html overflow hidden (it can break scrolling after reload in some layouts)
   * - Only lock BODY scroll to prevent background scrolling
   * - Make this page a fixed full-screen scroll container (below in sx)
   */
  useEffect(() => {
    const body = document.body;

    const prevBodyOverflow = body.style.overflow;
    const prevBodyHeight = body.style.height;

    body.style.overflow = "hidden";
    body.style.height = "100%";

    return () => {
      body.style.overflow = prevBodyOverflow;
      body.style.height = prevBodyHeight;
    };
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // --- 1. Account Info ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // --- 2. Personal & Business ---
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // --- 3. Address Info ---
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("US");

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return Boolean(
      !isLoading &&
        email.trim() &&
        password.trim() &&
        confirmPassword.trim() &&
        fullName.trim() &&
        phoneNumber.trim() &&
        line1.trim() &&
        city.trim() &&
        state.trim() &&
        postalCode.trim() &&
        country.trim()
    );
  }, [
    isLoading,
    email,
    password,
    confirmPassword,
    fullName,
    phoneNumber,
    line1,
    city,
    state,
    postalCode,
    country,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    try {
      await register({
        email: email.trim(),
        password,
        fullName: fullName.trim(),
        businessName: businessName.trim() || undefined,
        shippingAddress: {
          fullName: fullName.trim(),
          line1: line1.trim(),
          line2: line2.trim() || undefined,
          city: city.trim(),
          state: state.trim(),
          postalCode: postalCode.trim(),
          country: country.trim(),
          phoneNumber: phoneNumber.trim(),
        },
      }).unwrap();

      navigate("/home");
    } catch (error: unknown) {
      const messages = getErrorMessages(error);
      setErrorMsg(messages.join("\n"));
    }
  };

  // Reusable Styles
  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 1,
      bgcolor: "#f9fafb",
      "& fieldset": { borderColor: "#e5e7eb" },
      "&:hover fieldset": { borderColor: "#d1d5db" },
      "&.Mui-focused": {
        bgcolor: "#fff",
        "& fieldset": { borderColor: "#ef4444", borderWidth: 2 },
      },
    },
    "& .MuiOutlinedInput-input": {
      padding: "10px 12px",
      fontWeight: 600,
      color: "#111827",
      fontSize: "0.95rem",
    },
  };

  const labelSx = {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#374151",
    mb: 0.5,
  };

  const gridItemSx = (span: number) => ({
    gridColumn: { xs: "span 12", sm: `span ${span}` },
  });

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      sx={{
        // ✅ Make THIS the scroll container (reliable after refresh)
        position: "fixed",
        inset: 0,
        overflowY: "auto",
        WebkitOverflowScrolling: "touch",
        overscrollBehaviorY: "contain",
        touchAction: "pan-y",

        bgcolor: "#f3f4f6",

        // avoid being hidden under your fixed header and bottom nav
        pt: `${HEADER_H + 24}px`,
        pb: `${BOTTOM_NAV_H + 24}px`,
        px: 2,

        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "100%",
          maxWidth: 600,
          bgcolor: "#fff",
          borderRadius: 2,
          boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
          p: { xs: 3, sm: 4 },
          mb: 2,
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            sx={{
              fontSize: 28,
              fontWeight: 800,
              color: "#ef4444",
              lineHeight: 1,
              mb: 1,
            }}
          >
            <span style={{ color: "#111827" }}>Neo</span>Wasl
          </Typography>
          <Typography sx={{ fontSize: 14, color: "#6b7280" }}>
            Create your account & profile
          </Typography>
        </Box>

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 3, whiteSpace: "pre-line" }}>
            {errorMsg}
          </Alert>
        )}

        {/* --- SECTION 1: Credentials --- */}
        <Typography variant="subtitle2" sx={{ color: "#ef4444", fontWeight: 700, mb: 2 }}>
          ACCOUNT CREDENTIALS
        </Typography>

        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 2, mb: 3 }}>
          <Box sx={gridItemSx(12)}>
            <Typography component="label" sx={labelSx}>
              Email Address
            </Typography>
            <TextField
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              placeholder="you@example.com"
              sx={inputSx}
            />
          </Box>

          <Box sx={gridItemSx(6)}>
            <Typography component="label" sx={labelSx}>
              Password
            </Typography>
            <TextField
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              placeholder="••••••••"
              sx={inputSx}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowPassword((s) => !s)}>
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box sx={gridItemSx(6)}>
            <Typography component="label" sx={labelSx}>
              Confirm Password
            </Typography>
            <TextField
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              required
              placeholder="••••••••"
              sx={inputSx}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowConfirmPassword((s) => !s)}>
                      {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>

        <Divider sx={{ mb: 3, opacity: 0.6 }} />

        {/* --- SECTION 2: Personal Details --- */}
        <Typography variant="subtitle2" sx={{ color: "#ef4444", fontWeight: 700, mb: 2 }}>
          PERSONAL DETAILS
        </Typography>

        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 2, mb: 3 }}>
          <Box sx={gridItemSx(6)}>
            <Typography component="label" sx={labelSx}>
              Full Name
            </Typography>
            <TextField
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              fullWidth
              required
              placeholder="John Doe"
              sx={inputSx}
            />
          </Box>

          <Box sx={gridItemSx(6)}>
            <Typography component="label" sx={labelSx}>
              Phone Number
            </Typography>
            <TextField
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              fullWidth
              required
              placeholder="(555) 123-4567"
              sx={inputSx}
            />
          </Box>

          <Box sx={gridItemSx(12)}>
            <Typography component="label" sx={labelSx}>
              Business Name (Optional)
            </Typography>
            <TextField
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              fullWidth
              placeholder="NeoWasl LLC"
              sx={inputSx}
            />
          </Box>
        </Box>

        <Divider sx={{ mb: 3, opacity: 0.6 }} />

        {/* --- SECTION 3: Shipping Address --- */}
        <Typography variant="subtitle2" sx={{ color: "#ef4444", fontWeight: 700, mb: 2 }}>
          SHIPPING ADDRESS
        </Typography>

        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 2 }}>
          <Box sx={gridItemSx(12)}>
            <Typography component="label" sx={labelSx}>
              Address Line 1
            </Typography>
            <TextField
              value={line1}
              onChange={(e) => setLine1(e.target.value)}
              fullWidth
              required
              placeholder="123 Market St"
              sx={inputSx}
            />
          </Box>

          <Box sx={gridItemSx(12)}>
            <Typography component="label" sx={labelSx}>
              Address Line 2 (Optional)
            </Typography>
            <TextField
              value={line2}
              onChange={(e) => setLine2(e.target.value)}
              fullWidth
              placeholder="Apt, Suite, Floor"
              sx={inputSx}
            />
          </Box>

          <Box sx={gridItemSx(6)}>
            <Typography component="label" sx={labelSx}>
              City
            </Typography>
            <TextField
              value={city}
              onChange={(e) => setCity(e.target.value)}
              fullWidth
              required
              placeholder="New York"
              sx={inputSx}
            />
          </Box>

          <Box sx={gridItemSx(6)}>
            <Typography component="label" sx={labelSx}>
              State / Province
            </Typography>
            <TextField
              value={state}
              onChange={(e) => setState(e.target.value)}
              fullWidth
              required
              placeholder="NY"
              sx={inputSx}
            />
          </Box>

          <Box sx={gridItemSx(6)}>
            <Typography component="label" sx={labelSx}>
              Zip / Postal Code
            </Typography>
            <TextField
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              fullWidth
              required
              placeholder="10001"
              sx={inputSx}
            />
          </Box>

          <Box sx={gridItemSx(6)}>
            <Typography component="label" sx={labelSx}>
              Country
            </Typography>
            <TextField
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              fullWidth
              required
              placeholder="US"
              sx={inputSx}
            />
          </Box>
        </Box>

        {/* --- Submit --- */}
        <Button
          type="submit"
          fullWidth
          disabled={!canSubmit}
          sx={{
            mt: 4,
            bgcolor: "#ef4444",
            color: "#fff",
            fontWeight: 700,
            fontSize: "1rem",
            height: 48,
            borderRadius: 1.5,
            boxShadow: "0 4px 12px rgba(239, 68, 68, 0.2)",
            textTransform: "none",
            "&:hover": { bgcolor: "#dc2626" },
            "&.Mui-disabled": {
              bgcolor: "#fca5a5",
              color: "#fff",
            },
          }}
        >
          {isLoading ? (
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={20} color="inherit" />
              <span>Registering...</span>
            </Box>
          ) : (
            "Create Account"
          )}
        </Button>

        {/* Footer */}
        <Typography sx={{ mt: 3, textAlign: "center", fontSize: 14, color: "#4b5563" }}>
          Already have an account?{" "}
          <Link
            component={RouterLink}
            to="/sign-in"
            underline="hover"
            sx={{ color: "#ef4444", fontWeight: 600 }}
          >
            Sign In
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
