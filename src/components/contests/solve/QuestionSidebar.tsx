import { CompetitionProblemSummary } from "@/types/contests/competition";
import QuestionNavigator from "./QuestionNavigator";
import QuestionTimer from "./QuestionTimer";

export default function QuestionSidebar({
  problemNavigationItems,
}: {
  problemNavigationItems: CompetitionProblemSummary[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <QuestionTimer />
      <QuestionNavigator problemNavigationItems={problemNavigationItems} />
    </div>
  );
}
