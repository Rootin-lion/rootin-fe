import { apiClient } from "./client";

// 북마크 설정
export const addProblemBookmark = async (problemId: number) => {
  const res = await apiClient.post(`/problems/${problemId}/bookmark`);

  return res;
};

// 북마크 해제
export const removeProblemBookmark = async (problemId: number) => {
  const res = await apiClient.delete(`/problems/${problemId}/bookmark`);

  return res;
};
