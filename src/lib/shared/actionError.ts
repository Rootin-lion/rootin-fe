import "server-only";
import { redirectOnSessionExpired } from "@/lib/auth/redirectOnSessionExpired";
import { apiError } from "./apiError";

export async function actionError(error: unknown, message: string) {
  await redirectOnSessionExpired(error);
  return apiError(error, message);
}
