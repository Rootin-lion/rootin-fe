import QuestionPanel from "@/components/contests/solve/Questionpanel";
import QuestionSidebar from "@/components/contests/solve/QuestionSidebar";

export default function ContestSolvePage() {
  return (
    <div className="bg-primary-50 min-h-dvh">
      <div className="mx-auto flex w-full max-w-5xl flex-row gap-4 pt-9">
        <QuestionSidebar />
        <QuestionPanel />
      </div>
    </div>
  );
}
