"use server";

import {
  getContestStatus,
  getMyRanking,
  getPastCompetition,
  getRankings,
  getTodayCompetition,
  getTop3,
  joinCompetition,
  requestDetailProblem,
  requestProblems,
  saveProblemAnswer,
  submitContest,
} from "@/apis/contest";
import { apiError } from "@/lib/shared/apiError";
import { RankingPeriod } from "@/types/contests/ranking";

// 오늘의 대회 조회
export async function getTodayCompetitionAction() {
  try {
    const res = await getTodayCompetition();
    const data = res.data.data;

    if (!data) {
      return {
        ok: false,
        error: {
          code: "COMPETITION_FAILED",
          message: "대회를 불러오지 못했습니다.",
        },
      } as const;
    }

    return {
      ok: true,
      data,
    } as const;
  } catch (error) {
    return {
      ok: false,
      error: apiError(error, "대회를 불러오지 못했습니다."),
    } as const;
  }
}

// 랭킹 TOP 3 조회
export async function getTop3Action(competitionId: number) {
  try {
    const res = await getTop3(competitionId);
    const data = res.data.data;

    if (!data) {
      return {
        ok: false,
        error: {
          code: "RANKING_FAILED",
          message: "랭킹을 불러오지 못했습니다.",
        },
      } as const;
    }

    return {
      ok: true,
      data,
    } as const;
  } catch (error) {
    return {
      ok: false,
      error: apiError(error, "랭킹을 불러오지 못했습니다."),
    };
  }
}

// 종료 대회 조회
export async function getPastCompetitionAction(page: number) {
  try {
    const res = await getPastCompetition(page);
    const data = res.data.data;

    if (!data) {
      return {
        ok: false,
        error: {
          code: "COMPETITION_FAILED",
          message: "과거 대회를 불러오지 못했습니다.",
        },
      } as const;
    }

    return {
      ok: true,
      data,
    } as const;
  } catch (error) {
    return {
      ok: false,
      error: apiError(error, "대회를 불러오지 못했습니다."),
    } as const;
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
      return {
        ok: false,
        error: {
          code: "RANKING_FAILED",
          message: "랭킹을 불러오지 못했습니다.",
        },
      } as const;
    }

    return {
      ok: true,
      data,
    } as const;
  } catch (error) {
    return {
      ok: false,
      error: apiError(error, "랭킹을 불러오지 못했습니다."),
    } as const;
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
      return {
        ok: false,
        error: {
          code: "MY_RANKING_FAILED",
          message: "나의 랭킹을 불러오지 못했습니다.",
        },
      } as const;
    }

    return {
      ok: true,
      data,
    } as const;
  } catch (error) {
    return {
      ok: false,
      error: apiError(error, "나의 랭킹을 불러오지 못했습니다."),
    } as const;
  }
}

// 대회 진입
export async function joinCompetitionAction(competitionId: number) {
  try {
    const res = await joinCompetition(competitionId);
    const data = res.data.data;

    if (!data) {
      return {
        ok: false,
        error: {
          code: "COMPETITION_FAILED",
          message: "대회에 참가하지 못했습니다. 잠시 후 다시 시도해 주세요.",
        },
      } as const;
    }

    return {
      ok: true,
      data,
    } as const;
  } catch (error) {
    return {
      ok: false,
      error: apiError(
        error,
        "대회에 참가하지 못했습니다. 잠시 후 다시 시도해 주세요.",
      ),
    } as const;
  }
}

// 대회 문제 목록 조회
export async function requestProblemsAction(competitionId: number) {
  try {
    const res = await requestProblems(competitionId);
    const data = res.data.data;

    if (!data) {
      return {
        ok: false,
        error: {
          code: "PROBLEM_FAILED",
          message: "대회 문제를 불러오지 못했습니다.",
        },
      } as const;
    }

    return {
      ok: true,
      data,
    } as const;
  } catch (error) {
    return {
      ok: false,
      error: apiError(error, "대회 문제를 불러오지 못했습니다."),
    } as const;
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
      return {
        ok: false,
        error: {
          code: "PROBLEM_FAILED",
          message: "대회 문제를 불러오지 못했습니다.",
        },
      } as const;
    }

    return {
      ok: true,
      data,
    } as const;
  } catch (error) {
    return {
      ok: false,
      error: apiError(error, "대회 문제를 불러오지 못했습니다."),
    } as const;
  }
}

// 각 문제 답안 저장
export async function saveProblemAnswerAction(
  competitionId: number,
  selectedOptionId: number,
) {
  try {
    const res = await saveProblemAnswer(competitionId, selectedOptionId);
    const data = res.data.data;

    if (!data) {
      return {
        ok: false,
        error: {
          code: "PROBLEM_FAILED",
          message: "문제 답안 저장에 실패했습니다.",
        },
      } as const;
    }

    return {
      ok: true,
      data,
    } as const;
  } catch (error) {
    return {
      ok: false,
      error: apiError(error, "문제 답안 저장에 실패했습니다."),
    } as const;
  }
}

// 대회 진행 정보 조회
export async function getContestStatusAction(competitionId: number) {
  try {
    const res = await getContestStatus(competitionId);
    const data = res.data.data;

    if (!data) {
      return {
        ok: false,
        error: {
          code: "PROBLEM_FAILED",
          message: "대회 조회에 실패했습니다.",
        },
      } as const;
    }

    return {
      ok: true,
      data,
    } as const;
  } catch (error) {
    return {
      ok: false,
      error: apiError(error, "대회 조회에 실패했습니다."),
    } as const;
  }
}

// 대회 제출
export async function submitContestAction(competitionId: number) {
  try {
    const res = await submitContest(competitionId);
    const data = res.data.data;

    if (!data) {
      return {
        ok: false,
        error: {
          code: "PROBLEM_FAILED",
          message: "대회 제출에 실패했습니다.",
        },
      } as const;
    }

    return {
      ok: true,
      data,
    } as const;
  } catch (error) {
    return {
      ok: false,
      error: apiError(error, "대회 제출에 실패했습니다."),
    } as const;
  }
}
