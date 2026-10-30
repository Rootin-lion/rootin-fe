export const SESSION_TOKEN_COOKIE = "sessionToken";

export const SESSION_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 60 * 60,
  path: "/",
} as const;
