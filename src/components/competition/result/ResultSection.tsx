import Image from "next/image";
import CheckIcon from "@/assets/competitions/result/check.png";
import QuestionPanel from "../shared/ProblemPanel";
import DetailWrapper from "./DetailWrapper";
import {
  CompetitionResultState,
  ProblemResult,
} from "@/types/competitions/competition";

type ItemType = "CORRECT" | "WRONG" | "UNANSWERED";

interface ResultItemProps {
  type: ItemType;
  problem: ProblemResult;
}

const RESULT_ITEM_TYPE = {
  CORRECT: { title: "정답", bg: "bg-primary-900" },
  WRONG: { title: "오답", bg: "bg-error" },
  UNANSWERED: { title: "미답", bg: "bg-disabled-text" },
};

const ResultItem = ({ type, problem }: ResultItemProps) => {
  return (
    <div className="flex flex-col items-center gap-3">
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
  competitionResult,
}: {
  competitionResult: CompetitionResultState;
}) {
  return (
    <DetailWrapper>
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
          />
        ))}
      </div>

      <QuestionPanel variant="result" />
      <div className="flex flex-col gap-6 px-8 pb-7">
        <div className="text-primary">
          <div className="flex flex-row items-center gap-1">
            <Image src={CheckIcon} alt="check" className="h-5 w-5" />
            <h2 className="text-[18px] font-semibold">정답</h2>
          </div>
          <p className="text-[14px] font-semibold">
            하나의 프로세스는 하나 이상의 스레드를 가질 수 있다.{" "}
          </p>
        </div>
        <div>
          <h2 className="text-[18px] font-semibold text-black">정답 및 해설</h2>
          <p className="text-text text-[12px] font-normal">
            프로세스는 독립적인 메모리 공간을 가지며, 스레드는 프로세스 내에서
            코드, 데이터, 힙 영역을 공유합니다.
          </p>
        </div>
      </div>
    </DetailWrapper>
  );
}
