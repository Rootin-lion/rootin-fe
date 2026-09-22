import { apiClient } from "./client";

export const completeProfile = (payload) => {
  const res = apiClient.put("/api/v1/user/profile", payload);

  return res;
};
