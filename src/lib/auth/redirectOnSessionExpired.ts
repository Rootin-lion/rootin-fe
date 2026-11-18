import "server-only";
import { redirect, RedirectType, unstable_rethrow } from "next/navigation";
import { clearSessionCookies } from "./sessionCookies";
import { SessionExpiredError } from "./SessionExpiredError";

export async function redirectOnSessionExpired(error: unknown) {
  unstable_rethrow(error);
  if (!(error instanceof SessionExpiredError)) return;

  await clearSessionCookies();
  redirect("/login", RedirectType.replace);
}
