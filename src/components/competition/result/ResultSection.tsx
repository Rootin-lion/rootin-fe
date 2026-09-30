"use client";

import Image from "next/image";
import { useState } from "react";
import CheckIcon from "@/assets/competitions/result/check.png";
import type {
  CompetitionResultState,
  ProblemResult,
} from "@/types/competitions/competition";
import { getResultProblemAction } from "@/app/(service)/competitions/action";
import QuestionPanel from "@/components/competition/shared/ProblemPanel";
import ErrorModal from "@/components/shared/ErrorModal";
import useErrorModal from "@/hooks/useErrorModal";
import useModal from "@/hooks/useModal";
import DetailWrapper from "./DetailWrapper";

type ItemType = "CORRECT" | "WRONG" | "UNANSWERED";

interface ResultItemProps {
  type: ItemType;
  problem: ProblemResult;
  onClick: () => void;
}

interface ResultOptionState {
  optionId: number;
  optionContent: string;
  optionOrder: number;
  isAnswer: boolean;
}

interface ProbleResultState {
  competitionProblemId: number;
  problemId: number;
  problemOrder: number;
  problemTitle: string;
  problemContent: string;
  category: string;
  problemExplanation: string;
  options: ResultOptionState[];
  selectedOptionId: number;
  correct: boolean;
}

const RESULT_ITEM_TYPE = {
  CORRECT: { title: "정답", bg: "bg-primary-900" },
  WRONG: { title: "오답", bg: "bg-error" },
  UNANSWERED: { title: "미답", bg: "bg-disabled-text" },
};

const ResultItem = ({ type, problem, onClick }: ResultItemProps) => {
  return (
    <div
      className="flex cursor-pointer flex-col items-center gap-3"
      onClick={onClick}
    >
      <div
        className={`${RESULT_ITEM_TYPE[type].bg} flex h-7.5 w-7.5 items-center justify-center rounded-[50%] text-white`}
      >
        1
      </div>
      <p>{RESULT_ITEM_TYPE[type].title}</p>
      <p>{problem.score}</p>
    </div>
  );
};

export default function ResultSection({
  competitionId,
  competitionResult,
}: {
  competitionId: number;
  competitionResult: CompetitionResultState;
}) {
  const [problemResult, setProblemResult] = useState<ProbleResultState | null>(
    null,
  );
  const { isModalOpen, openModal, closeModal } = useModal();
  const {
    error,
    setErrorContext,
    isModalOpen: isErrorModalOpne,
    openModal: openErrorModal,
    closeModal: closeErrorModal,
  } = useErrorModal();

  const getResult = async (
    competitionId: number,
    competitionProblemId: number,
  ) => {
    if (
      problemResult &&
      problemResult.competitionProblemId === competitionProblemId
    ) {
      setProblemResult(null);

      return;
    }

    try {
      const res = await getResultProblemAction(
        competitionId,
        competitionProblemId,
      );

      if (!res.ok) {
        setErrorContext(res.error);
        openErrorModal();

        return;
      }

      setProblemResult(res.data);
    } catch {
      setErrorContext({
        code: "UNKNOWN_ERROR",
        message: "문제 조회에 실패했습니다.",
      });
      openErrorModal();
    }
  };

  const answer = problemResult?.options.find(
    (option) => option.isAnswer === true,
  );

  return (
    <DetailWrapper>
      {isErrorModalOpne && (
        <ErrorModal
          code={error.code}
          message={error.message}
          onClose={closeErrorModal}
        />
      )}

      <div className="flex items-center gap-3 px-8 py-7">
        <p className="text-[16px] font-semibold text-black">문제별 결과</p>
        <p className="text-sub-text mt-0.5 text-[10px] font-medium">
          번호를 클릭하면 해당 문제를 바로 볼 수 있어요.
        </p>
      </div>
      <div className="flex items-center justify-center gap-12 pb-11">
        {competitionResult.problemResults.map((problem) => (
          <ResultItem
            key={problem.competitionProblemId}
            type={problem.status}
            problem={problem}
            onClick={() =>
              getResult(competitionId, problem.competitionProblemId)
            }
          />
        ))}
      </div>

      {problemResult && (
        <>
          <QuestionPanel
            variant="result"
            currentProblem={problemResult}
            selectedOptionId={problemResult.selectedOptionId}
          />
          <div className="flex flex-col gap-6 px-8 pb-7">
            <div className="text-primary">
              <div className="flex flex-row items-center gap-1">
                <Image src={CheckIcon} alt="check" className="h-5 w-5" />
                <h2 className="text-[18px] font-semibold">정답</h2>
              </div>
              <p className="text-[14px] font-semibold">
                {answer?.optionContent ? answer.optionContent : "-"}
              </p>
            </div>
            <div>
              <h2 className="text-[18px] font-semibold text-black">
                정답 및 해설
              </h2>
              <p className="text-text text-[12px] font-normal">
                {problemResult.problemExplanation
                  ? problemResult.problemExplanation
                  : "-"}
              </p>
            </div>
          </div>
        </>
      )}
    </DetailWrapper>
  );
}
