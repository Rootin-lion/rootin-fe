import DetailWrapper from "./DetailWrapper";

type ItemType = "CORRECT" | "INCORRECT" | "UNANSWERED";

interface ResultItemProps {
  type: ItemType;
}

const RESULT_ITEM_TYPE = {
  CORRECT: { title: "정답", score: "10점", bg: "bg-primary-900" },
  INCORRECT: { title: "오답", score: "0점", bg: "bg-error" },
  UNANSWERED: { title: "미답", score: "0점", bg: "bg-disabled-text" },
};

const ResultItem = ({ type }: ResultItemProps) => {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`${RESULT_ITEM_TYPE[type].bg} flex h-7.5 w-7.5 items-center justify-center rounded-[50%] text-white`}
      >
        1
      </div>
      <p>{RESULT_ITEM_TYPE[type].title}</p>
      <p>{RESULT_ITEM_TYPE[type].score}</p>
    </div>
  );
};

export default function ResultSection() {
  return (
    <DetailWrapper>
      <div className="flex items-center gap-3 px-8 py-7">
        <p className="text-[16px] font-semibold text-black">문제별 결과</p>
        <p className="text-sub-text mt-0.5 text-[10px] font-medium">
          번호를 클릭하면 해당 문제를 바로 볼 수 있어요.
        </p>
      </div>
      <div className="flex items-center justify-center gap-12 pb-11">
        <ResultItem type="CORRECT" />
        <ResultItem type="CORRECT" />
        <ResultItem type="CORRECT" />
        <ResultItem type="INCORRECT" />
        <ResultItem type="INCORRECT" />
        <ResultItem type="UNANSWERED" />
        <ResultItem type="CORRECT" />
        <ResultItem type="CORRECT" />
        <ResultItem type="CORRECT" />
        <ResultItem type="CORRECT" />
      </div>
    </DetailWrapper>
  );
}
