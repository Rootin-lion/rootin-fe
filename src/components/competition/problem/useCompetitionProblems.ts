"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ApiError } from "@/types/api/error";
import type {
  CompetitionProblemDetail,
  CompetitionProblemSummary,
} from "@/types/competitions/competition";
import {
  getCompetitionStatusAction,
  requestDetailProblemAction,
  requestProblemsAction,
  saveProblemAnswerAction,
} from "@/app/(service)/competitions/action";
import { useCompetitionParticipationStore } from "@/stores/useCompetitionParticipationStore";

export default function useCompetitionProblems(
  competitionId: number,
  onError: (error: ApiError, shouldLeave: boolean) => void,
) {
  const router = useRouter();
  const setParticipation = useCompetitionParticipationStore(
    (state) => state.setParticipation,
  );
  const [problemNavigationItems, setProblemNavigationItems] = useState<
    CompetitionProblemSummary[]
  >([]);
  const [currentProblem, setCurrentProblem] =
    useState<CompetitionProblemDetail | null>(null);
  const [selectedOptionByProblemId, setSelectedOptionByProblemId] = useState<
    Record<number, number>
  >({});

  const currentProblemIndex = currentProblem
    ? problemNavigationItems.findIndex(
        ({ competitionProblemId }) =>
          competitionProblemId === currentProblem.competitionProblemId,
      )
    : -1;
  const isFirstProblem = currentProblemIndex <= 0;
  const isLastProblem =
    currentProblemIndex >= 0 &&
    currentProblemIndex === problemNavigationItems.length - 1;

  const loadProblem = async (competitionProblemId: number) => {
    if (competitionProblemId === currentProblem?.competitionProblemId) return;

    try {
      const res = await requestDetailProblemAction(
        competitionId,
        competitionProblemId,
      );

      if (!res.ok) {
        onError(res.error, true);

        return;
      }

      setCurrentProblem(res.data);
    } catch {
      onError(
        {
          code: "UNKNOWN_ERROR",
          message: "문제를 불러오지 못했습니다.",
        },
        true,
      );
    }
  };

  // 이전 문제 이동
  const handlePreviousProblem = () => {
    if (currentProblemIndex <= 0) return;

    const previousProblem = problemNavigationItems[currentProblemIndex - 1];

    if (previousProblem) {
      void loadProblem(previousProblem.competitionProblemId);
    }
  };

  // 다음 문제 이동
  const handleNextProblem = () => {
    if (currentProblemIndex < 0) return;

    const nextProblem = problemNavigationItems[currentProblemIndex + 1];

    if (nextProblem) {
      void loadProblem(nextProblem.competitionProblemId);
    }
  };

  // 답안 저장
  const handleSelectOption = async (selectedOptionId: number) => {
    if (!currentProblem) return;

    const competitionProblemId = currentProblem.competitionProblemId;

    if (selectedOptionByProblemId[competitionProblemId] === selectedOptionId) {
      return;
    }

    try {
      const res = await saveProblemAnswerAction(
        competitionId,
        competitionProblemId,
        selectedOptionId,
      );

      if (!res.ok) {
        onError(res.error, false);

        return;
      }

      setSelectedOptionByProblemId((previous) => ({
        ...previous,
        [competitionProblemId]: selectedOptionId,
      }));
    } catch {
      onError(
        {
          code: "UNKNOWN_ERROR",
          message: "문제 답안 저장에 실패했습니다.",
        },
        false,
      );
    }
  };

  useEffect(() => {
    let isCancelled = false;

    const initializeCompetition = async () => {
      try {
        const statusRes = await getCompetitionStatusAction(competitionId);

        if (isCancelled) return;

        if (!statusRes.ok) {
          onError(statusRes.error, true);

          return;
        }

        if (statusRes.data.submitted) {
          router.replace(`/competitions/${competitionId}/result`);

          return;
        }

        setParticipation({
          participantId: statusRes.data.participantId,
          startedAt: statusRes.data.startedAt,
          expiresAt: statusRes.data.expiresAt,
        });
        setSelectedOptionByProblemId(
          Object.fromEntries(
            statusRes.data.answeredProblems.map(
              ({ competitionProblemId, selectedOptionId }) => [
                competitionProblemId,
                selectedOptionId,
              ],
            ),
          ),
        );

        const problemsRes = await requestProblemsAction(competitionId);

        if (isCancelled) return;

        if (!problemsRes.ok) {
          onError(problemsRes.error, true);

          return;
        }

        setProblemNavigationItems(problemsRes.data.problems);
        setCurrentProblem(problemsRes.data.firstProblem);
      } catch {
        if (isCancelled) return;

        onError(
          {
            code: "UNKNOWN_ERROR",
            message: "대회 진행 정보를 불러오지 못했습니다.",
          },
          true,
        );
      }
    };

    void initializeCompetition();

    return () => {
      isCancelled = true;
    };
  }, [competitionId, onError, router, setParticipation]);

  return {
    problemNavigationItems,
    currentProblem,
    selectedOptionByProblemId,
    isFirstProblem,
    isLastProblem,
    loadProblem,
    handlePreviousProblem,
    handleNextProblem,
    handleSelectOption,
  };
}
