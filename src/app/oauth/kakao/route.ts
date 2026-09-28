import {
  KAKAO_STATE_COOKIE,
  KAKAO_STATE_COOKIE_PATH,
} from "@/constants/oauth/oauth";
import { createOAuthBrowserResponse } from "@/lib/oauth/browserDebug";
import { maskOAuthSecret, sanitizeOAuthLogValue } from "@/lib/oauth/debug";
import { NextRequest } from "next/server";

export function GET(request: NextRequest) {
  const clientId = process.env.KAKAO_CLIENT_ID;
  const redirectUri = process.env.KAKAO_REDIRECT_URI;

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
          label: "[OAuth][카카오][시작 요청]",
          data: requestLog,
        },
        {
          level: "error",
          label: "[OAuth][카카오][시작 응답]",
          data: {
            status: 500,
            data: { message: "카카오 로그인 설정이 없습니다." },
          },
        },
      ],
    });
  }

  // 검증 state 생성
  const stata = crypto.randomUUID();

  const url = new URL("https://kauth.kakao.com/oauth/authorize");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("state", stata);

  const response = createOAuthBrowserResponse({
    redirectTo: url,
    logs: [
      {
        level: "info",
        label: "[OAuth][카카오][시작 요청]",
        data: requestLog,
      },
      {
        level: "info",
        label: "[OAuth][카카오][시작 응답]",
        data: {
          status: 200,
          redirectTo: `${url.origin}${url.pathname}`,
          authorizationRequest: sanitizeOAuthLogValue(
            Object.fromEntries(url.searchParams.entries()),
          ),
          stateCookie: {
            name: KAKAO_STATE_COOKIE,
            value: maskOAuthSecret(stata),
            path: KAKAO_STATE_COOKIE_PATH,
            maxAge: 60 * 5,
          },
        },
      },
    ],
  });

  // state 쿠키 저장
  response.cookies.set(KAKAO_STATE_COOKIE, stata, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: KAKAO_STATE_COOKIE_PATH,
    maxAge: 60 * 5,
  });
  response.headers.set("Cache-Control", "no-store");

  return response;
}
