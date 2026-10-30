"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import CheckIcon from "@/assets/competitions/result/check.png";
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
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(
    null,
  );

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

        setSelectedOptionIndex(null);
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

  const correctOptionIndex =
    problem?.options.findIndex((option) => option.isAnswer) ?? -1;
  const correctOption = problem?.options[correctOptionIndex];
  const isCorrect = selectedOptionIndex === correctOptionIndex;

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
          <>
            <ProblemPanel
              variant="bookmark"
              currentProblem={problem}
              selectedOptionIndex={selectedOptionIndex ?? undefined}
              onSelectOptionIndex={
                selectedOptionIndex === null
                  ? setSelectedOptionIndex
                  : undefined
              }
            >
              {selectedOptionIndex !== null && (
                <>
                  {correctOption ? (
                    <section className="flex flex-col gap-5" aria-live="polite">
                      <div
                        className={isCorrect ? "text-primary" : "text-error"}
                      >
                        <div className="flex items-center gap-1">
                          {isCorrect ? (
                            <Image src={CheckIcon} alt="" className="h-5 w-5" />
                          ) : (
                            <span
                              aria-hidden="true"
                              className="bg-error flex h-5 w-5 items-center justify-center rounded-full text-sm text-white"
                            >
                              ×
                            </span>
                          )}
                          <h2 className="text-[18px] font-semibold">
                            {isCorrect ? "정답" : "오답"}
                          </h2>
                        </div>
                        <p className="mt-1 ml-6 text-[14px] font-semibold">
                          {correctOption.optionContent}
                        </p>
                      </div>
                      <div>
                        <h2 className="text-[18px] font-semibold text-black">
                          정답 및 해설
                        </h2>
                        <p className="text-text mt-1 ml-6 text-[12px]">
                          {problem.problemExplanation || "-"}
                        </p>
                      </div>
                    </section>
                  ) : (
                    <p className="text-error text-sm" role="alert">
                      정답 정보를 불러오지 못했습니다.
                    </p>
                  )}
                  <div className="flex justify-end">
                    <Link
                      href="/my?section=bookmark"
                      className="rounded-lg border border-[#E1E1E1] px-4 py-2 text-sm text-black"
                    >
                      뒤로가기
                    </Link>
                  </div>
                </>
              )}
            </ProblemPanel>
          </>
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
