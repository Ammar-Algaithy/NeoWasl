import {
  fetchBaseQuery,
  type BaseQueryApi,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { startLoading, stopLoading } from "../layout/uiSlice";
import { toast } from "react-toastify";
import { router } from "../routes/Routes";

const customBaseQuery = fetchBaseQuery({
  baseUrl: "https://localhost:5001/api",
  credentials: "include",
});

const sleep = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));

type ErrorResponse =
  | string
  | { title: string }
  | { errors: Record<string, string[]> };

// For PARSING_ERROR shape
type ParsingError = FetchBaseQueryError & {
  status: "PARSING_ERROR";
  originalStatus: number;
  data: string;
  error: string;
};

function isParsingError(err: FetchBaseQueryError): err is ParsingError {
  return err.status === "PARSING_ERROR";
}

function getHttpStatus(err: FetchBaseQueryError): number | "FETCH_ERROR" | "TIMEOUT_ERROR" | "CUSTOM_ERROR" {
  if (isParsingError(err)) return err.originalStatus;
  return err.status;
}

function asErrorResponse(data: unknown): ErrorResponse {
  // If API returns plain string
  if (typeof data === "string") return data;

  // If API returns { title: string }
  if (
    data &&
    typeof data === "object" &&
    "title" in data &&
    typeof (data as { title: unknown }).title === "string"
  ) {
    return { title: (data as { title: string }).title };
  }

  // If API returns { errors: { field: string[] } }
  if (
    data &&
    typeof data === "object" &&
    "errors" in data &&
    typeof (data as { errors: unknown }).errors === "object" &&
    (data as { errors: unknown }).errors !== null
  ) {
    return { errors: (data as { errors: Record<string, string[]> }).errors };
  }

  // Fallback
  return { title: "An unexpected error occurred" };
}

export const baseQueryWithErrorHandling = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: object
) => {
  api.dispatch(startLoading());

  // Optional delay (you can remove if you hate the "reload" feel)
  await sleep(250);

  const result = await customBaseQuery(args, api, extraOptions);

  api.dispatch(stopLoading());

  if (result.error) {
    const status = getHttpStatus(result.error);
    const responseData = asErrorResponse(result.error.data);

    switch (status) {
      case 400: {
        if (typeof responseData === "string") {
          toast.error(responseData);
        } else if ("errors" in responseData) {
          // Throw so your UI can show validation errors if you want
          const msg = Object.values(responseData.errors).flat().join(", ");
          throw new Error(msg);
        } else {
          toast.error(responseData.title);
        }
        break;
      }

      case 401: {
        if (typeof responseData === "object" && "title" in responseData) {
          console.log(responseData)
        } else {
          toast.error("Unauthorized");
        }
        break;
      }

      case 404: {
        router.navigate("/not-found");
        break;
      }

      case 500: {
        if (typeof responseData === "object" && "title" in responseData) {
          router.navigate("/server-error", { state: { error: responseData } });
        } else {
          toast.error("Internal Server Error");
        }
        break;
      }

      case "FETCH_ERROR": {
        toast.error("Network error. Please check your connection.");
        break;
      }

      case "TIMEOUT_ERROR": {
        toast.error("Request timed out.");
        break;
      }

      default:
        // do nothing
        break;
    }
  }

  return result;
};
