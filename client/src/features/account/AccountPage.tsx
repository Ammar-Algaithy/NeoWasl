// src/features/account/AccountPage.tsx
import { useEffect, useMemo } from "react";
import type { JSX } from "react";
import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

import {
  Box,
  Container,
  Typography,
  IconButton as MuiIconButton,
  Chip,
  useTheme,
  alpha,
} from "@mui/material";

import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import GroupAddRoundedIcon from "@mui/icons-material/GroupAddRounded";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import {
  useUserInfoQuery,
  useGetAddressQuery,
} from "./accountApi"; // ✅ same folder
import type { AddressDto } from "./accountApi";
import BottomNav from "../../app/layout/BottomNav";

// -----------------------------
// Framer Variants
// -----------------------------
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const avatarVariants: Variants = {
  hidden: { scale: 0.6, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 180, damping: 20, delay: 0.2 },
  },
};

const textVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut", delay: 0.4 },
  },
};

const tileContainerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// -----------------------------
// Types (no "any")
// -----------------------------
type RtkqBaseError = {
  status?: number | "FETCH_ERROR" | "PARSING_ERROR" | "TIMEOUT_ERROR" | "CUSTOM_ERROR";
  originalStatus?: number;
  data?: unknown;
  error?: string;
};

// Must match what your API returns
type AccountType = 0 | 1 | 7; // Public=0, Business=1, Admin=7
type Tier = 3 | 2 | 1 | 0; // Bronze=3, Silver=2, Gold=1, Platinum=0

type ShippingAddress = {
  fullName: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber?: string | null;
};

type AccountUserInfo = {
  id: string;
  email: string;
  userName: string;

  accountType: AccountType;
  taxId?: string | null;
  businessName?: string | null;
  businessType?: string | null;
  deliveryNotes?: string | null;
  tier: Tier;
  extras?: string[] | null;

  roles: string[];
  shippingAddress?: ShippingAddress | null;
};

function isUnauthorized(err: unknown): boolean {
  const e = err as RtkqBaseError | undefined;
  const status = e?.status ?? e?.originalStatus;
  return status === 401;
}

function formatStoreAddress(a: AddressDto | ShippingAddress | null | undefined): string | undefined {
  if (!a) return undefined;

  const line1 = "line1" in a ? a.line1 : undefined;
  const line2 = "line2" in a ? a.line2 : undefined;
  const city = "city" in a ? a.city : undefined;
  const state = "state" in a ? a.state : undefined;
  const postalCode = "postalCode" in a ? a.postalCode : undefined;
  const country = "country" in a ? a.country : undefined;

  const parts = [
    line1,
    line2 ?? undefined,
    [city, state, postalCode].filter(Boolean).join(", "),
    country,
  ]
    .map((x) => (x ?? "").trim())
    .filter(Boolean);

  return parts.length ? parts.join(" • ") : undefined;
}


function accountTypeLabel(t: AccountType | undefined): string {
  switch (t) {
    case 1:
      return "Business";
    case 7:
      return "Admin";
    case 0:
    default:
      return "Public";
  }
}

function tierLabel(t: Tier | undefined): string {
  switch (t) {
    case 0:
      return "Platinum";
    case 1:
      return "Gold";
    case 2:
      return "Silver";
    case 3:
    default:
      return "Bronze";
  }
}

function tierChipStyles(t: Tier | undefined) {
  switch (t) {
    case 0:
      return { bgcolor: "#111827", color: "#fff" }; // platinum
    case 1:
      return { bgcolor: "#FEF3C7", color: "#92400E" }; // gold-ish
    case 2:
      return { bgcolor: "#E5E7EB", color: "#111827" }; // silver-ish
    case 3:
    default:
      return { bgcolor: "#FCE7F3", color: "#9D174D" }; // bronze-ish (pink)
  }
}

// -----------------------------
// Motion wrappers (no deprecated motion())
// -----------------------------
const MotionMuiIconButtonBase = motion.create(MuiIconButton);

function MotionMuiIconButton({
  onClick,
  icon,
  label,
}: {
  onClick: () => void;
  icon: JSX.Element;
  label: string;
}) {
  return (
    <MotionMuiIconButtonBase
      aria-label={label}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      sx={{
        width: 40,
        height: 40,
        borderRadius: "999px",
        color: "#64748b",
        "&:hover": { bgcolor: "#f1f5f9", color: "#1f2937" },
      }}
    >
      {icon}
    </MotionMuiIconButtonBase>
  );
}

