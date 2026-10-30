import type {
  CompetitionProblemDetail,
  PanelType,
} from "@/types/competitions/competition";
import QuestionButtonBox from "@/components/competition/problem/ProblemButtonBox";
import QuestionCard from "@/components/competition/problem/ProblemCard";
import QuestionSurface from "@/components/competition/problem/ProblemSurface";

const NumberLabel = ({ number }: { number?: number }) => {
  return (
    <div className="text-primary-900 bg-primary-100 flex h-6 w-12.5 items-center justify-center rounded-xl text-[10px] font-medium">
      {number ? number : "-"}번 문제
    </div>
  );
};

export default function ProblemPanel({
  variant = "solve",
  currentProblem,
  children,
  selectedOptionId,
  selectedOptionIndex,
  isFirstProblem = false,
  isLastProblem = false,
  onSelectOption,
  onSelectOptionIndex,
  onPrevious,
  onNext,
  onSubmit,
}: {
  variant?: PanelType;
  currentProblem?: CompetitionProblemDetail | null;
  children?: React.ReactNode;
  selectedOptionId?: number;
  selectedOptionIndex?: number;
  isFirstProblem?: boolean;
  isLastProblem?: boolean;
  onSelectOption?: (selectedOptionId: number) => void;
  onSelectOptionIndex?: (index: number) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  onSubmit?: () => void;
}) {
  if (currentProblem === null) return null;

  return (
    <QuestionSurface>
      <div className="flex h-full flex-col justify-between gap-4">
        <div className="flex flex-col gap-7">
          {variant === "solve" && (
            <NumberLabel number={currentProblem?.problemOrder} />
          )}
          <QuestionCard
            variant={variant}
            currentProblem={currentProblem}
            showBookmark={variant === "result" || variant === "bookmark"}
            selectedOptionId={selectedOptionId}
            selectedOptionIndex={selectedOptionIndex}
            onSelectOption={onSelectOption}
            onSelectOptionIndex={onSelectOptionIndex}
          />
          {children}
        </div>
        {variant === "solve" && (
          <QuestionButtonBox
            isFirst={isFirstProblem}
            isLast={isLastProblem}
            onPrevious={onPrevious}
            onNext={onNext}
            onSubmit={onSubmit}
          />
        )}
      </div>
    </QuestionSurface>
  );
}
