type NavigationButtonType = "prev" | "next";

const NAVIGATION_TEXT = {
  prev: "이전 문제",
  next: "다음 문제",
};

const SubmitButton = ({ onClick }: { onClick?: () => void }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-primary border-primary cursor-pointer rounded-lg border px-4.5 py-1.5 text-[13px] font-medium text-white"
    >
      제출하기
    </button>
  );
};

const NavigationButton = ({
  direction,
  onClick,
}: {
  direction: NavigationButtonType;
  onClick?: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer rounded-lg border border-[#E1E1E1] px-4 py-2 text-[13px] font-medium text-black"
    >
      {NAVIGATION_TEXT[direction]}
    </button>
  );
};

export default function QuestionButtonBox({
  isFirst,
  isLast,
  onPrevious,
  onNext,
  onSubmit,
}: {
  isFirst: boolean;
  isLast: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  onSubmit?: () => void;
}) {
  return (
    <div className={`flex ${isFirst ? "justify-end" : "justify-between"}`}>
      {!isFirst && <NavigationButton direction="prev" onClick={onPrevious} />}

      {isLast ? (
        <SubmitButton onClick={onSubmit} />
      ) : (
        <NavigationButton direction="next" onClick={onNext} />
      )}
    </div>
  );
}
