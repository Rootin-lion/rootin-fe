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
      className="bg-primary border-primary focus-visible:outline-primary-900 min-h-9 cursor-pointer rounded-lg border px-3 py-1.5 text-[12px] font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2 md:min-h-0 md:px-4.5 md:text-[13px]"
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
      className="focus-visible:outline-primary-900 min-h-9 cursor-pointer rounded-lg border border-[#E1E1E1] px-3 py-1.5 text-[12px] font-medium text-black focus-visible:outline-2 focus-visible:outline-offset-2 md:min-h-0 md:px-4 md:py-2 md:text-[13px]"
    >
      {NAVIGATION_TEXT[direction]}
    </button>
  );
};

export default function ProblemButtonBox({
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
    <div
      className={`flex gap-3 ${isFirst ? "justify-end" : "justify-between"}`}
    >
      {!isFirst && <NavigationButton direction="prev" onClick={onPrevious} />}

      {isLast ? (
        <SubmitButton onClick={onSubmit} />
      ) : (
        <NavigationButton direction="next" onClick={onNext} />
      )}
    </div>
  );
}
