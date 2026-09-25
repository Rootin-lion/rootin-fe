"use server";

import {
  getPastCompetition,
  getTodayCompetition,
  getTop3,
} from "@/apis/contest";
import { apiError } from "@/lib/apiError";

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
  const res = await getTop3(competitionId);

  return res?.data;
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