// -----------------------------
// Page
// -----------------------------
export default function AccountPage() {
  const navigate = useNavigate();
  const theme = useTheme();

  // Match your real layout heights
  const HEADER_H = 86;
  const BOTTOM_NAV_H = 78;

  // 🔒 Lock page scroll while mounted
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

  const {
    data: userRaw,
    isLoading: userLoading,
    isError: userIsError,
    error: userError,
  } = useUserInfoQuery();

  const {
    data: address,
    isLoading: addressLoading,
    isError: addressIsError,
    error: addressError,
  } = useGetAddressQuery();

  // Redirect if not authenticated
  useEffect(() => {
    document.title = "My Account | NeoWasl";
    if (userIsError && isUnauthorized(userError)) {
      navigate("/sign-in", { replace: true });
    }
  }, [userIsError, userError, navigate]);

  // Your API returns rich user-info now (based on your console log)
  const user = userRaw as AccountUserInfo | undefined;

  // Account type switching
  const isBusiness = user?.accountType === 1 || user?.accountType === 7; // treat Admin as Business UI superset
  const isAdmin = user?.accountType === 7;

  // Data sources:
  // - Prefer user.shippingAddress when available (it has fullName too)
  // - Fall back to address endpoint
  const effectiveAddress = (user?.shippingAddress ?? address ?? null) as
    | ShippingAddress
    | AddressDto
    | null;

  const ownerName =
    ("fullName" in (effectiveAddress ?? {}) && effectiveAddress
      ? (effectiveAddress as ShippingAddress | AddressDto).fullName
      : undefined) || (isBusiness ? user?.businessName ?? "Business Account" : "Public User");

  const email = user?.email || "";
  const storeAddress = formatStoreAddress(effectiveAddress);
  const phoneNumber =
    effectiveAddress && "phoneNumber" in effectiveAddress
      ? (effectiveAddress.phoneNumber ?? undefined)
      : undefined;

  // Business-only fields
  const businessName = user?.businessName ?? undefined;
  const taxId = user?.taxId ?? undefined;
  const businessType = user?.businessType ?? undefined;
  const deliveryNotes = user?.deliveryNotes ?? undefined;
  const tier = user?.tier;

  const initials = useMemo(() => {
    const s = (ownerName || "").trim();
    const first = s.charAt(0);
    return first ? first.toUpperCase() : "👤";
  }, [ownerName]);

  const messageTitle =
    userLoading || addressLoading ? "Loading messages..." : "No new messages";




  // Palette
  const pageBg =
    theme.palette.mode === "dark"
      ? theme.palette.background.default
      : "#f8fafc"; // slate-50
  const cardBorder = alpha(theme.palette.common.black, 0.06);

  const loadFailed =
    (userIsError && !isUnauthorized(userError)) ||
    (addressIsError && !isUnauthorized(addressError));

  type HasFullName = { fullName: string };

function hasFullName(x: unknown): x is HasFullName {
  return (
    typeof x === "object" &&
    x !== null &&
    "fullName" in x &&
    typeof (x as { fullName?: unknown }).fullName === "string"
  );
}

function getFullNameFromAddress(a: AddressDto | ShippingAddress | null | undefined): string | undefined {
  if (!a) return undefined;
  return hasFullName(a) ? a.fullName : undefined;
}


  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        bgcolor: pageBg,
        overflow: "hidden",
        touchAction: "none",
      }}
    >
      {/* Header */}
      <Box
        component={motion.header}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          bgcolor: alpha(theme.palette.common.white, 0.8),
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          boxShadow: "0 1px 0 rgba(15, 23, 42, 0.06)",
        }}
      >
        <Container maxWidth="sm" sx={{ py: 2, textAlign: "center" }}>
          <Typography
            sx={{
              fontSize: { xs: 22, sm: 28 },
              fontWeight: 900,
              color: "#0f172a",
              lineHeight: 1.1,
              letterSpacing: -0.3,
            }}
          >
            My{" "}
            <Box component="span" sx={{ color: "#e11d48" }}>
              Account
            </Box>
          </Typography>

          <Box sx={{ mt: 0.75, display: "flex", justifyContent: "center", gap: 1, flexWrap: "wrap" }}>
            <Chip
              size="small"
              icon={<BadgeOutlinedIcon sx={{ fontSize: 16 }} />}
              label={accountTypeLabel(user?.accountType)}
              sx={{
                bgcolor: "#f1f5f9",
                color: "#0f172a",
                fontWeight: 800,
              }}
            />

            {isBusiness && (
              <Chip
                size="small"
                icon={<StarRoundedIcon sx={{ fontSize: 16 }} />}
                label={`Tier: ${tierLabel(tier)}`}
                sx={{
                  fontWeight: 900,
                  ...tierChipStyles(tier),
                }}
              />
            )}

            {isAdmin && (
              <Chip
                size="small"
                label="Admin"
                sx={{
                  bgcolor: "#111827",
                  color: "#fff",
                  fontWeight: 900,
                }}
              />
            )}
          </Box>

          <Typography sx={{ mt: 0.75, fontSize: 13, color: "#64748b" }}>
            {isBusiness ? "Manage your business profile, orders, and tools" : "Manage your profile, orders, and settings"}
          </Typography>
        </Container>
      </Box>

      {/* ✅ ONLY THIS AREA SCROLLS */}
      <Box
        sx={{
          position: "absolute",
          top: HEADER_H,
          left: 0,
          right: 0,
          bottom: BOTTOM_NAV_H,
          overflowY: "auto",
          overflowX: "hidden",
          WebkitOverflowScrolling: "touch",
          overscrollBehaviorY: "contain",
          px: 2,
          pt: 3,
          pb: 6,
          touchAction: "pan-y",
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Avatar Section */}
            <Box
              component={motion.section}
              initial="hidden"
              animate="visible"
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: 1,
              }}
            >
              <Box
                component={motion.div}
                variants={avatarVariants}
                sx={{
                  width: 112,
                  height: 112,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 36,
                  fontWeight: 900,
                  background: "linear-gradient(135deg, #f43f5e 0%, #dc2626 100%)",
                  boxShadow: "0 18px 30px rgba(244, 63, 94, 0.18)",
                  border: "4px solid #fff",
                }}
              >
                {initials}
              </Box>

              <Box component={motion.div} variants={textVariants}>
                <Typography
                  sx={{
                    fontSize: 22,
                    fontWeight: 900,
                    color: "#1f2937",
                    mt: 0.5,
                  }}
                >
                  {ownerName || (addressLoading ? "Loading..." : "NeoWasl User")}
                </Typography>

                <Typography sx={{ fontSize: 15, color: "#64748b" }}>
                  {email || (userLoading ? "Loading..." : "Not Set")}
                </Typography>
              </Box>
            </Box>

            {/* ✅ Account Info Card (always shown) */}
            <Box
              component={motion.section}
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              sx={{
                bgcolor: "#fff",
                borderRadius: 3,
                border: `1px solid ${cardBorder}`,
                boxShadow: "0 18px 40px rgba(15, 23, 42, 0.06)",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  px: 2.5,
                  py: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: `1px solid ${alpha("#0f172a", 0.06)}`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: 2,
                      bgcolor: "#f1f5f9",
                      display: "grid",
                      placeItems: "center",
                      color: "#0f172a",
                    }}
                  >
                    <BadgeOutlinedIcon />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 16, fontWeight: 900, color: "#1f2937", lineHeight: 1.1 }}>
                      Account Information
                    </Typography>
                    <Typography sx={{ fontSize: 12.5, color: "#64748b" }}>
                      {isBusiness ? "Business account details" : "Account Details"}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 1 }}>
                  <MotionMuiIconButton
                    label="Settings"
                    onClick={() => navigate("/settings")}
                    icon={<SettingsOutlinedIcon sx={{ fontSize: 20 }} />}
                  />
                  <MotionMuiIconButton
                    label="Edit Profile"
                    onClick={() => navigate("/edit-profile")}
                    icon={<EditOutlinedIcon sx={{ fontSize: 20 }} />}
                  />
                </Box>
              </Box>

              <Box sx={{ px: 2.5, py: 1 }}>
                <Field label="Full Name" value={getFullNameFromAddress(effectiveAddress)} />

                <Field label="Email Address" value={email || undefined} />
                <Field label="Phone Number" value={phoneNumber} />
                <Field label="Shipping Address" value={storeAddress} />

                {loadFailed && (
                  <Box sx={{ py: 2 }}>
                    <Typography sx={{ fontSize: 13, color: "#b91c1c", fontWeight: 700 }}>
                      Some account data failed to load.
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: "#64748b", mt: 0.5 }}>
                      {String(
                        (userError as RtkqBaseError | undefined)?.status ??
                          (addressError as RtkqBaseError | undefined)?.status ??
                          ""
                      )}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>

            {/* ✅ Business Card (ONLY for Business/Admin) */}
            {isBusiness && (
              <Box
                component={motion.section}
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                sx={{
                  bgcolor: "#fff",
                  borderRadius: 3,
                  border: `1px solid ${cardBorder}`,
                  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.06)",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    px: 2.5,
                    py: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: `1px solid ${alpha("#0f172a", 0.06)}`,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                    <Box
                      sx={{
                        width: 38,
                        height: 38,
                        borderRadius: 2,
                        bgcolor: "#f1f5f9",
                        display: "grid",
                        placeItems: "center",
                        color: "#0f172a",
                      }}
                    >
                      <StorefrontOutlinedIcon />
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: 16, fontWeight: 900, color: "#1f2937", lineHeight: 1.1 }}>
                        Business Information
                      </Typography>
                      <Typography sx={{ fontSize: 12.5, color: "#64748b" }}>
                        Visible only for business accounts
                      </Typography>
                    </Box>
                  </Box>

                  <Chip
                    size="small"
                    icon={<LocalOfferOutlinedIcon sx={{ fontSize: 16 }} />}
                    label={`Tier: ${tierLabel(tier)}`}
                    sx={{ fontWeight: 900, ...tierChipStyles(tier) }}
                  />
                </Box>

                <Box sx={{ px: 2.5, py: 1 }}>
                  <Field label="Business Name" value={businessName} />
                  <Field label="Tax ID" value={taxId} />
                  <Field label="Business Type" value={businessType} />
                  <Field label="Delivery Notes" value={deliveryNotes} />

                  <ExtrasField extras={user?.extras ?? null} />
                </Box>
              </Box>
            )}

            {/* Dashboard */}
            <Box
              component={motion.section}
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <Typography sx={{ fontSize: 18, fontWeight: 900, color: "#1f2937", mb: 1.5, ml: 0.5 }}>
                Dashboard
              </Typography>

              <Box
                component={motion.div}
                variants={tileContainerVariants}
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 2,
                }}
              >
                <DashboardTile
                  title={messageTitle}
                  description="Check updates from NeoWasl."
                  onClick={() => navigate("/notifications")}
                  icon={<MailOutlineOutlinedIcon sx={{ fontSize: 28, color: "#3b82f6" }} />}
                />

                <DashboardTile
                  title="Your Orders"
                  description="View all your past orders."
                  onClick={() => navigate("/orders")}
                  icon={<ReceiptLongOutlinedIcon sx={{ fontSize: 28, color: "#6366f1" }} />}
                />

                {/* Business-only tile example */}
                {isBusiness ? (
                  <DashboardTile
                    title="Business Savings"
                    description="Track negotiated deals and account savings."
                    onClick={() => navigate("/savings")}
                    icon={<SavingsOutlinedIcon sx={{ fontSize: 28, color: "#10b981" }} />}
                    tag="New"
                  />
                ) : (
                  <DashboardTile
                    title="My Savings"
                    description="Track your special deals."
                    onClick={() => navigate("/savings")}
                    icon={<SavingsOutlinedIcon sx={{ fontSize: 28, color: "#10b981" }} />}
                    tag="New"
                  />
                )}
              </Box>
            </Box>

            {/* Actions */}
            <Box
              component={motion.section}
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              sx={{ display: "flex", flexDirection: "column", gap: 1.25, pt: 1 }}
            >
              <ActionRow
                label="Contact Support"
                icon={<SupportAgentRoundedIcon sx={{ fontSize: 24 }} />}
                onClick={() => navigate("/support")}
              />
              <ActionRow
                label="About Us"
                icon={<InfoOutlinedIcon sx={{ fontSize: 24 }} />}
                onClick={() => navigate("/about")}
              />

              {/* Business-only actions */}
              {isBusiness && (
                <ActionRow
                  label="Referral Program"
                  icon={<GroupAddRoundedIcon sx={{ fontSize: 24 }} />}
                  onClick={() => navigate("/referral")}
                />
              )}
            </Box>

            <Box sx={{ height: 10 }} />
          </Box>
        </Container>
      </Box>

      <BottomNav children={undefined} />
    </Box>
  );
}

