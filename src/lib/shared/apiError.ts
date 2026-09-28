import { isAxiosError } from "axios";

export function apiError(error: unknown, message: string) {
  if (!isAxiosError(error)) {
    return {
      code: "UNKNOWN_ERROR",
      message: message,
    };
  }

  const responseData = error.response?.data;

  return {
    code:
      responseData?.error?.code ?? responseData?.errorCode ?? "UNKNOWN_ERROR",
    message: responseData?.error?.message ?? responseData?.message ?? message,
  };
}
