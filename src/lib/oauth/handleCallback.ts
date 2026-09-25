import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { isAxiosError } from "axios";
import { loginGoogle, loginKakao } from "@/apis/oauth";
import {
  GOOGLE_STATE_COOKIE,
  GOOGLE_STATE_COOKIE_PATH,
  KAKAO_STATE_COOKIE,
  KAKAO_STATE_COOKIE_PATH,
} from "@/constants/oauth";
import { AuthSession } from "@/types/oauth/oauth";
import {
  MEMBER_SNAPSHOT_COOKIE,
  MEMBER_SNAPSHOT_COOKIE_OPTIONS,
} from "@/constants/auth/memberSnapshotCookie";

const providers = {
  kakao: {
    label: "카카오",
    stateCookie: KAKAO_STATE_COOKIE,
    callbackPath: KAKAO_STATE_COOKIE_PATH,
    exchangeCode: loginKakao,
  },
  google: {
    label: "구글",
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
    const res = await config.exchangeCode(code);
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

    const response = payload.member.profileCompleted
      ? NextResponse.redirect(new URL("/", request.url))
      : NextResponse.redirect(new URL("/onboarding", request.url));

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
      console.error(`${config.label} 로그인 API 오류`, {
        status: error.response?.status,
        errorCode: error.response?.data?.errorCode,
        message: error.response?.data?.message ?? error.message,
      });
    } else {
      console.error(`${config.label}  로그인 처리 오류`, error);
    }

    return redirectLogin(request, provider);
  }
}
