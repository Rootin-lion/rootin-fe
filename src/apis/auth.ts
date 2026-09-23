import { apiClient } from "./client";
import { OnboardingPayload } from "@/types/auth/auth";

export const completeProfile = (payload: OnboardingPayload) => {
  const res = apiClient.put("/api/v1/users/profile", payload);

  return res;
};

export const checkNickname = (nickname: string) => {
  const res = apiClient.get("/api/v1/users/nickname/check", {
    params: { nickname },
  });

  return res;
};
