import { apiPublic } from "./client";

export const loginKakao = async (code: string) => {
  const res = await apiPublic.get("/api/v1/auth/kakao", {
    params: { code },
  });

  return res;
};

export const loginGoogle = async (code: string) => {
  const res = await apiPublic.get("/api/v1/auth/google", {
    params: { code },
  });

  return res;
};
