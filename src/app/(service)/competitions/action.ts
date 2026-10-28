"use server";

import type { RankingPeriod } from "@/types/competitions/ranking";
import {
  getCompetitionResult,
  getCompetitionStatus,
  getMyRanking,
  getPastCompetition,
  getRankings,
  getResultProblem,
  getTodayCompetition,
  getTop3,
  joinCompetition,
  requestDetailProblem,
  requestProblems,
  saveProblemAnswer,
  submitContest,
} from "@/apis/competitions";
import {
  executeNestedDataAction,
  executeResponseDataAction,
} from "@/lib/shared/executeDataAction";

// 오늘의 대회 조회
export async function getTodayCompetitionAction() {
  return executeNestedDataAction(() => getTodayCompetition(), {
    code: "COMPETITION_FAILED",
    message: "대회를 불러오지 못했습니다.",
  });
}

// 랭킹 TOP 3 조회
export async function getTop3Action(competitionId: number) {
  return executeNestedDataAction(() => getTop3(competitionId), {
    code: "RANKING_FAILED",
    message: "랭킹을 불러오지 못했습니다.",
  });
}

// 종료 대회 조회
export async function getPastCompetitionAction(page: number) {
  return executeNestedDataAction(() => getPastCompetition(page), {
    code: "COMPETITION_FAILED",
    message: "종료된 대회를 불러오지 못했습니다.",
  });
}

// 전체 랭킹 조회
export async function getRankingsAction(
  competitionId: number,
  period: RankingPeriod,
  page: number,
) {
  return executeNestedDataAction(
    () => getRankings(competitionId, period, page),
    { code: "RANKING_FAILED", message: "랭킹을 불러오지 못했습니다." },
  );
}

// 내 랭킹 조회
export async function getMyRankingAction(
  competitionId: number,
  period: RankingPeriod,
) {
  return executeNestedDataAction(() => getMyRanking(competitionId, period), {
    code: "MY_RANKING_FAILED",
    message: "나의 랭킹을 불러오지 못했습니다.",
  });
}

// 대회 진입
export async function joinCompetitionAction(competitionId: number) {
  return executeNestedDataAction(() => joinCompetition(competitionId), {
    code: "COMPETITION_FAILED",
    message: "대회에 참가하지 못했습니다.",
  });
}

// 대회 문제 목록 조회
export async function requestProblemsAction(competitionId: number) {
  return executeNestedDataAction(() => requestProblems(competitionId), {
    code: "PROBLEM_FAILED",
    message: "문제를 불러오지 못했습니다.",
  });
}

// 대회 문제 상세 조회
export async function requestDetailProblemAction(
  competitionId: number,
  competitionProblemId: number,
) {
  return executeNestedDataAction(
    () => requestDetailProblem(competitionId, competitionProblemId),
    { code: "PROBLEM_FAILED", message: "문제를 불러오지 못했습니다." },
  );
}

// 각 문제 답안 저장
export async function saveProblemAnswerAction(
  competitionId: number,
  competitionProblemId: number,
  selectedOptionId: number,
) {
  return executeResponseDataAction(
    () =>
      saveProblemAnswer(competitionId, competitionProblemId, selectedOptionId),
    { code: "PROBLEM_FAILED", message: "문제 답안 저장에 실패했습니다." },
  );
}

// 대회 진행 정보 조회
export async function getCompetitionStatusAction(competitionId: number) {
  return executeNestedDataAction(() => getCompetitionStatus(competitionId), {
    code: "PROBLEM_FAILED",
    message: "대회 조회에 실패했습니다.",
  });
}

// 대회 제출
export async function submitContestAction(competitionId: number) {
  return executeNestedDataAction(() => submitContest(competitionId), {
    code: "PROBLEM_FAILED",
    message: "대회 제출에 실패했습니다.",
  });
}
// 대회 결과 조회
export async function getCompetitionResultAction(competitionId: number) {
  return executeNestedDataAction(() => getCompetitionResult(competitionId), {
    code: "RESULT_FAILED",
    message: "대회 결과 조회에 실패했습니다.",
  });
}

// 대회 결과 문제 상세 조회
export async function getResultProblemAction(
  competitionId: number,
  competitionProblemId: number,
) {
  return executeNestedDataAction(
    () => getResultProblem(competitionId, competitionProblemId),
    { code: "PROBLEM_FAILED", message: "문제 상세 조회에 실패했습니다." },
  );
}
