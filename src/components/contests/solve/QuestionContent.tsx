"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  requestDetailProblemAction,
  requestProblemsAction,
  saveProblemAnswerAction,
  submitContestAction,
} from "@/app/(service)/contests/action";
import Button from "@/components/shared/Button";
import ErrorModal from "@/components/shared/ErrorModal";
import ModalWrapper from "@/components/shared/ModalWrapper";
import useErrorModal from "@/hooks/useErrorModal";
import useModal from "@/hooks/useModal";
import type {
  CompetitionProblemDetail,
  CompetitionProblemSummary,
} from "@/types/contests/competition";

import QuestionPanel from "../shared/QuestionPanel";
import QuestionSidebar from "./QuestionSidebar";

export default function QuestionContent({
  competitionId,
}: {
  competitionId: number;
}) {
  const router = useRouter();
  const [problemNavigationItems, setProblemNavigationItems] = useState<
    CompetitionProblemSummary[]
  >([]);
  const [currentProblem, setCurrentProblem] =
    useState<CompetitionProblemDetail | null>(null);
  const [selectedOptionByProblemId, setSelectedOptionByProblemId] = useState<
    Record<number, number>
  >({});
  const [shouldLeaveAfterError, setShouldLeaveAfterError] = useState(true);

  const {
    error,
    setErrorContext,
    isModalOpen: isErrorModalOpen,
    openModal: openErrorModal,
    closeModal: closeErrorModal,
  } = useErrorModal();
  const { isModalOpen, openModal, closeModal } = useModal();

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

  useEffect(() => {
    const getProblems = async () => {
      try {
        const res = await requestProblemsAction(competitionId);

        if (!res.ok) {
          setShouldLeaveAfterError(true);
          setErrorContext(res.error);
          openErrorModal();

          return;
        }
        setProblemNavigationItems(res.data.problems);
        setCurrentProblem(res.data.firstProblem);
      } catch {
        setShouldLeaveAfterError(true);
        setErrorContext({
          code: "UNKNOWN_ERROR",
          message: "문제를 불러오지 못했습니다.",
        });

        openErrorModal();
      }
    };

    getProblems();
  }, [competitionId, setErrorContext, openErrorModal]);

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

  const handlePreviousProblem = () => {
    if (currentProblemIndex <= 0) return;

    const previousProblem = problemNavigationItems[currentProblemIndex - 1];

    if (previousProblem) {
      void loadProblem(previousProblem.competitionProblemId);
    }
  };

  const handleNextProblem = () => {
    if (currentProblemIndex < 0) return;

    const nextProblem = problemNavigationItems[currentProblemIndex + 1];

    if (nextProblem) {
      void loadProblem(nextProblem.competitionProblemId);
    }
  };

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
      router.replace(`/contests/${competitionId}/result`);
    } catch {
      closeModal();
      setErrorContext({
        code: "UNKNOWN_ERROR",
        message: "문제 답안 저장에 실패했습니다.",
      });
      openErrorModal();
    }
  };

  return (
    <div className="bg-primary-50 min-h-dvh">
      {isErrorModalOpen && (
        <ErrorModal
          code={error.code}
          message={error.message}
          onClose={() => {
            closeErrorModal();

            if (shouldLeaveAfterError) {
              router.replace("/contests");
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
        <QuestionSidebar
          problemNavigationItems={problemNavigationItems}
          currentProblemId={currentProblem?.competitionProblemId}
          answeredProblemIds={
            new Set(Object.keys(selectedOptionByProblemId).map(Number))
          }
          onSelectProblem={(competitionProblemId) => {
            void loadProblem(competitionProblemId);
          }}
        />
        <QuestionPanel
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
