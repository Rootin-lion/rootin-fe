import { apiClient } from "./client";
import { OnboardingPayload } from "@/types/auth/auth";

export const completeProfile = (payload: OnboardingPayload) => {
  const res = apiClient.put("/api/v1/user/profile", payload);

  return res;
};
