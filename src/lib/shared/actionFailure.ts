import type { ApiError } from "@/types/api/error";

export function actionFailure(error: ApiError) {
  return {
    ok: false,
    error,
  } as const;
}
