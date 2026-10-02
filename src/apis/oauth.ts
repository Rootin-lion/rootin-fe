import { apiPublic } from "./client";

// 카카오 소셜 로그인
export const loginKakao = async (code: string, redirectUri: string) => {
  const res = await apiPublic.get("/auth/kakao", {
    params: { code, redirectUri },
  });

  return res;
};

// 구글 소셜 로그인
export const loginGoogle = async (code: string, redirectUri: string) => {
  const res = await apiPublic.get("/auth/google", {
    params: { code, redirectUri },
  });

  return res;
};
