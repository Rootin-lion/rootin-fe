import { NextRequest, NextResponse } from "next/server";
import "server-only";
import type { AuthSession } from "@/types/oauth/oauth";
import {
  MEMBER_SNAPSHOT_COOKIE,
  MEMBER_SNAPSHOT_COOKIE_OPTIONS,
} from "@/constants/auth/memberSnapshotCookie";
import {
  SESSION_TOKEN_COOKIE,
  SESSION_TOKEN_COOKIE_OPTIONS,
} from "@/constants/auth/sessionTokenCookie";
import {
  GOOGLE_STATE_COOKIE,
  GOOGLE_STATE_COOKIE_PATH,
  GOOGLE_OAUTH_URL,
  KAKAO_STATE_COOKIE,
  KAKAO_STATE_COOKIE_PATH,
  KAKAO_OAUTH_URL,
} from "@/constants/oauth/oauth";
import { loginGoogle, loginKakao } from "@/apis/oauth";

const providers = {
  kakao: {
    label: "카카오",
    stateCookie: KAKAO_STATE_COOKIE,
    callbackPath: KAKAO_STATE_COOKIE_PATH,
    redirectUri: KAKAO_OAUTH_URL,
    exchangeCode: loginKakao,
  },
  google: {
    label: "구글",
    stateCookie: GOOGLE_STATE_COOKIE,
    callbackPath: GOOGLE_STATE_COOKIE_PATH,
    redirectUri: GOOGLE_OAUTH_URL,
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

function redirectLogin(request: NextRequest, provider: ProviderType) {
  const response = NextResponse.redirect(new URL("/login", request.url));
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

  if (!code || !state || !savedState || state !== savedState)
    return redirectLogin(request, provider);

  try {
    const res = await config.exchangeCode(code, config.redirectUri);
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

    const response = NextResponse.redirect(
      new URL(
        payload.member.profileCompleted ? "/" : "/onboarding",
        request.url,
      ),
    );

    // accessToken, refreshToken 쿠키 저장
    response.cookies.set(
      SESSION_TOKEN_COOKIE,
      JSON.stringify({
        accessToken: accessToken,
        refreshToken: refreshToken,
      }),
      SESSION_TOKEN_COOKIE_OPTIONS,
    );

    // 사용자 정보 쿠키 저장
    response.cookies.set(
      MEMBER_SNAPSHOT_COOKIE,
      JSON.stringify(session),
      MEMBER_SNAPSHOT_COOKIE_OPTIONS,
    );

    return clearStateCookie(response, provider);
  } catch {
    return redirectLogin(request, provider);
  }
}
