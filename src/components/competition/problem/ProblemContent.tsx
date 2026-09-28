"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  getCompetitionStatusAction,
  requestDetailProblemAction,
  requestProblemsAction,
  saveProblemAnswerAction,
  submitContestAction,
} from "@/app/(service)/competitions/action";
import Button from "@/components/shared/Button";
import ErrorModal from "@/components/shared/ErrorModal";
import ModalWrapper from "@/components/shared/ModalWrapper";
import useErrorModal from "@/hooks/useErrorModal";
import useModal from "@/hooks/useModal";
import { useCompetitionParticipationStore } from "@/stores/useCompetitionParticipationStore";
import type {
  CompetitionProblemDetail,
  CompetitionProblemSummary,
} from "@/types/competitions/competition";

import ProblemPanel from "../shared/ProblemPanel";
import ProblemSidebar from "./ProblemSidebar";

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
  const {
    error,
    setErrorContext,
    isModalOpen: isErrorModalOpen,
    openModal: openErrorModal,
    closeModal: closeErrorModal,
  } = useErrorModal();

  // 제출 확인 모달 상태
  const { isModalOpen, openModal, closeModal } = useModal();

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
        openErrorModal();

        return;
      }

      setCurrentProblem(res.data);
    } catch {
      setShouldLeaveAfterError(true);
      setErrorContext({
        code: "UNKNOWN_ERROR",
        message: "문제를 불러오지 못했습니다.",
      });
      openErrorModal();
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
        openErrorModal();

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
      openErrorModal();
    }
  };

  // 대회 제출
  const submitCompetition = async () => {
    try {
      const res = await submitContestAction(competitionId);

      if (!res.ok) {
        closeModal();
        setErrorContext(res.error);
        openErrorModal();

        return;
      }

      closeModal();
      router.replace(`/competitions/${competitionId}/result`);
    } catch {
      closeModal();
      setErrorContext({
        code: "UNKNOWN_ERROR",
        message: "문제 답안 저장에 실패했습니다.",
      });
      openErrorModal();
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
          openErrorModal();

          return;
        }

        if (statusRes.data.submitted) {
          router.replace(`/contecompetitionssts/${competitionId}/result`);

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
          openErrorModal();

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
        openErrorModal();
      }
    };

    void initializeCompetition();

    return () => {
      isCancelled = true;
    };
  }, [
    competitionId,
    openErrorModal,
    router,
    setErrorContext,
    setParticipation,
  ]);

  return (
    <div className="bg-primary-50 min-h-dvh">
      {isErrorModalOpen && (
        <ErrorModal
          code={error.code}
          message={error.message}
          onClose={() => {
            closeErrorModal();

            if (shouldLeaveAfterError) {
              router.replace("/competitions");
            }
          }}
        />
      )}

      {isModalOpen && (
        <ModalWrapper onClose={closeModal}>
          <ModalWrapper.Box>
            <ModalWrapper.Title>정말 제출하시겠습니까?</ModalWrapper.Title>
            <ModalWrapper.Content>
              제출 후에는 답안을 수정할 수 없습니다.
            </ModalWrapper.Content>
          </ModalWrapper.Box>
          <ModalWrapper.Box>
            <div className="flex flex-row gap-9">
              <Button onClick={closeModal} className="max-h-7.5">
                취소
              </Button>
              <Button
                isActive={true}
                className="max-h-7.5"
                onClick={() => submitCompetition()}
              >
                제출하기
              </Button>
            </div>
          </ModalWrapper.Box>
        </ModalWrapper>
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
            void submitCompetition();
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
          onSubmit={openModal}
        />
      </div>
    </div>
  );
}
