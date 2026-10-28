"use client";

import { useEffect, useState } from "react";
import { getResultProblemAction } from "@/app/(service)/competitions/action";
import ProblemPanel from "@/components/competition/shared/ProblemPanel";
import type { ProblemResultState } from "@/types/competitions/competition";

export default function BookmarkProblemContent({
  competitionId,
  competitionProblemId,
}: {
  competitionId: number;
  competitionProblemId: number;
}) {
  const [problem, setProblem] = useState<ProblemResultState | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadProblem = async () => {
      try {
        const result = await getResultProblemAction(
          competitionId,
          competitionProblemId,
        );
        if (cancelled) return;

        if (!result.ok) {
          setErrorMessage(result.error.message);
          return;
        }

        setProblem(result.data);
      } catch {
        if (!cancelled) setErrorMessage("문제를 불러오지 못했습니다.");
      }
    };

    void loadProblem();
    return () => {
      cancelled = true;
    };
  }, [competitionId, competitionProblemId]);

  return (
    <div className="bg-bg-green-50 mx-auto min-h-dvh w-full max-w-5xl pb-20">
      <div className="mx-auto w-full max-w-213 pt-12">
        {errorMessage ? (
          <p
            className="rounded-lg bg-white px-6 py-7 text-center text-sm"
            role="alert"
          >
            {errorMessage}
          </p>
        ) : problem ? (
          <ProblemPanel variant="bookmark" currentProblem={problem} />
        ) : (
          <p
            className="rounded-lg bg-white px-6 py-7 text-center text-sm"
            role="status"
          >
            문제를 불러오는 중입니다.
          </p>
        )}
      </div>
    </div>
  );
}
