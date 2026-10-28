import type { ApiError } from "@/types/api/error";

export const isSilentRankingError = (error: ApiError) =>
  error.status === 400 || error.code === "C400" || error.code === "C400-3";
