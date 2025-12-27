import { useMemo, useState } from "react";
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
} from "@mui/material";
import { useLoginMutation } from "./accountApi"; // <-- adjust path if needed

type ApiErrorShape = {
  status?: number;
  data?: unknown;
  error?: string;
};

function getErrorMessage(err: unknown): string {
  // RTK Query often returns an object like: { status, data } OR { error }
  if (typeof err === "object" && err !== null) {
    const e = err as ApiErrorShape;

    // Common patterns coming from ASP.NET ProblemDetails
    if (typeof e.data === "object" && e.data !== null) {
      const dataObj = e.data as Record<string, unknown>;

      const title = dataObj["title"];
      if (typeof title === "string" && title.trim()) return title;

      const message = dataObj["message"];
      if (typeof message === "string" && message.trim()) return message;

      const detail = dataObj["detail"];
      if (typeof detail === "string" && detail.trim()) return detail;
    }

    if (typeof e.error === "string" && e.error.trim()) return e.error;
  }

  return "Login failed.";
}

export default function SignIn() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  // ✅ default empty
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login, { isLoading }] = useLoginMutation();

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const canSubmit = useMemo(
    () => email.trim().length > 0 && password.trim().length > 0 && !isLoading,
    [email, password, isLoading]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    try {
      await login({ email: email.trim(), password }).unwrap();
      navigate("/home"); // change as you want
    } catch (err: unknown) {
      setErrorMsg(getErrorMessage(err));
    }
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      sx={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f3f4f6",
        px: 2,
      }}
    >
      {/* Card */}
      <Box
        sx={{
          width: "100%",
          maxWidth: 384,
          bgcolor: "#fff",
          borderRadius: 1,
          boxShadow: "0 10px 15px rgba(0,0,0,0.10)",
          p: 3,
        }}
      >
        {/* Title */}
        <Typography
          sx={{
            fontSize: 30,
            fontWeight: 700,
            textAlign: "center",
            color: "#ef4444",
            mb: 3,
            lineHeight: 1.1,
          }}
        >
          <Box component="span" sx={{ color: "#000" }}>
            Neo
          </Box>
          Wasl
        </Typography>

        {/* Error */}
        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMsg}
          </Alert>
        )}

        {/* Form */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "grid", gap: 2 }}
        >
          {/* Email */}
          <Box>
            <Typography
              component="label"
              htmlFor="email"
              sx={{
                display: "block",
                fontSize: 14,
                fontWeight: 500,
                color: "#374151",
                mb: 0.75,
              }}
            >
              Email
            </Typography>

            <TextField
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              autoComplete="email"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                  "& fieldset": { borderColor: "#d1d5db" },
                  "&:hover fieldset": { borderColor: "#d1d5db" },
                  "&.Mui-focused fieldset": {
                    borderColor: "#ef4444",
                    borderWidth: 2,
                  },
                },
                "& .MuiOutlinedInput-input": {
                  padding: "12px 14px",
                  fontWeight: 600,
                  color: "#111827",
                },
              }}
            />
          </Box>

          {/* Password */}
          <Box>
            <Typography
              component="label"
              htmlFor="password"
              sx={{
                display: "block",
                fontSize: 14,
                fontWeight: 500,
                color: "#374151",
                mb: 0.75,
              }}
            >
              Password
            </Typography>

            <TextField
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              autoComplete="current-password"
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: 44,
                  borderRadius: 1,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                  "& fieldset": { borderColor: "#d1d5db" },
                  "&:hover fieldset": { borderColor: "#d1d5db" },
                  "&.Mui-focused fieldset": {
                    borderColor: "#ef4444",
                    borderWidth: 2,
                  },
                },
                "& input": {
                  padding: "12px 14px",
                  fontWeight: 600,
                  color: "#111827",
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      disableRipple
                      sx={{
                        minWidth: "auto",
                        p: 0,
                        mr: 0.5,
                        fontSize: 14,
                        fontWeight: 500,
                        color: "#9ca3af",
                        textTransform: "none",
                        "&:hover": {
                          bgcolor: "transparent",
                          color: "#9ca3af",
                        },
                      }}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Sign In button */}
          <Button
            type="submit"
            fullWidth
            disabled={!canSubmit}
            sx={{
              bgcolor: "#ef4444",
              color: "#fff",
              fontWeight: 600,
              height: 44,
              borderRadius: 1,
              boxShadow: "0 1px 2px rgba(0,0,0,0.10)",
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
                <CircularProgress size={18} color="inherit" />
                <span>Signing in…</span>
              </Box>
            ) : (
              "Sign In"
            )}
          </Button>
        </Box>

        {/* Forgot Password */}
        <Box sx={{ textAlign: "right", mt: 1 }}>
          <Link
            component={RouterLink}
            to="/forgot-password"
            underline="hover"
            sx={{ fontSize: 14, color: "#ef4444", fontWeight: 400 }}
          >
            Forgot Password?
          </Link>
        </Box>

        {/* Footer */}
        <Typography
          sx={{
            mt: 2,
            textAlign: "center",
            fontSize: 14,
            color: "#4b5563",
          }}
        >
          Don’t have an account?{" "}
          <Link
            component={RouterLink}
            to="/sign-up"
            underline="hover"
            sx={{ color: "#ef4444", fontWeight: 500 }}
          >
            Sign Up
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
