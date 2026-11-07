import type { CompetitionProblemSummary } from "@/types/competitions/competition";
import QuestionNavigator from "./ProblemNavigator";
import QuestionTimer from "./ProblemTimer";

export default function ProblemSidebar({
  problemNavigationItems,
  currentProblemId,
  answeredProblemIds,
  onSelectProblem,
  onExpire,
}: {
  problemNavigationItems: CompetitionProblemSummary[];
  currentProblemId?: number;
  answeredProblemIds: ReadonlySet<number>;
  onSelectProblem: (competitionProblemId: number) => void;
  onExpire: () => void;
}) {
  return (
    <aside className="contents md:flex md:min-w-0 md:flex-col md:gap-4">
      <div className="sticky top-0 z-20 md:static md:z-auto">
        <QuestionTimer onExpire={onExpire} />
      </div>
      <QuestionNavigator
        problemNavigationItems={problemNavigationItems}
        currentProblemId={currentProblemId}
        answeredProblemIds={answeredProblemIds}
        onSelectProblem={onSelectProblem}
      />
    </aside>
  );
}
