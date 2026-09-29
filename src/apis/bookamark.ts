import { apiClient } from "./client";

// 북마크 설정
export const addProblemBookmark = (problemId: number) => {
  const res = apiClient.post(`/problems/${problemId}/bookmark`);

  return res;
};

// 북마크 해제
export const removeProblemBookmark = (problemId: number) => {
  const res = apiClient.delete(`/problems/${problemId}/bookmark`);

  return res;
};
