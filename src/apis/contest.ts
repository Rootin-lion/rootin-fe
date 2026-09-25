import { apiClient } from "./client";

// 오늘의 대회 조회
export const getTodayCompetition = () => {
  const res = apiClient.get("/competitions/today");

  return res;
};

// 랭킹 TOP 3 조회
export const getTop3 = (competitionId: number) => {
  const res = apiClient.get(`/competitions/${competitionId}/rankings/top3`);

  return res;
};

// 종료 대회 조회
export const getPastCompetition = (page: number) => {
  const res = apiClient.get("/competitions", {
    params: {
      status: "CLOSED",
      page,
    },
  });

  return res;
};
