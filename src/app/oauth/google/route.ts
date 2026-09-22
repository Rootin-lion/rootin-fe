import {
  GOOGLE_STATE_COOKIE,
  GOOGLE_STATE_COOKIE_PATH,
} from "@/constants/oauth";
import { NextResponse } from "next/server";

export function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { message: "카카오 로그인 설정이 없습니다." },
      { status: 500 },
    );
  }

  // 검증 state 생성
  const state = crypto.randomUUID();

  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("scope", "openid email profile");

  const response = NextResponse.redirect(url);
  response.cookies.set(GOOGLE_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: GOOGLE_STATE_COOKIE_PATH,
    maxAge: 60 * 5,
  });

  return response;
}
