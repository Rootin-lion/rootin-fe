import QuestionButtonBox from "../solve/QuestionButtonBox";
import QuestionCard from "../solve/QuestionCard";
import QuestionSurface from "../solve/QuestionSurface";

type PanelType = "solve" | "result";

const NumberLabel = () => {
  return (
    <div className="text-primary-900 bg-primary-100 flex h-6 w-12.5 items-center justify-center rounded-xl text-[10px] font-medium">
      1번 문제
    </div>
  );
};

export default function QuestionPanel({
  variant = "solve",
}: {
  variant?: PanelType;
}) {
  return (
    <QuestionSurface>
      <div className="flex h-full flex-col justify-between">
        <div className="flex flex-col gap-7">
          {variant === "solve" && <NumberLabel />}
          <QuestionCard showBookmark={variant === "result"} />
        </div>
        {variant === "solve" && <QuestionButtonBox status="isLast" />}
      </div>
    </QuestionSurface>
  );
}
