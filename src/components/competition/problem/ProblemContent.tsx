"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import type { ApiError } from "@/types/api/error";
import ProblemPanel from "@/components/competition/shared/ProblemPanel";
import ErrorModal from "@/components/shared/ErrorModal";
import useErrorModal from "@/hooks/useErrorModal";
import ProblemAutoSubmitModal from "./ProblemAutoSubmitModal";
import ProblemSidebar from "./ProblemSidebar";
import ProblemSubmitModal from "./ProblemSubmitModal";
import useCompetitionProblems from "./useCompetitionProblems";
import useCompetitionSubmission from "./useCompetitionSubmission";

export default function ProblemContent({
  competitionId,
}: {
  competitionId: number;
}) {
  const router = useRouter();
  const [shouldLeaveAfterError, setShouldLeaveAfterError] = useState(true);
  const { error, setErrorContext, isModalOpen, openModal, closeModal } =
    useErrorModal();
  const showProblemError = useCallback(
    (context: ApiError, shouldLeave: boolean) => {
      setShouldLeaveAfterError(shouldLeave);
      setErrorContext(context);
      openModal();
    },
    [openModal, setErrorContext],
  );
  const showSubmissionError = useCallback(
    (context: ApiError) => {
      setErrorContext(context);
      openModal();
    },
    [openModal, setErrorContext],
  );
  const {
    problemNavigationItems,
    currentProblem,
    selectedOptionByProblemId,
    isFirstProblem,
    isLastProblem,
    loadProblem,
    handlePreviousProblem,
    handleNextProblem,
    handleSelectOption,
  } = useCompetitionProblems(competitionId, showProblemError);
  const {
    activeSubmitModal,
    openSubmitConfirmModal,
    closeSubmitModal,
    submitCompetition,
  } = useCompetitionSubmission(competitionId, showSubmissionError);

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
