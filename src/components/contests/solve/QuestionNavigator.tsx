import Image from "next/image";
import NavImg from "@/assets/contests/solve/nav_char.png";
import QuestionSurface from "./QuestionSurface";
import QuestionStatus from "./QuestionStatus";
import { CompetitionProblemSummary } from "@/types/contests/competition";

const NavItem = ({ children }: { children: React.ReactNode }) => {
  // 일반 bg-bg-green-50 text-[#1A1A1A]
  // 포커스 bg-[#36723E.01] border border-primary-900
  // 선택 text-white bg-primary-900

  return (
    <div className="bg-bg-green-50 flex h-7.5 w-7.5 cursor-pointer items-center justify-center rounded-[3px] text-[12px] font-medium text-[#1A1A1A]">
      {children}
    </div>
  );
};

export default function QuestionNavigator({
  problemNavigationItems,
}: {
  problemNavigationItems: CompetitionProblemSummary[];
}) {
  return (
    <QuestionSurface>
      <h2 className="text-[13px] font-semibold text-black">문제 목록</h2>
      <div className="mt-5 grid grid-cols-5 gap-1">
        {problemNavigationItems.map((problemNavigationItem) => (
          <NavItem key={problemNavigationItem.competitionProblemId}>
            {problemNavigationItem.problemOrder}
          </NavItem>
        ))}
      </div>
      <QuestionStatus />
      <Image src={NavImg} alt="" width={162} height={159} className="mt-15" />
    </QuestionSurface>
  );
}
