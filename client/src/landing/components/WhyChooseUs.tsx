import { Box, Typography } from "@mui/material";

export default function WhyChooseSection() {
  const features = [
    {
      title: "Wide Selection",
      description: "Find drinks, snacks, and everyday essentials in one place.",
      icon: "🛒",
    },
    {
      title: "Fast Delivery",
      description: "Quick and reliable delivery straight to your store.",
      icon: "🚚",
    },
    {
      title: "Simple to Use",
      description: "Enjoy a user-friendly platform for easy shopping.",
      icon: "👍",
    },
  ];

  return (
    <Box
      component="section"
      sx={{
        bgcolor: "transparent",
        p: 1, // p-6
        borderRadius: 1, // rounded-3xl
        boxShadow: 2, // shadow-lg
        overflow: "hidden",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          mb: 3,
          textAlign: "center",
          color: "#ef4444", // text-red-500
        }}
      >
        Why Choose{" "}
        <Box component="span" sx={{ color: "#000" }}>
          Neo
        </Box>
        Wasl?
      </Typography>

      {/* Track wrapper */}
      <Box
        sx={{
          position: "relative",
          display: "flex",
          overflowX: "hidden",
          pb: 2
        }}
      >
        {/* Animated track */}
        <Box
          sx={{
            display: "flex",
            width: "max-content",
            animation: "marquee 18s linear infinite",
            "@keyframes marquee": {
              "0%": { transform: "translateX(0)" },
              "100%": { transform: "translateX(-50%)" },
            },
          }}
        >
          {[...features, ...features].map((feature, index) => (
            <Box
              key={index}
              sx={{
                flex: "0 0 auto",
                width: 256, // w-64
                p: 2, // p-4
                bgcolor: "#f3f4f6", // bg-gray-100
                borderRadius: 2, // rounded-lg
                boxShadow: 3, // shadow-md
                textAlign: "center",
                mx: 2, // mx-4
              }}
            >
              <Box sx={{ fontSize: 48, mb: 2 }}>{feature.icon}</Box>

              <Typography sx={{ fontWeight: 700, fontSize: "1.125rem" }}>
                {feature.title}
              </Typography>

              <Typography
                sx={{
                  fontSize: "0.875rem",
                  color: "#4b5563", // text-gray-600
                  mt: 1,
                }}
              >
                {feature.description}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
