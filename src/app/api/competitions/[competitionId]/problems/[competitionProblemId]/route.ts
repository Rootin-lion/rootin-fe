import { cookies } from "next/headers";
import { getCompetitionProblemDetail } from "@/apis/competitions";
import { SESSION_TOKEN_COOKIE } from "@/constants/auth/sessionTokenCookie";
import { apiError } from "@/lib/shared/apiError";

const headers = { "Cache-Control": "private, no-store" };

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{
      competitionId: string;
      competitionProblemId: string;
    }>;
  },
) {
  const routeParams = await params;
  const competitionId = Number(routeParams.competitionId);
  const competitionProblemId = Number(routeParams.competitionProblemId);

  if (
    !Number.isSafeInteger(competitionId) ||
    competitionId <= 0 ||
    !Number.isSafeInteger(competitionProblemId) ||
    competitionProblemId <= 0
  ) {
    return Response.json(
      {
        ok: false,
        error: {
          code: "INVALID_PROBLEM",
          message: "올바른 문제 경로가 아닙니다.",
        },
      },
      { status: 400, headers },
    );
  }

  if (!(await cookies()).get(SESSION_TOKEN_COOKIE)?.value) {
    return Response.json(
      {
        ok: false,
        error: {
          code: "UNAUTHENTICATED",
          message: "로그인이 필요합니다.",
          status: 401,
        },
      },
      { status: 401, headers },
    );
  }

  try {
    const response = await getCompetitionProblemDetail(
      competitionId,
      competitionProblemId,
    );
    const data = response.data.data;
    if (!data) throw new Error("문제 응답이 없습니다.");
    return Response.json({ ok: true, data }, { headers });
  } catch (cause) {
    const error = apiError(cause, "문제를 불러오지 못했습니다.");
    return Response.json(
      { ok: false, error },
      { status: error.status ?? 500, headers },
    );
  }
}
