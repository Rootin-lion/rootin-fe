import type { OnboardingPayload } from "@/types/auth/auth";
import { apiClient } from "./client";

export { reissueToken } from "./client";

// 프로필 조회
export const getProfile = async () => {
  const res = await apiClient.get("/users/profile");

  return res;
};

// 프로필 설정
export const completeProfile = async (payload: OnboardingPayload) => {
  const res = await apiClient.put("/users/profile", payload);

  return res;
};

// 닉네임 중복 검사
export const checkNickname = async (nickname: string) => {
  const res = await apiClient.get("/users/nickname/check", {
    params: { nickname },
  });

  return res;
};
