import InterviewMessage from "./InterviewMessage";

export default function InterviewChat() {
  return (
    <div className="interview-scrollbar flex w-full max-w-167 flex-col gap-4 overflow-y-auto pr-10">
      <InterviewMessage type="AI" />
      <InterviewMessage type="AI" />
      <InterviewMessage type="CLIENT" />
      <InterviewMessage type="AI" />
      <InterviewMessage type="AI" />
      <InterviewMessage type="CLIENT" />
      <InterviewMessage type="AI" />
      <InterviewMessage type="AI" />
      <InterviewMessage type="CLIENT" />
    </div>
  );
}
