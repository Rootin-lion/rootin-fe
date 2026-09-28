import type { CompetitionProblemSummary } from "@/types/contests/competition";

import QuestionNavigator from "./QuestionNavigator";
import QuestionTimer from "./QuestionTimer";

export default function QuestionSidebar({
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
    <div className="flex flex-col gap-4">
      <QuestionTimer />
      <QuestionNavigator
        problemNavigationItems={problemNavigationItems}
        currentProblemId={currentProblemId}
        answeredProblemIds={answeredProblemIds}
        onSelectProblem={onSelectProblem}
      />
    </div>
  );
}
