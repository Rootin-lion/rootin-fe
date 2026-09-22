import { KAKAO_STATE_COOKIE, KAKAO_STATE_COOKIE_PATH } from "@/constants/oauth";
import { NextResponse } from "next/server";

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
  const stata = crypto.randomUUID();

  const url = new URL("https://kauth.kakao.com/oauth/authorize");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("state", stata);

  const response = NextResponse.redirect(url);
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
