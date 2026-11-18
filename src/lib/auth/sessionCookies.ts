import "server-only";
import { cookies } from "next/headers";
import {
  MEMBER_SNAPSHOT_COOKIE,
  MEMBER_SNAPSHOT_COOKIE_OPTIONS,
} from "@/constants/auth/memberSnapshotCookie";
import {
  SESSION_TOKEN_COOKIE,
  SESSION_TOKEN_COOKIE_OPTIONS,
} from "@/constants/auth/sessionTokenCookie";
import { parseSessionToken, type SessionToken } from "./sessionToken";

export async function getSessionToken() {
  return parseSessionToken((await cookies()).get(SESSION_TOKEN_COOKIE)?.value);
}

export async function renewSessionCookies(sessionToken: SessionToken) {
  const cookieStore = await cookies();
  const memberSnapshot = cookieStore.get(MEMBER_SNAPSHOT_COOKIE)?.value;
  cookieStore.set(
    SESSION_TOKEN_COOKIE,
    JSON.stringify(sessionToken),
    SESSION_TOKEN_COOKIE_OPTIONS,
  );
  if (memberSnapshot) {
    cookieStore.set(
      MEMBER_SNAPSHOT_COOKIE,
      memberSnapshot,
      MEMBER_SNAPSHOT_COOKIE_OPTIONS,
    );
  }
}

export async function clearSessionCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_TOKEN_COOKIE);
  cookieStore.delete(MEMBER_SNAPSHOT_COOKIE);
}
