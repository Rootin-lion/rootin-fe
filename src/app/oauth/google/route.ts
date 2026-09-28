import {
  GOOGLE_STATE_COOKIE,
  GOOGLE_STATE_COOKIE_PATH,
} from "@/constants/oauth/oauth";
import { createOAuthBrowserResponse } from "@/lib/oauth/browserDebug";
import { maskOAuthSecret, sanitizeOAuthLogValue } from "@/lib/oauth/debug";
import { NextRequest } from "next/server";

export function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  const requestLog = {
    method: request.method,
    pathname: request.nextUrl.pathname,
    hasClientId: Boolean(clientId),
    redirectUri,
  };

  if (!clientId || !redirectUri) {
    return createOAuthBrowserResponse({
      logs: [
        {
          level: "info",
          label: "[OAuth][구글][시작 요청]",
          data: requestLog,
        },
        {
          level: "error",
          label: "[OAuth][구글][시작 응답]",
          data: {
            status: 500,
            data: { message: "구글 로그인 설정이 없습니다." },
          },
        },
      ],
    });
  }

  // 검증 state 생성
  const state = crypto.randomUUID();

  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("scope", "openid email profile");

  const response = createOAuthBrowserResponse({
    redirectTo: url,
    logs: [
      {
        level: "info",
        label: "[OAuth][구글][시작 요청]",
        data: requestLog,
      },
      {
        level: "info",
        label: "[OAuth][구글][시작 응답]",
        data: {
          status: 200,
          redirectTo: `${url.origin}${url.pathname}`,
          authorizationRequest: sanitizeOAuthLogValue(
            Object.fromEntries(url.searchParams.entries()),
          ),
          stateCookie: {
            name: GOOGLE_STATE_COOKIE,
            value: maskOAuthSecret(state),
            path: GOOGLE_STATE_COOKIE_PATH,
            maxAge: 60 * 5,
          },
        },
      },
    ],
  });

  response.cookies.set(GOOGLE_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: GOOGLE_STATE_COOKIE_PATH,
    maxAge: 60 * 5,
  });

  return response;
}
