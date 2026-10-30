export const MEMBER_SNAPSHOT_COOKIE = "memberSnapshot";

export const MEMBER_SNAPSHOT_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 60 * 60,
  path: "/",
} as const;
