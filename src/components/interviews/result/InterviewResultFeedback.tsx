import InterviewResultFeedbackGroup from "./InterviewResultFeedbackGroup";

export default function InterviewResultFeedback() {
  return (
    <div className="flex w-full max-w-5xl flex-row gap-4.5">
      <InterviewResultFeedbackGroup type="strength" />
      <InterviewResultFeedbackGroup type="improvement" />
    </div>
  );
}
