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
import { actionFailure } from "@/lib/shared/actionFailure";
import { apiError } from "@/lib/shared/apiError";

// 오늘의 대회 조회
export async function getTodayCompetitionAction() {
  try {
    const res = await getTodayCompetition();
    const data = res.data.data;

    if (!data) {
      return actionFailure({
        code: "COMPETITION_FAILED",
        message: "대회를 불러오지 못했습니다.",
      });
    }

    return {
      ok: true,
      data,
    } as const;
  } catch (error) {
    return actionFailure(apiError(error, "대회를 불러오지 못했습니다."));
  }
}

// 랭킹 TOP 3 조회
export async function getTop3Action(competitionId: number) {
  try {
    const res = await getTop3(competitionId);
    const data = res.data.data;

    if (!data) {
      return actionFailure({
        code: "RANKING_FAILED",
        message: "랭킹을 불러오지 못했습니다.",
      });
    }

    return {
      ok: true,
      data,
    } as const;
  } catch (error) {
    return actionFailure(apiError(error, "랭킹을 불러오지 못했습니다."));
  }
}

// 종료 대회 조회
export async function getPastCompetitionAction(page: number) {
  try {
    const res = await getPastCompetition(page);
    const data = res.data.data;

    if (!data) {
      return actionFailure({
        code: "COMPETITION_FAILED",
        message: "종료된 대회를 불러오지 못했습니다.",
      });
    }

    return {
      ok: true,
      data,
    } as const;
  } catch (error) {
    return actionFailure(apiError(error, "종료된 대회를 불러오지 못했습니다."));
  }
}

// 전체 랭킹 조회
export async function getRankingsAction(
  competitionId: number,
  period: RankingPeriod,
  page: number,
) {
  try {
    const res = await getRankings(competitionId, period, page);
    const data = res.data.data;

    if (!data) {
      return actionFailure({
        code: "RANKING_FAILED",
        message: "랭킹을 불러오지 못했습니다.",
      });
    }

    return {
      ok: true,
      data,
    } as const;
  } catch (error) {
    return actionFailure(apiError(error, "랭킹을 불러오지 못했습니다."));
  }
}

// 내 랭킹 조회
export async function getMyRankingAction(
  competitionId: number,
  period: RankingPeriod,
) {
  try {
    const res = await getMyRanking(competitionId, period);
    const data = res.data.data;

    if (!data) {
      return actionFailure({
        code: "MY_RANKING_FAILED",
        message: "나의 랭킹을 불러오지 못했습니다.",
      });
    }

    return {
      ok: true,
      data,
    } as const;
  } catch (error) {
    return actionFailure(apiError(error, "나의 랭킹을 불러오지 못했습니다."));
  }
}

// 대회 진입
export async function joinCompetitionAction(competitionId: number) {
  try {
    const res = await joinCompetition(competitionId);
    const data = res.data.data;

    if (!data) {
      return actionFailure({
        code: "COMPETITION_FAILED",
        message: "대회에 참가하지 못했습니다.",
      });
    }

    return {
      ok: true,
      data,
    } as const;
  } catch (error) {
    return actionFailure(apiError(error, "대회에 참가하지 못했습니다."));
  }
}

// 대회 문제 목록 조회
export async function requestProblemsAction(competitionId: number) {
  try {
    const res = await requestProblems(competitionId);
    const data = res.data.data;

    if (!data) {
      return actionFailure({
        code: "PROBLEM_FAILED",
        message: "문제를 불러오지 못했습니다.",
      });
    }

    return {
      ok: true,
      data,
    } as const;
  } catch (error) {
    return actionFailure(apiError(error, "문제를 불러오지 못했습니다."));
  }
}

// 대회 문제 상세 조회
export async function requestDetailProblemAction(
  competitionId: number,
  competitionProblemId: number,
) {
  try {
    const res = await requestDetailProblem(competitionId, competitionProblemId);
    const data = res.data.data;

    if (!data) {
      return actionFailure({
        code: "PROBLEM_FAILED",
        message: "문제를 불러오지 못했습니다.",
      });
    }

    return {
      ok: true,
      data,
    } as const;
  } catch (error) {
    return actionFailure(apiError(error, "문제를 불러오지 못했습니다."));
  }
}

// 각 문제 답안 저장
export async function saveProblemAnswerAction(
  competitionId: number,
  competitionProblemId: number,
  selectedOptionId: number,
) {
  try {
    const res = await saveProblemAnswer(
      competitionId,
      competitionProblemId,
      selectedOptionId,
    );
    const data = res.data;

    if (!data)
      return actionFailure({
        code: "PROBLEM_FAILED",
        message: "문제 답안 저장에 실패했습니다.",
      });

    return {
      ok: true,
      data,
    } as const;
  } catch (error) {
    return actionFailure(apiError(error, "문제 답안 저장에 실패했습니다."));
  }
}

// 대회 진행 정보 조회
export async function getCompetitionStatusAction(competitionId: number) {
  try {
    const res = await getCompetitionStatus(competitionId);
    const data = res.data.data;

    if (!data) {
      return actionFailure({
        code: "PROBLEM_FAILED",
        message: "대회 조회에 실패했습니다.",
      });
    }

    return {
      ok: true,
      data,
    } as const;
  } catch (error) {
    return actionFailure(apiError(error, "대회 조회에 실패했습니다."));
  }
}

// 대회 제출
export async function submitContestAction(competitionId: number) {
  try {
    const res = await submitContest(competitionId);
    const data = res.data.data;

    if (!data) {
      return actionFailure({
        code: "PROBLEM_FAILED",
        message: "대회 제출에 실패했습니다.",
      });
    }

    return {
      ok: true,
      data,
    } as const;
  } catch (error) {
    return actionFailure(apiError(error, "대회 제출에 실패했습니다."));
  }
}
// 대회 결과 조회
export async function getCompetitionResultAction(competitionId: number) {
  try {
    const res = await getCompetitionResult(competitionId);
    const data = res.data.data;

    if (!data) {
      return actionFailure({
        code: "RESULT_FAILED",
        message: "대회 결과 조회에 실패했습니다.",
      });
    }

    return {
      ok: true,
      data,
    } as const;
  } catch (error) {
    return actionFailure(apiError(error, "대회 결과 조회에 실패했습니다."));
  }
}

// 대회 결과 문제 상세 조회
export async function getResultProblemAction(
  competitionId: number,
  competitionProblemId: number,
) {
  try {
    const res = await getResultProblem(competitionId, competitionProblemId);
    const data = res.data.data;
    if (!data) {
      return actionFailure({
        code: "PROBLEM_FAILED",
        message: "문제 상세 조회에 실패했습니다.",
      });
    }

    return {
      ok: true,
      data,
    } as const;
  } catch (error) {
    return actionFailure(apiError(error, "문제 상세 조회에 실패했습니다."));
  }
}
