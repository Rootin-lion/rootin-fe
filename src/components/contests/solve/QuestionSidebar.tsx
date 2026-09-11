import QuestionNavigator from "./QuestionNavigator";
import QuestionTimer from "./QuestionTimer";

export default function QuestionSidebar() {
  return (
    <div className="flex flex-col gap-4">
      <QuestionTimer />
      <QuestionNavigator />
    </div>
  );
}