// -----------------------------
// Helpers
// -----------------------------
function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <Box
      sx={{
        py: 1.5,
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "170px 1fr" },
        gap: { xs: 0.5, sm: 2 },
        borderBottom: "1px solid",
        borderColor: alpha("#0f172a", 0.06),
        "&:last-of-type": { borderBottom: "none" },
      }}
    >
      <Typography sx={{ fontSize: 14.5, fontWeight: 800, color: "#64748b" }}>
        {label}
      </Typography>

      <Typography
        sx={{
          fontSize: 14.5,
          fontWeight: value ? 800 : 650,
          color: value ? "#0f172a" : "#94a3b8",
          fontStyle: value ? "normal" : "italic",
          wordBreak: "break-word",
        }}
      >
        {value || "Not Set"}
      </Typography>
    </Box>
  );
}

function ExtrasField({ extras }: { extras: string[] | null }) {
  if (!extras || extras.length === 0) {
    return <Field label="Extras" value={undefined} />;
  }

  return (
    <Box
      sx={{
        py: 1.5,
        borderBottom: "1px solid",
        borderColor: alpha("#0f172a", 0.06),
      }}
    >
      <Typography sx={{ fontSize: 14.5, fontWeight: 800, color: "#64748b", mb: 1 }}>
        Extras
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {extras.map((x) => (
          <Chip
            key={x}
            label={x}
            size="small"
            sx={{
              bgcolor: "#f1f5f9",
              color: "#0f172a",
              fontWeight: 800,
            }}
          />
        ))}
      </Box>
    </Box>
  );
}

