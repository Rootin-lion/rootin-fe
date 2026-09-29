"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getCompetitionStatusAction,
  requestDetailProblemAction,
  requestProblemsAction,
  saveProblemAnswerAction,
  submitContestAction,
} from "@/app/(service)/competitions/action";
import ErrorModal from "@/components/shared/ErrorModal";
import useErrorModal from "@/hooks/useErrorModal";
import { useCompetitionParticipationStore } from "@/stores/useCompetitionParticipationStore";
import type {
  CompetitionProblemDetail,
  CompetitionProblemSummary,
} from "@/types/competitions/competition";
import ProblemPanel from "../shared/ProblemPanel";
import ProblemAutoSubmitModal from "./ProblemAutoSubmitModal";
import ProblemSidebar from "./ProblemSidebar";
import ProblemSubmitModal from "./ProblemSubmitModal";

type SubmitModalType = "confirm" | "autoSubmitted" | null;
type SubmitTrigger = "manual" | "timeout";

export default function ProblemContent({
  competitionId,
}: {
  competitionId: number;
}) {
  const router = useRouter();
  // 대회 참여 정보
  const setParticipation = useCompetitionParticipationStore(
    (state) => state.setParticipation,
  );
  // 문제 풀이 상태
  const [problemNavigationItems, setProblemNavigationItems] = useState<
    CompetitionProblemSummary[]
  >([]);
  const [currentProblem, setCurrentProblem] =
    useState<CompetitionProblemDetail | null>(null);
  const [selectedOptionByProblemId, setSelectedOptionByProblemId] = useState<
    Record<number, number>
  >({});
  // 에러 발생 후 대회 목록 이동 여부
  const [shouldLeaveAfterError, setShouldLeaveAfterError] = useState(true);
  // 에러 모달 상태
  const { error, setErrorContext, isModalOpen, openModal, closeModal } =
    useErrorModal();
  // 제출 확인 모달 상태

  const [activeSubmitModal, setActiveSubmitModal] =
    useState<SubmitModalType>(null);

  // 현재 문제 위치
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

  const openSubmitConfirmModal = () => {
    setActiveSubmitModal("confirm");
  };

  const openAutoSubmitModal = () => {
    setActiveSubmitModal("autoSubmitted");
  };

  const closeSubmitModal = () => {
    setActiveSubmitModal(null);
  };

  // 문제 상세 조회
  const loadProblem = async (competitionProblemId: number) => {
    if (competitionProblemId === currentProblem?.competitionProblemId) return;

    try {
      const res = await requestDetailProblemAction(
        competitionId,
        competitionProblemId,
      );

      if (!res.ok) {
        setShouldLeaveAfterError(true);
        setErrorContext(res.error);
        openModal();

        return;
      }

      setCurrentProblem(res.data);
    } catch {
      setShouldLeaveAfterError(true);
      setErrorContext({
        code: "UNKNOWN_ERROR",
        message: "문제를 불러오지 못했습니다.",
      });
      openModal();
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
        setShouldLeaveAfterError(false);
        setErrorContext(res.error);
        openModal();

        return;
      }

      setSelectedOptionByProblemId((previous) => ({
        ...previous,
        [competitionProblemId]: selectedOptionId,
      }));
    } catch {
      setShouldLeaveAfterError(false);
      setErrorContext({
        code: "UNKNOWN_ERROR",
        message: "문제 답안 저장에 실패했습니다.",
      });
      openModal();
    }
  };

  // 대회 제출
  const submitCompetition = async (trigger: SubmitTrigger) => {
    try {
      const res = await submitContestAction(competitionId);

      if (!res.ok) {
        closeSubmitModal();
        setErrorContext(res.error);
        openModal();

        return;
      }

      if (trigger === "timeout") {
        openAutoSubmitModal();

        return;
      }

      closeSubmitModal();
      router.replace(`/competitions/${competitionId}/result`);
    } catch {
      closeSubmitModal();
      setErrorContext({
        code: "UNKNOWN_ERROR",
        message: "대회 제출에 실패했습니다.",
      });
      openModal();
    }
  };

  // 대회 진행 정보 초기화
  useEffect(() => {
    let isCancelled = false;

    const initializeCompetition = async () => {
      try {
        const statusRes = await getCompetitionStatusAction(competitionId);

        if (isCancelled) return;

        if (!statusRes.ok) {
          setShouldLeaveAfterError(true);
          setErrorContext(statusRes.error);
          openModal();

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
          setShouldLeaveAfterError(true);
          setErrorContext(problemsRes.error);
          openModal();

          return;
        }

        setProblemNavigationItems(problemsRes.data.problems);
        setCurrentProblem(problemsRes.data.firstProblem);
      } catch {
        if (isCancelled) return;

        setShouldLeaveAfterError(true);
        setErrorContext({
          code: "UNKNOWN_ERROR",
          message: "대회 진행 정보를 불러오지 못했습니다.",
        });
        openModal();
      }
    };

    void initializeCompetition();

    return () => {
      isCancelled = true;
    };
  }, [competitionId, openModal, router, setErrorContext, setParticipation]);

  return (
    <div className="bg-primary-50 min-h-dvh">
      {isModalOpen && (
        <ErrorModal
          code={error.code}
          message={error.message}
          onClose={() => {
            closeModal();

            if (shouldLeaveAfterError) {
              router.replace("/competitions");
            }
          }}
        />
      )}

      {activeSubmitModal === "confirm" && (
        <ProblemSubmitModal
          onClose={closeSubmitModal}
          onSubmit={() => {
            void submitCompetition("manual");
          }}
        />
      )}

      {activeSubmitModal === "autoSubmitted" && (
        <ProblemAutoSubmitModal
          competitionId={competitionId}
          onClose={() => {
            router.replace(`/competitions/${competitionId}/result`);
          }}
        />
      )}

      <div className="mx-auto flex w-full max-w-5xl flex-row gap-4 pt-9">
        <ProblemSidebar
          problemNavigationItems={problemNavigationItems}
          currentProblemId={currentProblem?.competitionProblemId}
          answeredProblemIds={
            new Set(Object.keys(selectedOptionByProblemId).map(Number))
          }
          onSelectProblem={(competitionProblemId) => {
            void loadProblem(competitionProblemId);
          }}
          onExpire={() => {
            void submitCompetition("timeout");
          }}
        />
        <ProblemPanel
          currentProblem={currentProblem}
          selectedOptionId={
            currentProblem
              ? selectedOptionByProblemId[currentProblem.competitionProblemId]
              : undefined
          }
          isFirstProblem={isFirstProblem}
          isLastProblem={isLastProblem}
          onSelectOption={(selectedOptionId) => {
            void handleSelectOption(selectedOptionId);
          }}
          onPrevious={handlePreviousProblem}
          onNext={handleNextProblem}
          onSubmit={openSubmitConfirmModal}
        />
      </div>
    </div>
  );
}
