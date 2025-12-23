import { Alert, AlertTitle, Button, ButtonGroup, Container, List, ListItem, Typography } from "@mui/material";
import {
  useLazyGet400ErrorQuery,
  useLazyGet401ErrorQuery,
  useLazyGet404ErrorQuery,
  useLazyGet500ErrorQuery,
  useLazyGetValidationErrorQuery,
} from "./errorApi";
import { useState } from "react";

export default function AboutPage() {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const [trigger400Error] = useLazyGet400ErrorQuery();
  const [trigger401Error] = useLazyGet401ErrorQuery();
  const [trigger404Error] = useLazyGet404ErrorQuery();
  const [trigger500Error] = useLazyGet500ErrorQuery();
  const [triggerValidationsError] = useLazyGetValidationErrorQuery();

  const getValidationError = async () => {
    try {
      await triggerValidationsError().unwrap();
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'message' in error && 
        typeof (error as {message: string}).message === 'string') {
        const errorArray = (error as {message: string }).message.split(', ');
        setValidationErrors(errorArray);
      }
    }
  };

  return (
    <Container maxWidth="lg">
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

        <Button
          variant="contained"
          onClick={getValidationError}
        >
          Test validation error
        </Button>
      </ButtonGroup>
      {validationErrors.length > 0 && (
        <Alert severity="error">
          <AlertTitle>Validation Errors</AlertTitle>
          <List> 
            {validationErrors.map(err=> (
              <ListItem key={err}>
                {err}
              </ListItem>
              ))}
          </List>
        </Alert>
      )}
    </Container>
  );
}
