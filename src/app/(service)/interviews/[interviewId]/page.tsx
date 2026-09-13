import InterviewChat from "@/components/interviews/session/InterviewChat";
import InterviewForm from "@/components/interviews/session/InterviewForm";
import InterviewVideo from "@/components/interviews/session/InterviewVideo";

export default function InterviewSessionPage() {
  return (
    <div className="bg-bg-green-50 flex w-full flex-1 flex-col justify-between gap-11">
      <div className="mx-auto flex max-h-126 w-full max-w-5xl flex-row gap-10 pt-6">
        <InterviewChat />
        <InterviewVideo />
      </div>
      <div>
        <InterviewForm />
      </div>
    </div>
  );
}
