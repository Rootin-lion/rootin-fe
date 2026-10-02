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
    <div className="flex flex-col gap-4">
      <QuestionTimer onExpire={onExpire} />
      <QuestionNavigator
        problemNavigationItems={problemNavigationItems}
        currentProblemId={currentProblemId}
        answeredProblemIds={answeredProblemIds}
        onSelectProblem={onSelectProblem}
      />
    </div>
  );
}
