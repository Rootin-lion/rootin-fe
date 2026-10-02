import { InterviewReportState } from "@/types/interviews/interview";
import InterviewResultFeedbackGroup from "./InterviewResultFeedbackGroup";

export default function InterviewResultFeedback({
  interviewReport,
}: {
  interviewReport: InterviewReportState;
}) {
  return (
    <div className="flex w-full max-w-5xl flex-row gap-4.5">
      <InterviewResultFeedbackGroup
        type="strength"
        items={interviewReport.strengths}
      />
      <InterviewResultFeedbackGroup
        type="improvement"
        items={interviewReport.weaknesses}
      />
    </div>
  );
}
