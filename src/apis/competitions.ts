import type { CompetitionProgressState } from "@/types/competitions/competition";
import type { RankingPeriod } from "@/types/competitions/ranking";
import { apiClient } from "./client";

// 오늘의 대회 조회
export const getTodayCompetition = async () => {
  const res = await apiClient.get("/competitions/today");

  return res;
};

// 랭킹 TOP 3 조회
export const getTop3 = async (competitionId: number) => {
  const res = await apiClient.get(
    `/competitions/${competitionId}/rankings/top3`,
  );

  return res;
};

// 종료 대회 조회
export const getPastCompetition = async (page: number) => {
  const res = await apiClient.get("/competitions", {
    params: {
      status: "CLOSED",
      page,
    },
  });

  return res;
};

// 전체 랭킹 조회
export const getRankings = async (
  competitionId: number,
  period: RankingPeriod,
  page: number,
) => {
  const res = await apiClient.get(`/competitions/${competitionId}/rankings`, {
    params: {
      period,
      page,
    },
  });

  return res;
};

// 내 랭킹 조회
export const getMyRanking = async (
  competitionId: number,
  period: RankingPeriod,
) => {
  const res = await apiClient.get(
    `/competitions/${competitionId}/rankings/me`,
    {
      params: {
        period,
      },
    },
  );

  return res;
};

// 대회 진입
export const joinCompetition = async (competitionId: number) => {
  const res = await apiClient.post(`/competitions/${competitionId}/join`);

  return res;
};

// 대회 문제 목록 조회
export const requestProblems = async (competitionId: number) => {
  const res = await apiClient.get(`/competitions/${competitionId}/problems`);

  return res;
};

// 대회 문제 상세 조회
export const requestDetailProblem = async (
  competitionId: number,
  competitionProblemId: number,
) => {
  const res = await apiClient.get(
    `/competitions/${competitionId}/problems/${competitionProblemId}`,
  );

  return res;
};

// 각 문제 답안 저장
export const saveProblemAnswer = async (
  competitionId: number,
  competitionProblemId: number,
  selectedOptionId: number,
) => {
  const res = await apiClient.patch(`/competitions/${competitionId}/answers`, {
    competitionProblemId,
    selectedOptionId,
  });

  return res;
};

// 대회 진행 정보 조회
export const getCompetitionStatus = async (competitionId: number) => {
  const res = await apiClient.get<{ data: CompetitionProgressState }>(
    `/competitions/${competitionId}/me`,
  );

  return res;
};

// 대회 제출
export const submitContest = async (competitionId: number) => {
  const res = await apiClient.post(`/competitions/${competitionId}/submit`);

  return res;
};

// 대회 결과 조회
export const getCompetitionResult = async (competitionId: number) => {
  const res = await apiClient.get(`/competitions/${competitionId}/result`);

  return res;
};

// 대회 결과 문제 상세 조회
export const getResultProblem = async (
  competitionId: number,
  competitionProblemId: number,
) => {
  const res = await apiClient.get(
    `/competitions/${competitionId}/problems/${competitionProblemId}/solution`,
  );

  return res;
};
