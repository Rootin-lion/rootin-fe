"use server";

import { addProblemBookmark, removeProblemBookmark } from "@/apis/bookmark";
import { executeResponseDataAction } from "@/lib/shared/executeDataAction";

// 북마크 설정
export async function addProblemBookmarkAction(problemId: number) {
  return executeResponseDataAction(() => addProblemBookmark(problemId), {
    code: "BOOKMARK_FAILED",
    message: "북마크 저장에 실패했습니다.",
  });
}

// 북마크 해제
export async function removeProblemBookmarkAction(problemId: number) {
  return executeResponseDataAction(() => removeProblemBookmark(problemId), {
    code: "BOOKMARK_FAILED",
    message: "북마크 해제에 실패했습니다.",
  });
}
