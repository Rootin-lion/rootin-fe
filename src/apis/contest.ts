import { RankingPeriod } from "@/types/contests/ranking";
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

// 전체 랭킹 조회
export const getRankings = (
  competitionId: number,
  period: RankingPeriod,
  page: number,
) => {
  const res = apiClient.get(`/competitions/${competitionId}/rankings`, {
    params: {
      period,
      page,
    },
  });

  return res;
};

// 내 랭킹 조회
export const getMyRanking = (competitionId: number, period: RankingPeriod) => {
  const res = apiClient.get(`/competitions/${competitionId}/rankings/me`, {
    params: {
      period,
    },
  });

  return res;
};

// 대회 진입
export const joinCompetition = (competitionId: number) => {
  const res = apiClient.post(`/competitions/${competitionId}/join`);

  return res;
};

// 대회 문제 목록 조회
export const requestProblems = (competitionId: number) => {
  const res = apiClient.get(`/competitions/${competitionId}/problems`);

  return res;
};

// 대회 문제 상세 조회
export const requestDetailProblem = (
  competitionId: number,
  competitionProblemId: number,
) => {
  const res = apiClient.get(
    `/competitions/${competitionId}/problems/${competitionProblemId}`,
  );

  return res;
};

// 각 문제 답안 저장
export const saveProblemAnswer = (
  competitionId: number,
  competitionProblemId: number,
  selectedOptionId: number,
) => {
  const res = apiClient.patch(`/competitions/${competitionId}/answers`, {
    competitionProblemId,
    selectedOptionId,
  });

  return res;
};

// 대회 진행 정보 조회
export const getContestStatus = (competitionId: number) => {
  const res = apiClient.get(`/competitions/${competitionId}/me`);

  return res;
};

// 대회 제출
export const submitContest = (competitionId: number) => {
  const res = apiClient.post(`/competitions/${competitionId}/submit`);

  return res;
};
