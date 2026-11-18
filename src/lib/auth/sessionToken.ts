export interface SessionToken {
  accessToken: string;
  refreshToken: string;
}

export function parseSessionToken(
  value: string | undefined,
): SessionToken | null {
  if (!value) return null;

  try {
    const parsed: unknown = JSON.parse(value);
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("accessToken" in parsed) ||
      !("refreshToken" in parsed) ||
      typeof parsed.accessToken !== "string" ||
      typeof parsed.refreshToken !== "string" ||
      !parsed.accessToken ||
      !parsed.refreshToken
    ) {
      return null;
    }

    return {
      accessToken: parsed.accessToken,
      refreshToken: parsed.refreshToken,
    };
  } catch {
    return null;
  }
}

export function getRefreshToken(setCookie: string | string[] | undefined) {
  const responseCookies = Array.isArray(setCookie)
    ? setCookie
    : setCookie
      ? [setCookie]
      : [];
  const refreshCookie = responseCookies.find((cookie) =>
    cookie.startsWith("refreshToken="),
  );

  return refreshCookie?.split(";", 1)[0].slice("refreshToken=".length);
}
