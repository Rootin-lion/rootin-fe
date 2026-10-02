"use server";

import { addProblemBookmark, removeProblemBookmark } from "@/apis/bookmark";
import { actionFailure } from "@/lib/shared/actionFailure";
import { apiError } from "@/lib/shared/apiError";

// 북마크 설정
export async function addProblemBookmarkAction(problemId: number) {
  try {
    const res = await addProblemBookmark(problemId);
    const data = res.data;

    if (!data) {
      return actionFailure({
        code: "BOOKMARK_FAILED",
        message: "북마크 저장에 실패했습니다.",
      });
    }

    return {
      ok: true,
      data,
    } as const;
  } catch (error) {
    return actionFailure(apiError(error, "북마크 저장에 실패했습니다."));
  }
}

// 북마크 해제
export async function removeProblemBookmarkAction(problemId: number) {
  try {
    const res = await removeProblemBookmark(problemId);
    const data = res.data;

    if (!data) {
      return actionFailure({
        code: "BOOKMARK_FAILED",
        message: "북마크 해제에 실패했습니다.",
      });
    }

    return {
      ok: true,
      data,
    } as const;
  } catch (error) {
    return actionFailure(apiError(error, "북마크 해제에 실패했습니다."));
  }
}
