import { isAxiosError } from "axios";
import { unstable_rethrow } from "next/navigation";

export function apiError(error: unknown, message: string) {
  unstable_rethrow(error);

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
    status: error.response?.status,
  };
}