function DashboardTile({
  title,
  description,
  onClick,
  icon,
  tag,
}: {
  title: string;
  description: string;
  onClick?: () => void;
  icon: JSX.Element;
  tag?: string;
}) {
  return (
    <Box
      component={motion.div}
      variants={sectionVariants}
      whileHover={{
        y: -5,
        boxShadow: "0px 10px 20px rgba(100, 116, 139, 0.12)",
      }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (!onClick) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      sx={{
        position: "relative",
        cursor: onClick ? "pointer" : "default",
        borderRadius: 3,
        bgcolor: "#fff",
        border: `1px solid ${alpha("#0f172a", 0.06)}`,
        boxShadow: "0 12px 30px rgba(15, 23, 42, 0.06)",
        p: 2.25,
        outline: "none",
        "&:focus-visible": {
          boxShadow: "0 0 0 3px rgba(244, 63, 94, 0.35)",
        },
        transition: "box-shadow 200ms ease",
      }}
    >
      {tag && (
        <Box
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            fontSize: 11,
            fontWeight: 900,
            bgcolor: "#d1fae5",
            color: "#065f46",
            px: 1.2,
            py: 0.6,
            borderRadius: 999,
            textTransform: "uppercase",
            letterSpacing: 0.6,
          }}
        >
          {tag}
        </Box>
      )}

      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
        <Box
          sx={{
            flexShrink: 0,
            bgcolor: "#f1f5f9",
            p: 1.5,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: 16, fontWeight: 900, color: "#0f172a", mb: 0.5 }}>
            {title}
          </Typography>
          <Typography sx={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>
            {description}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

function ActionRow({
  onClick,
  icon,
  label,
}: {
  onClick: () => void;
  icon: JSX.Element;
  label: string;
}) {
  return (
    <Box component={motion.div} whileHover={{ x: 2 }} sx={{ width: "100%" }}>
      <Box
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick();
          }
        }}
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          bgcolor: "#fff",
          border: `1px solid ${alpha("#0f172a", 0.12)}`,
          color: "#334155",
          p: 2,
          borderRadius: 2,
          boxShadow: "0 6px 18px rgba(15, 23, 42, 0.04)",
          cursor: "pointer",
          "&:hover": { color: "#0f172a", bgcolor: "#f9fafb" },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {icon}
          <Typography sx={{ fontSize: 15, fontWeight: 900 }}>
            {label}
          </Typography>
        </Box>

        <ChevronRightRoundedIcon sx={{ fontSize: 22, color: "#94a3b8" }} />
      </Box>
    </Box>
  );
}
