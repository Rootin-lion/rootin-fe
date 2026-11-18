import { isAxiosError } from "axios";
import { unstable_rethrow } from "next/navigation";
import { SessionExpiredError } from "@/lib/auth/SessionExpiredError";

export function apiError(error: unknown, message: string) {
  unstable_rethrow(error);

  if (error instanceof SessionExpiredError) {
    return {
      code: "UNAUTHENTICATED",
      message: error.message,
      status: 401,
    };
  }

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
