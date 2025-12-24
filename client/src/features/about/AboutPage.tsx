import { useEffect, useState } from "react";
import {
  Alert,
  AlertTitle,
  Button,
  ButtonGroup,
  Container,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import {
  useLazyGet400ErrorQuery,
  useLazyGet401ErrorQuery,
  useLazyGet404ErrorQuery,
  useLazyGet500ErrorQuery,
  useLazyGetValidationErrorQuery,
} from "./errorApi";

export default function AboutPage() {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const [trigger400Error] = useLazyGet400ErrorQuery();
  const [trigger401Error] = useLazyGet401ErrorQuery();
  const [trigger404Error] = useLazyGet404ErrorQuery();
  const [trigger500Error] = useLazyGet500ErrorQuery();
  const [triggerValidationsError] = useLazyGetValidationErrorQuery();

  // Match your real layout heights
  const HEADER_H = 64;
  const BOTTOM_NAV_H = 78;

  // 🔒 Lock page scroll while this page is mounted
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

  const getValidationError = async () => {
    try {
      await triggerValidationsError().unwrap();
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "message" in error &&
        typeof (error as { message: string }).message === "string"
      ) {
        const errorArray = (error as { message: string }).message.split(", ");
        setValidationErrors(errorArray);
      }
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#fff",
        overflow: "hidden",

        // ✅ Prevent swipe scroll everywhere by default
        touchAction: "none",
      }}
    >
      {/* ✅ ONLY THIS AREA SCROLLS */}
      <div
        style={{
          position: "absolute",
          top: HEADER_H,
          left: 0,
          right: 0,
          bottom: BOTTOM_NAV_H,

          overflowY: "auto",
          overflowX: "hidden",
          WebkitOverflowScrolling: "touch",
          overscrollBehaviorY: "contain",

          padding: "12px 14px",

          // ✅ Allow touch scrolling ONLY here
          touchAction: "pan-y",
        }}
      >
        <Container maxWidth="lg" sx={{ pb: 2 }}>
          <Typography variant="h4" gutterBottom>
            Errors for testing
          </Typography>

          <ButtonGroup fullWidth>
            <Button
              variant="contained"
              onClick={() => trigger400Error().unwrap().catch(console.log)}
            >
              Test 400 error
            </Button>

            <Button
              variant="contained"
              onClick={() => trigger401Error().unwrap().catch(console.log)}
            >
              Test 401 error
            </Button>

            <Button
              variant="contained"
              onClick={() => trigger404Error().unwrap().catch(console.log)}
            >
              Test 404 error
            </Button>

            <Button
              variant="contained"
              onClick={() => trigger500Error().unwrap().catch(console.log)}
            >
              Test 500 error
            </Button>

            <Button variant="contained" onClick={getValidationError}>
              Test validation error
            </Button>
          </ButtonGroup>

          {validationErrors.length > 0 && (
            <Alert severity="error" sx={{ mt: 2 }}>
              <AlertTitle>Validation Errors</AlertTitle>
              <List>
                {validationErrors.map((err) => (
                  <ListItem key={err}>{err}</ListItem>
                ))}
              </List>
            </Alert>
          )}
        </Container>
      </div>
    </div>
  );
}
