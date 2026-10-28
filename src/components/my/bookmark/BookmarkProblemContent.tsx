"use client";

import Link from "next/link";
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
    <div className="bg-bg-green-50 min-h-dvh w-full px-4 pb-20">
      <div className="mx-auto max-w-2xl pt-12">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-text text-xl font-semibold">CS 대회 문제</h1>
          <Link
            href="/my?section=bookmark"
            className="text-primary focus-visible:outline-primary text-sm hover:underline focus-visible:rounded-sm focus-visible:outline-2"
          >
            북마크 목록으로
          </Link>
        </div>
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
