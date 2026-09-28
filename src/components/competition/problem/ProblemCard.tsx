import BookmarkAction from "@/components/shared/BookmarkAction";
import type {
  CompetitionProblemDetail,
  CompetitionProblemOption,
} from "@/types/competitions/competition";

const ProblemOption = ({
  option,
  selected,
  onSelect,
}: {
  option: CompetitionProblemOption;
  selected: boolean;
  onSelect?: () => void;
}) => {
  const isDisabled = !onSelect || selected;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={isDisabled}
      onClick={onSelect}
      className={`border-primary-200 flex h-15 w-full items-center gap-5 rounded-lg border pl-5 text-left ${selected ? "bg-primary-100 border-primary border" : "bg-white"} text-black ${isDisabled ? "cursor-default" : "cursor-pointer"}`}
    >
      {selected ? (
        <div className="border-primary shrink-0 rounded-[50%] border p-0.5">
          <div className="bg-primary h-2.5 w-2.5 shrink-0 rounded-[50%]" />
        </div>
      ) : (
        <span
          className={`h-3.5 w-3.5 rounded-full border ${selected ? "border-white bg-white" : "border-primary-200"}`}
        />
      )}
      <p className="text-[15px] font-medium">{option.optionContent}</p>
    </button>
  );
};

export default function ProblemCard({
  currentProblem,
  showBookmark = false,
  selectedOptionId,
  onSelectOption,
}: {
  currentProblem?: CompetitionProblemDetail;
  showBookmark?: boolean;
  selectedOptionId?: number;
  onSelectOption?: (selectedOptionId: number) => void;
}) {
  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-[18px] font-semibold text-black">
          {currentProblem?.problemContent}
        </h1>
        {showBookmark && <BookmarkAction />}
      </div>
      <div
        className="mt-7.5 flex flex-col gap-4"
        role="radiogroup"
        aria-label="답안 선택"
      >
        {currentProblem?.options.map((option) => (
          <ProblemOption
            key={option.optionId}
            option={option}
            selected={option.optionId === selectedOptionId}
            onSelect={
              onSelectOption ? () => onSelectOption(option.optionId) : undefined
            }
          />
        ))}
      </div>
    </div>
  );
}
