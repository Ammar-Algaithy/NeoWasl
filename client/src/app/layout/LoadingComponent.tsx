import { Box, Typography, CircularProgress, keyframes } from "@mui/material";

const fade = keyframes`
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
`;

interface Props {
  message?: string;
}

export default function LoadingComponent({ message = "Loading" }: Props) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          px: 4,
          py: 5,
          borderRadius: 2,
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
        }}
      >
        {/* Spinner */}
        <Box sx={{ position: "relative" }}>
          <CircularProgress
            size={48}
            thickness={4}
            color="primary"
          />
        </Box>

        {/* Text */}
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            letterSpacing: 0.6,
            color: "text.secondary",
            animation: `${fade} 1.6s ease-in-out infinite`,
            textAlign: "center",
          }}
        >
          {message}
        </Typography>
      </Box>
    </Box>
  );
}
