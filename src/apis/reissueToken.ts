import "server-only";
import { getRefreshToken, type SessionToken } from "@/lib/auth/sessionToken";
import { apiPublic } from "./publicClient";

export const reissueToken = (refreshToken: string) =>
  apiPublic.post("/auth/reissue", undefined, {
    headers: {
      Cookie: `refreshToken=${refreshToken}`,
    },
  });

export async function reissueSessionToken(
  sessionToken: SessionToken,
): Promise<SessionToken> {
  const response = await reissueToken(sessionToken.refreshToken);
  const accessToken: unknown = response.data?.data?.accessToken;
  if (typeof accessToken !== "string" || !accessToken) {
    throw new Error("토큰 재발급 응답이 올바르지 않습니다.");
  }

  return {
    accessToken,
    refreshToken:
      getRefreshToken(response.headers["set-cookie"]) ??
      sessionToken.refreshToken,
  };
}
