import { isAxiosError } from "axios";

export function apiError(error: unknown, message: string) {
  if (!isAxiosError(error)) {
    return {
      code: "UNKNOWN_ERROR",
      message: message,
    };
  }

  return {
    code: error.response?.data?.errorCode ?? "UNKNOWN_ERROR",
    message: error.response?.data?.message ?? message,
  };
}
