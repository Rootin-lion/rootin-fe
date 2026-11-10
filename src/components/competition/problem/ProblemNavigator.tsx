import Image from "next/image";
import NavImg from "@/assets/images/competitions/solve/nav_char.png";
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
      ? "bg-[#EBF1EC] text-[#1A1A1A] md:border-primary-900 md:border"
      : "bg-bg-green-50 text-[#1A1A1A]";

  return (
    <button
      type="button"
      aria-current={isCurrent ? "step" : undefined}
      aria-label={`${children}번 문제, ${isCurrent ? "현재, " : ""}${isAnswered ? "풀이 완료" : "미풀이"}`}
      onClick={onClick}
      className="focus-visible:outline-primary-900 flex h-10 w-10 cursor-pointer items-center justify-center rounded-[3px] text-[12px] font-medium focus-visible:outline-2 focus-visible:outline-offset-2 md:h-7.5 md:w-7.5"
    >
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-[3px] transition-transform motion-reduce:transition-none md:h-7.5 md:w-7.5 ${statusClassName} ${isCurrent ? "max-md:scale-105 max-md:font-semibold" : ""}`}
      >
        {children}
      </span>
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
  const currentProblemOrder = problemNavigationItems.find(
    (problem) => problem.competitionProblemId === currentProblemId,
  )?.problemOrder;

  return (
    <QuestionSurface compact className="max-md:py-2">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[12px] font-semibold text-black md:text-[13px]">
          문제 목록
        </h2>
        <span className="text-sub-text text-[12px] md:hidden">
          {currentProblemOrder ?? "-"} / {problemNavigationItems.length}
        </span>
      </div>
      <div className="mt-2 grid grid-cols-5 justify-items-center gap-x-2 gap-y-1 md:mt-5 md:justify-items-start md:gap-1">
        {problemNavigationItems.map((problemNavigationItem) => (
          <NavItem
            key={problemNavigationItem.competitionProblemId}
            isCurrent={
              problemNavigationItem.competitionProblemId === currentProblemId
            }
            isAnswered={answeredProblemIds.has(
              problemNavigationItem.competitionProblemId,
            )}
            onClick={() => {
              onSelectProblem(problemNavigationItem.competitionProblemId);
            }}
          >
            {problemNavigationItem.problemOrder}
          </NavItem>
        ))}
      </div>
      <QuestionStatus />
      <Image
        src={NavImg}
        alt=""
        width={162}
        height={159}
        className="mt-15 hidden md:block"
      />
    </QuestionSurface>
  );
}
