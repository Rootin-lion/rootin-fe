import { NextResponse } from "next/server";
import {
  KAKAO_STATE_COOKIE,
  KAKAO_STATE_COOKIE_PATH,
} from "@/constants/oauth/oauth";

export function GET() {
  const clientId = process.env.KAKAO_CLIENT_ID;
  const redirectUri = process.env.KAKAO_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { message: "카카오 로그인 설정이 없습니다." },
      { status: 500 },
    );
  }

  // 검증 state 생성
  const state = crypto.randomUUID();

  const url = new URL("https://kauth.kakao.com/oauth/authorize");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("state", state);

  const response = NextResponse.redirect(url);
  // state 쿠키 저장
  response.cookies.set(KAKAO_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: KAKAO_STATE_COOKIE_PATH,
    maxAge: 60 * 5,
  });
  response.headers.set("Cache-Control", "no-store");

  return response;
}
