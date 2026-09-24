import { apiPublic } from "./client";

// 카카오 소셜 로그인
export const loginKakao = async (code: string) => {
  const res = await apiPublic.get("/auth/kakao", {
    params: { code },
  });

  return res;
};

// 구글 소셜 로그인
export const loginGoogle = async (code: string) => {
  const res = await apiPublic.get("/auth/google", {
    params: { code },
  });

  return res;
};
