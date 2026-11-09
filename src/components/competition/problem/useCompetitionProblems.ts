"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { ApiError } from "@/types/api/error";
import type {
  CompetitionProblemDetail,
  CompetitionProblemSummary,
} from "@/types/competitions/competition";
import {
  getCompetitionStatusAction,
  getCompetitionProblemsAction,
} from "@/app/(service)/competitions/action";
import {
  fetchCompetitionProblem,
  type CompetitionProblemResponse,
} from "@/lib/competitions/fetchCompetitionProblem";
import { useCompetitionParticipationStore } from "@/stores/useCompetitionParticipationStore";
import useCompetitionAnswers from "./useCompetitionAnswers";

interface ProblemSession {
  active: boolean;
  requestId: number;
  cache: Map<number, CompetitionProblemDetail>;
  pending: Map<number, Promise<CompetitionProblemResponse>>;
  controllers: Set<AbortController>;
}

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
  const [activeProblemId, setActiveProblemId] = useState<number | null>(null);
  const [isLoadingProblem, setLoadingProblem] = useState(false);
  const sessionRef = useRef<ProblemSession | null>(null);
  const { restoreAnswers, selectAnswer, ...answers } = useCompetitionAnswers(
    competitionId,
    onError,
  );

  const currentProblemIndex =
    activeProblemId !== null
      ? problemNavigationItems.findIndex(
          ({ competitionProblemId }) =>
            competitionProblemId === activeProblemId,
        )
      : -1;
  const isFirstProblem = currentProblemIndex <= 0;
  const isLastProblem =
    currentProblemIndex >= 0 &&
    currentProblemIndex === problemNavigationItems.length - 1;

  const loadProblem = async (competitionProblemId: number) => {
    const session = sessionRef.current;
    if (!session?.active) return;
    const requestId = ++session.requestId;
    setActiveProblemId(competitionProblemId);

    const cached = session.cache.get(competitionProblemId);
    if (cached) {
      setCurrentProblem(cached);
      setLoadingProblem(false);
      return;
    }

    setLoadingProblem(true);

    try {
      let request = session.pending.get(competitionProblemId);
      if (!request) {
        const controller = new AbortController();
        session.controllers.add(controller);
        request = fetchCompetitionProblem(
          competitionId,
          competitionProblemId,
          controller.signal,
        ).finally(() => {
          session.pending.delete(competitionProblemId);
          session.controllers.delete(controller);
        });
        session.pending.set(competitionProblemId, request);
      }
      const res = await request;
      if (!session.active) return;
      if (res.ok) session.cache.set(competitionProblemId, res.data);
      if (requestId !== session.requestId) return;

      if (!res.ok) {
        if (res.error.status === 401) {
          router.replace("/login");
        } else {
          onError(res.error, true);
        }

        return;
      }

      setCurrentProblem(res.data);
    } catch {
      if (!session.active || requestId !== session.requestId) return;
      onError(
        {
          code: "UNKNOWN_ERROR",
          message: "문제를 불러오지 못했습니다.",
        },
        true,
      );
    } finally {
      if (session.active && requestId === session.requestId) {
        setLoadingProblem(false);
      }
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
  const handleSelectOption = (selectedOptionId: number) => {
    if (!currentProblem || isLoadingProblem) return;
    return selectAnswer(currentProblem.competitionProblemId, selectedOptionId);
  };

  useEffect(() => {
    let isCancelled = false;
    const session: ProblemSession = {
      active: true,
      requestId: 0,
      cache: new Map(),
      pending: new Map(),
      controllers: new Set(),
    };
    sessionRef.current = session;

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
        restoreAnswers(statusRes.data.answeredProblems);

        const problemsRes = await getCompetitionProblemsAction(competitionId);

        if (isCancelled) return;

        if (!problemsRes.ok) {
          onError(problemsRes.error, true);

          return;
        }

        setProblemNavigationItems(problemsRes.data.problems);
        const firstProblem = problemsRes.data.firstProblem;
        setCurrentProblem(firstProblem ?? null);
        if (firstProblem) {
          session.cache.set(firstProblem.competitionProblemId, firstProblem);
          setActiveProblemId(firstProblem.competitionProblemId);
        }
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
      session.active = false;
      session.controllers.forEach((controller) => controller.abort());
    };
  }, [competitionId, onError, router, setParticipation, restoreAnswers]);

  return {
    problemNavigationItems,
    currentProblem,
    ...answers,
    activeProblemId,
    isLoadingProblem,
    isFirstProblem,
    isLastProblem,
    loadProblem,
    handlePreviousProblem,
    handleNextProblem,
    handleSelectOption,
  };
}
