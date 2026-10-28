"use server";

import {
  getMyBookmarks,
  getMyDashboard,
  getMyReports,
  getMyReviews,
} from "@/apis/my";
import { actionFailure } from "@/lib/shared/actionFailure";
import { apiError } from "@/lib/shared/apiError";

// 대시보드
export async function getMyDashboardAction() {
  try {
    const res = await getMyDashboard();
    const data = res.data.data;

    if (!data) {
      return actionFailure({
        code: "DASHBOARD_FAILED",
        message: "대시보드 조회에 실패했습니다.",
      });
    }

    return {
      ok: true,
      data,
    } as const;
  } catch (error) {
    return actionFailure(apiError(error, "대시보드 조회에 실패했습니다."));
  }
}

// 리포트
export async function getMyReportsAction(page: number) {
  try {
    const res = await getMyReports(page);
    const data = res.data.data;

    if (!data) {
      return actionFailure({
        code: "REPORT_FAILED",
        message: "리포트 조회에 실패했습니다.",
      });
    }

    return {
      ok: true,
      data,
    } as const;
  } catch (error) {
    return actionFailure(apiError(error, "리포트 조회에 실패했습니다."));
  }
}

// 오답 노트
export async function getMyReviewsAction(page: number) {
  try {
    const res = await getMyReviews(page);
    const data = res.data.data;

    if (!data) {
      return actionFailure({
        code: "REVIEW_FAILED",
        message: "오답노트 조회에 실패했습니다.",
      });
    }

    return {
      ok: true,
      data,
    } as const;
  } catch (error) {
    return actionFailure(apiError(error, "오답노트 조회에 실패했습니다."));
  }
}

// 북마크
export async function getMyBookmarksAction(page: number) {
  try {
    const res = await getMyBookmarks(page);
    const data = res.data.data;
    if (!res.data.success || !Array.isArray(data?.content)) {
      return actionFailure({
        code: "BOOKMARK_FAILED",
        message: "북마크 조회에 실패했습니다.",
      });
    }

    return {
      ok: true,
      data,
    } as const;
  } catch (error) {
    return actionFailure(apiError(error, "북마크 조회에 실패했습니다."));
  }
}
