import axios from "axios";
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
  const response = await axios.get<string>(
    `/api/competitions/${competitionId}/problems/${competitionProblemId}`,
    {
      signal,
      // Check login redirects before parsing a potentially HTML response.
      responseType: "text",
      // Preserve the API's error result for non-2xx responses.
      validateStatus: () => true,
    },
  );
  const responseUrl: string | undefined = response.request?.responseURL;

  // Token recovery can redirect to the login page from the server API client.
  if (
    response.status === 401 ||
    (responseUrl && new URL(responseUrl).pathname === "/login")
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

  const result: CompetitionProblemResponse = JSON.parse(response.data);
  if ((response.status < 200 || response.status >= 300) && result.ok) {
    throw new Error("문제를 불러오지 못했습니다.");
  }
  return result;
}
