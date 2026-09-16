type ButtonBoxType = "isFirst" | "isMiddle" | "isLast";
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
}: {
  direction: NavigationButtonType;
}) => {
  return (
    <button
      type="button"
      className="cursor-pointer rounded-lg border border-[#E1E1E1] px-4 py-2 text-[13px] font-medium text-black"
    >
      {NAVIGATION_TEXT[direction]}
    </button>
  );
};

export default function QuestionButtonBox({
  status,
  onClick,
}: {
  status: ButtonBoxType;
  onClick?: () => void;
}) {
  return (
    <div
      className={`flex ${status === "isFirst" ? "justify-end" : "justify-between"}`}
    >
      {status !== "isFirst" && <NavigationButton direction="prev" />}

      {status === "isLast" ? (
        <SubmitButton onClick={onClick} />
      ) : (
        <NavigationButton direction="next" />
      )}
    </div>
  );
}
