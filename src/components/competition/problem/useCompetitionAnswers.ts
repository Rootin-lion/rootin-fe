"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ApiError } from "@/types/api/error";
import type { CompetitionAnsweredProblem } from "@/types/competitions/competition";
import { saveProblemAnswerAction } from "@/app/(service)/competitions/action";

interface AnswerSession {
  competitionId: number;
  active: boolean;
  locked: boolean;
  expired: boolean;
  selected: Record<number, number>;
  saved: Record<number, number>;
  revisions: Record<number, number>;
  pending: Map<number, Promise<boolean>>;
}

export default function useCompetitionAnswers(
  competitionId: number,
  onError: (error: ApiError, shouldLeave: boolean) => void,
) {
  const sessionRef = useRef<AnswerSession | null>(null);
  const [selectedOptionByProblemId, setSelectedOptions] = useState<
    Record<number, number>
  >({});
  const [savedOptionByProblemId, setSavedOptions] = useState<
    Record<number, number>
  >({});
  const [isAnsweringLocked, setAnsweringLocked] = useState(false);

  const publish = useCallback((session: AnswerSession) => {
    if (!session.active || sessionRef.current !== session) return;

    setSelectedOptions({ ...session.selected });
    setSavedOptions({ ...session.saved });
    setAnsweringLocked(session.locked);
  }, []);

  useEffect(() => {
    const session: AnswerSession = {
      competitionId,
      active: true,
      locked: false,
      expired: false,
      selected: {},
      saved: {},
      revisions: {},
      pending: new Map(),
    };
    sessionRef.current = session;

    return () => {
      session.active = false;
    };
  }, [competitionId]);

  const restoreAnswers = useCallback(
    (answers: CompetitionAnsweredProblem[]) => {
      const session = sessionRef.current;
      if (!session?.active || session.competitionId !== competitionId) return;

      const saved = Object.fromEntries(
        answers.map(({ competitionProblemId, selectedOptionId }) => [
          competitionProblemId,
          selectedOptionId,
        ]),
      );
      session.selected = { ...saved };
      session.saved = saved;
      publish(session);
    },
    [competitionId, publish],
  );

  const selectAnswer = async (problemId: number, optionId: number) => {
    const session = sessionRef.current;
    if (
      !session?.active ||
      session.competitionId !== competitionId ||
      session.locked ||
      session.selected[problemId] === optionId
    ) {
      return;
    }

    session.selected[problemId] = optionId;
    session.revisions[problemId] = (session.revisions[problemId] ?? 0) + 1;
    publish(session);

    // An in-flight save finishes first; intermediate clicks are coalesced.
    const pendingSave = session.pending.get(problemId);
    if (pendingSave) return pendingSave;

    const saveLatestAnswer = async (): Promise<boolean> => {
      while (session.active && sessionRef.current === session) {
        const selectedOptionId = session.selected[problemId];
        if (selectedOptionId === session.saved[problemId]) return true;

        const revision = session.revisions[problemId];
        let failure: ApiError | undefined;

        try {
          const result = await saveProblemAnswerAction(
            competitionId,
            problemId,
            selectedOptionId,
          );
          if (result.ok) {
            session.saved[problemId] = selectedOptionId;
          } else {
            failure = result.error;
          }
        } catch {
          failure = {
            code: "UNKNOWN_ERROR",
            message: "문제 답안 저장에 실패했습니다.",
          };
        }

        if (!session.active || sessionRef.current !== session) return false;

        if (failure && revision === session.revisions[problemId]) {
          const savedOptionId = session.saved[problemId];
          if (savedOptionId === undefined) {
            delete session.selected[problemId];
          } else {
            session.selected[problemId] = savedOptionId;
          }
          publish(session);
          if (!session.expired) onError(failure, false);
          return false;
        }

        publish(session);
      }

      return false;
    };

    const operation = saveLatestAnswer().finally(() => {
      session.pending.delete(problemId);
    });
    session.pending.set(problemId, operation);
    return operation;
  };

  const lockAnswers = (expired: boolean) => {
    const session = sessionRef.current;
    if (!session?.active) return;
    session.locked = true;
    session.expired ||= expired;
    publish(session);
  };

  const waitForPendingSaves = async () => {
    const session = sessionRef.current;
    if (!session?.active) return false;
    const results = await Promise.all(session.pending.values());
    return session.active && results.every(Boolean);
  };

  const resumeAnswers = () => {
    const session = sessionRef.current;
    if (!session?.active || session.expired) return;
    session.locked = false;
    publish(session);
  };

  return {
    selectedOptionByProblemId,
    savedOptionByProblemId,
    isAnsweringLocked,
    restoreAnswers,
    selectAnswer,
    lockAnswers,
    waitForPendingSaves,
    resumeAnswers,
  };
}
