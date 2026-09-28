import "server-only";

import { isAxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { loginGoogle, loginKakao } from "@/apis/oauth";
import {
  MEMBER_SNAPSHOT_COOKIE,
  MEMBER_SNAPSHOT_COOKIE_OPTIONS,
} from "@/constants/auth/memberSnapshotCookie";
import { OAuthBrowserLogEntry } from "@/constants/oauth/debug";
import {
  GOOGLE_STATE_COOKIE,
  GOOGLE_STATE_COOKIE_PATH,
  KAKAO_STATE_COOKIE,
  KAKAO_STATE_COOKIE_PATH,
} from "@/constants/oauth/oauth";
import { AuthSession } from "@/types/oauth/oauth";
import { createOAuthBrowserResponse } from "@/lib/oauth/browserDebug";
import { maskOAuthSecret, sanitizeOAuthLogValue } from "@/lib/oauth/debug";

const providers = {
  kakao: {
    label: "카카오",
    apiPath: "/auth/kakao",
    stateCookie: KAKAO_STATE_COOKIE,
    callbackPath: KAKAO_STATE_COOKIE_PATH,
    exchangeCode: loginKakao,
  },
  google: {
    label: "구글",
    apiPath: "/auth/google",
    stateCookie: GOOGLE_STATE_COOKIE,
    callbackPath: GOOGLE_STATE_COOKIE_PATH,
    exchangeCode: loginGoogle,
  },
};

type ProviderType = keyof typeof providers;

function clearStateCookie(response: NextResponse, provider: ProviderType) {
  const { stateCookie, callbackPath } = providers[provider];

  response.cookies.set(stateCookie, "", {
    path: callbackPath,
    maxAge: 0,
  });

  return response;
}

function createLoginRedirectResponse(
  request: NextRequest,
  provider: ProviderType,
  logs: OAuthBrowserLogEntry[],
  reason: "invalid callback" | "error",
) {
  const config = providers[provider];
  const response = createOAuthBrowserResponse({
    redirectTo: new URL("/login", request.url),
    logs: [
      ...logs,
      {
        level: reason === "error" ? "error" : "warn",
        label: `[OAuth][${config.label}][콜백 응답]`,
        data: {
          reason,
          status: 200,
          redirectTo: "/login",
          cookies: [
            {
              name: config.stateCookie,
              value: "[CLEARED]",
            },
          ],
        },
      },
    ],
  });

  return clearStateCookie(response, provider);
}

export async function handleOAuthCallback(
  request: NextRequest,
  provider: ProviderType,
) {
  const config = providers[provider];
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const savedState = request.cookies.get(config.stateCookie)?.value;
  const logs: OAuthBrowserLogEntry[] = [
    {
      level: "info",
      label: `[OAuth][${config.label}][콜백 요청]`,
      data: {
        method: request.method,
        pathname: request.nextUrl.pathname,
        query: sanitizeOAuthLogValue(
          Object.fromEntries(request.nextUrl.searchParams.entries()),
        ),
        stateCookie: {
          name: config.stateCookie,
          value: maskOAuthSecret(savedState),
        },
      },
    },
  ];

  if (!code || !state || !savedState || state !== savedState) {
    logs.push({
      level: "warn",
      label: `[OAuth][${config.label}][콜백 검증 실패]`,
      data: {
        hasCode: Boolean(code),
        hasState: Boolean(state),
        hasSavedState: Boolean(savedState),
        stateMatches: Boolean(state && savedState && state === savedState),
      },
    });

    return createLoginRedirectResponse(
      request,
      provider,
      logs,
      "invalid callback",
    );
  }

  logs.push({
    level: "info",
    label: `[OAuth][${config.label}][백엔드 요청]`,
    data: {
      method: "GET",
      baseURL: process.env.NEXT_API_BASE_URL,
      path: config.apiPath,
      params: { code: maskOAuthSecret(code) },
    },
  });

  try {
    const res = await config.exchangeCode(code);

    logs.push({
      level: "info",
      label: `[OAuth][${config.label}][백엔드 응답]`,
      data: {
        status: res.status,
        statusText: res.statusText,
        headers: sanitizeOAuthLogValue(res.headers),
        data: sanitizeOAuthLogValue(res.data),
      },
    });

    const payload = res.data.data;
    const accessToken = payload?.accessToken;

    // refreshToken 추출
    const setCookie = res.headers["set-cookie"];
    const cookies = Array.isArray(setCookie)
      ? setCookie
      : setCookie
        ? [setCookie]
        : [];

    const refreshCookie = cookies.find((cookie) =>
      cookie.startsWith("refreshToken="),
    );
    const refreshToken = refreshCookie
      ?.split(";")[0]
      .slice("refreshToken=".length);

    if (typeof accessToken !== "string" || !accessToken || !payload.member) {
      throw new Error(`${config.label} 로그인 응답이 올바르지 않습니다.`);
    }

    const session: AuthSession = {
      newMember: payload.newMember,
      member: {
        id: payload.member.id,
        email: payload.member.email,
        imgUrl: payload.member.imgUrl,
        nickname: payload.member.nickname,
        ageGroup: payload.member.ageGroup,
        interestFields: payload.member.interestFields,
        profileCompleted: payload.member.profileCompleted,
      },
    };
    const redirectTo = payload.member.profileCompleted ? "/" : "/onboarding";
    const response = createOAuthBrowserResponse({
      redirectTo: new URL(redirectTo, request.url),
      logs: [
        ...logs,
        {
          level: "info",
          label: `[OAuth][${config.label}][콜백 응답]`,
          data: {
            reason: "success",
            status: 200,
            redirectTo,
            cookies: [
              { name: "sessionToken", value: "[REDACTED]" },
              { name: MEMBER_SNAPSHOT_COOKIE, value: "[REDACTED]" },
              { name: config.stateCookie, value: "[CLEARED]" },
            ],
          },
        },
      ],
    });

    // accessToken, refreshToken 쿠키 저장
    response.cookies.set(
      "sessionToken",
      JSON.stringify({
        accessToken: accessToken,
        refreshToken: refreshToken,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      },
    );

    // 사용자 정보 쿠키 저장
    response.cookies.set(
      MEMBER_SNAPSHOT_COOKIE,
      JSON.stringify(session),
      MEMBER_SNAPSHOT_COOKIE_OPTIONS,
    );

    return clearStateCookie(response, provider);
  } catch (error) {
    if (isAxiosError(error)) {
      logs.push({
        level: "error",
        label: `[OAuth][${config.label}][백엔드 응답 오류]`,
        data: {
          status: error.response?.status,
          statusText: error.response?.statusText,
          headers: sanitizeOAuthLogValue(error.response?.headers),
          data: sanitizeOAuthLogValue(error.response?.data),
          message: error.message,
        },
      });
    } else {
      logs.push({
        level: "error",
        label: `[OAuth][${config.label}][로그인 처리 오류]`,
        data:
          error instanceof Error
            ? { name: error.name, message: error.message }
            : sanitizeOAuthLogValue(error),
      });
    }

    return createLoginRedirectResponse(request, provider, logs, "error");
  }
}
