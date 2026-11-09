import type { ApiError } from "@/types/api/error";
import type { CompetitionProblemDetail } from "@/types/competitions/competition";

export type CompetitionProblemResponse =
  | { ok: true; data: CompetitionProblemDetail }
  | { ok: false; error: ApiError };

export async function fetchCompetitionProblem(
  competitionId: number,
  competitionProblemId: number,
  signal: AbortSignal,
): Promise<CompetitionProblemResponse> {
  const response = await fetch(
    `/api/competitions/${competitionId}/problems/${competitionProblemId}`,
    { cache: "no-store", credentials: "same-origin", signal },
  );

  // Token recovery can redirect to the login page from the server API client.
  if (
    response.status === 401 ||
    (response.redirected && new URL(response.url).pathname === "/login")
  ) {
    return {
      ok: false,
      error: {
        code: "UNAUTHENTICATED",
        message: "로그인이 필요합니다.",
        status: 401,
      },
    };
  }

  const result: CompetitionProblemResponse = await response.json();
  if (!response.ok && result.ok) {
    throw new Error("문제를 불러오지 못했습니다.");
  }
  return result;
}
