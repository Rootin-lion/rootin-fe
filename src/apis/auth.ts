import { apiClient } from "./client";
import { OnboardingPayload } from "@/types/auth/auth";

export const getProfile = () => {
  const res = apiClient.get("/users/profile");

  return res;
};

// 프로필 설정
export const completeProfile = (payload: OnboardingPayload) => {
  const res = apiClient.put("/users/profile", payload);

  return res;
};

// 닉네임 중복 검사
export const checkNickname = (nickname: string) => {
  const res = apiClient.get("/users/nickname/check", {
    params: { nickname },
  });

  return res;
};
