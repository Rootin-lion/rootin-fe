"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import CheckIcon from "@/assets/icons/competitions/result/check.png";
import type {
  CompetitionResultState,
  ProblemResult,
  ProblemResultState,
} from "@/types/competitions/competition";
import { getResultProblemAction } from "@/app/(service)/competitions/action";
import ProblemPanel from "@/components/competition/shared/ProblemPanel";
import ErrorModal from "@/components/shared/ErrorModal";
import useErrorModal from "@/hooks/useErrorModal";
import DetailWrapper from "./DetailWrapper";

type ItemType = "CORRECT" | "WRONG" | "UNANSWERED";

interface ResultItemProps {
  type: ItemType;
  problem: ProblemResult;
  onClick: () => void;
  selected: boolean;
  detailsId: string;
}

const RESULT_ITEM_TYPE = {
  CORRECT: { title: "정답", bg: "bg-primary-900", text: "text-primary-900" },
  WRONG: { title: "오답", bg: "bg-error", text: "text-error" },
  UNANSWERED: {
    title: "미답",
    bg: "bg-disabled-text",
    text: "text-disabled-text",
  },
};

const ResultItem = ({
  type,
  problem,
  onClick,
  selected,
  detailsId,
}: ResultItemProps) => {
  return (
    <button
      type="button"
      aria-label={`${problem.problemOrder}번 문제, ${RESULT_ITEM_TYPE[type].title}, ${problem.score}점`}
      aria-expanded={selected}
      aria-controls={selected ? detailsId : undefined}
      className={`focus-visible:outline-primary-900 flex min-h-11 min-w-11 cursor-pointer flex-col items-center gap-2 rounded text-[12px] wrap-anywhere focus-visible:outline-2 focus-visible:outline-offset-2 md:min-w-0 md:gap-3 md:text-base ${selected ? "font-semibold" : ""}`}
      onClick={onClick}
    >
      <div
        className={`${RESULT_ITEM_TYPE[type].bg} flex h-7.5 w-7.5 items-center justify-center rounded-full text-white ${selected ? "scale-105" : ""}`}
      >
        {problem.problemOrder}
      </div>
      <p className={`${RESULT_ITEM_TYPE[type].text}`}>
        {RESULT_ITEM_TYPE[type].title}
      </p>
      <p>{problem.score}</p>
    </button>
  );
};

export default function ResultSection({
  competitionId,
  competitionResult,
}: {
  competitionId: number;
  competitionResult: CompetitionResultState;
}) {
  const [problemResult, setProblemResult] = useState<ProblemResultState | null>(
    null,
  );
  const detailsId = useId();
  const latestRequestRef = useRef(0);
  const { error, setErrorContext, isModalOpen, openModal, closeModal } =
    useErrorModal();

  const getResult = async (
    competitionId: number,
    competitionProblemId: number,
  ) => {
    const requestId = ++latestRequestRef.current;
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
      if (requestId !== latestRequestRef.current) return;

      if (!res.ok) {
        setErrorContext(res.error);
        openModal();

        return;
      }

      setProblemResult(res.data);
    } catch {
      if (requestId !== latestRequestRef.current) return;
      setErrorContext({
        code: "UNKNOWN_ERROR",
        message: "문제 조회에 실패했습니다.",
      });
      openModal();
    }
  };

  const answer = problemResult?.options.find(
    (option) => option.isAnswer === true,
  );

  return (
    <DetailWrapper>
      {isModalOpen && (
        <ErrorModal
          code={error.code}
          message={error.message}
          onClose={closeModal}
        />
      )}

      <div className="flex flex-col gap-1 p-4 md:flex-row md:flex-wrap md:items-center md:gap-3 md:px-5 md:py-7 lg:px-8">
        <h2 className="text-[14px] font-semibold text-black md:text-[16px]">
          문제별 결과
        </h2>
        <p className="text-sub-text mt-0.5 text-[10px] font-medium">
          번호를 클릭하면 해당 문제를 바로 볼 수 있어요.
        </p>
      </div>
      <div
        className="grid grid-cols-5 items-start gap-x-2 gap-y-4 px-4 pb-4 md:flex md:flex-wrap md:justify-center md:gap-5 md:px-5 md:pb-11 lg:gap-12"
        role="group"
        aria-label="문제별 결과"
      >
        {competitionResult.problemResults.map((problem) => (
          <ResultItem
            key={problem.competitionProblemId}
            type={problem.status}
            problem={problem}
            selected={
              problemResult?.competitionProblemId ===
              problem.competitionProblemId
            }
            detailsId={detailsId}
            onClick={() =>
              getResult(competitionId, problem.competitionProblemId)
            }
          />
        ))}
      </div>

      {problemResult && (
        <div id={detailsId}>
          <ProblemPanel
            variant="result"
            currentProblem={problemResult}
            selectedOptionId={problemResult.selectedOptionId}
          />
          <div className="flex min-w-0 flex-col gap-4 px-4 pb-4 wrap-anywhere md:gap-6 md:px-6 md:pb-7 lg:px-8">
            <div className="text-primary">
              <div className="flex flex-row items-center gap-1">
                <Image
                  src={CheckIcon}
                  alt=""
                  className="h-4 w-4 md:h-5 md:w-5"
                />
                <h3 className="text-[14px] font-semibold md:text-[18px]">
                  정답
                </h3>
              </div>
              <p className="text-[12px] font-semibold whitespace-pre-wrap md:text-[14px]">
                {answer?.optionContent ? answer.optionContent : "-"}
              </p>
            </div>
            <div>
              <h3 className="text-[14px] font-semibold text-black md:text-[18px]">
                정답 및 해설
              </h3>
              <p className="text-text text-[12px] leading-relaxed font-normal whitespace-pre-wrap">
                {problemResult.problemExplanation
                  ? problemResult.problemExplanation
                  : "-"}
              </p>
            </div>
          </div>
        </div>
      )}
    </DetailWrapper>
  );
}
