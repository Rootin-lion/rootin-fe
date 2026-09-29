import Image from "next/image";
import NavImg from "@/assets/competitions/solve/nav_char.png";
import type { CompetitionProblemSummary } from "@/types/competitions/competition";
import QuestionStatus from "./ProblemStatus";
import QuestionSurface from "./ProblemSurface";

const NavItem = ({
  children,
  isCurrent,
  isAnswered,
  onClick,
}: {
  children: React.ReactNode;
  isCurrent: boolean;
  isAnswered: boolean;
  onClick: () => void;
}) => {
  const statusClassName = isAnswered
    ? "bg-primary-900 text-white"
    : isCurrent
      ? "border-primary-900 border bg-[#EBF1EC] text-[#1A1A1A]"
      : "bg-bg-green-50 text-[#1A1A1A]";

  return (
    <button
      type="button"
      aria-current={isCurrent ? "step" : undefined}
      onClick={onClick}
      className={`flex h-7.5 w-7.5 cursor-pointer items-center justify-center rounded-[3px] text-[12px] font-medium ${statusClassName}`}
    >
      {children}
    </button>
  );
};

export default function ProblemNavigator({
  problemNavigationItems,
  currentProblemId,
  answeredProblemIds,
  onSelectProblem,
}: {
  problemNavigationItems: CompetitionProblemSummary[];
  currentProblemId?: number;
  answeredProblemIds: ReadonlySet<number>;
  onSelectProblem: (competitionProblemId: number) => void;
}) {
  return (
    <QuestionSurface>
      <h2 className="text-[13px] font-semibold text-black">문제 목록</h2>
      <div className="mt-5 grid grid-cols-5 gap-1">
        {problemNavigationItems.map((problemNavigationItem) => (
          <NavItem
            key={problemNavigationItem.competitionProblemId}
            isCurrent={
              problemNavigationItem.competitionProblemId === currentProblemId
            }
            isAnswered={answeredProblemIds.has(
              problemNavigationItem.competitionProblemId,
            )}
            onClick={() =>
              onSelectProblem(problemNavigationItem.competitionProblemId)
            }
          >
            {problemNavigationItem.problemOrder}
          </NavItem>
        ))}
      </div>
      <QuestionStatus />
      <Image src={NavImg} alt="" width={162} height={159} className="mt-15" />
    </QuestionSurface>
  );
}
