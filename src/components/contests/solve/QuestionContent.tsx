"use client";

import ModalWrapper from "@/components/shared/ModalWrapper";
import QuestionPanel from "../shared/QuestionPanel";
import QuestionSidebar from "./QuestionSidebar";
import Button from "@/components/shared/Button";
import useModal from "@/hooks/useModal";
import useErrorModal from "@/hooks/useErrorModal";
import ErrorModal from "@/components/shared/ErrorModal";
import { useEffect, useState } from "react";
import { requestProblemsAction } from "@/app/(service)/contests/action";
import { useRouter } from "next/navigation";
import {
  CompetitionProblemDetail,
  CompetitionProblemSummary,
} from "@/types/contests/competition";

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
  const {
    error,
    setErrorContext,
    isModalOpen: isErrorModalOpen,
    openModal: openErrorModal,
    closeModal: closeErrorModal,
  } = useErrorModal();
  const { isModalOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    const getProblems = async () => {
      try {
        const res = await requestProblemsAction(competitionId);

        if (!res.ok) {
          setErrorContext(res.error);
          openErrorModal();

          return;
        }
        setProblemNavigationItems(res.data.problems);
        setCurrentProblem(res.data.firstProblem);
      } catch {
        setErrorContext({
          code: "UNKNOWN_ERROR",
          message: "문제를 불러오지 못했습니다.",
        });

        openErrorModal();
      }
    };

    getProblems();
  }, [competitionId, setErrorContext, openErrorModal]);

  return (
    <div className="bg-primary-50 min-h-dvh">
      {isErrorModalOpen && (
        <ErrorModal
          code={error.code}
          message={error.message}
          onClose={() => {
            closeErrorModal();
            router.replace("/contests");
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
              <Button isActive={true} className="max-h-7.5">
                제출하기
              </Button>
            </div>
          </ModalWrapper.Box>
        </ModalWrapper>
      )}

      <div className="mx-auto flex w-full max-w-5xl flex-row gap-4 pt-9">
        <QuestionSidebar problemNavigationItems={problemNavigationItems} />
        <QuestionPanel currentProblem={currentProblem} onNext={openModal} />
      </div>
    </div>
  );
}
