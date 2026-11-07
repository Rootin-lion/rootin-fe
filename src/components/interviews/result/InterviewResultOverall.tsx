import type { InterviewReportState } from "@/types/interviews/interview";
import InterviewResultAccuracyBar from "./InterviewResultAccuracyBar";

export default function InterviewResultOverall({
  interviewReport,
}: {
  interviewReport: InterviewReportState;
}) {
  const accuracy = interviewReport?.averageAccuracy || 0;
  const feedbacks =
    interviewReport.overallFeedback
      .match(/[^.]+(?:\.|$)/g)
      ?.map((feedback) => feedback.trim()) ?? [];

  return (
    <div className="bg-primary-50 flex w-full max-w-214 flex-col gap-4 rounded-lg p-4 wrap-anywhere md:flex-row md:px-0">
      <div className="text-text flex min-w-0 flex-col items-center font-medium md:pr-5 md:pl-6 lg:pl-9">
        <h3 className="text-[16px]">평균 정확도</h3>
        <p className="mt-2 text-[14px]">{accuracy}%</p>
        <InterviewResultAccuracyBar
          accuracy={accuracy}
          label="평균 정확도"
          className="mt-3 h-3 w-full max-w-51.75 md:h-4 md:w-40 lg:w-51.75"
        />
      </div>

      <div className="border-disabled-text border-t md:h-25.75 md:w-0 md:border"></div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <h3 className="text-primary-900 text-[16px] font-semibold">
          주요 피드백
        </h3>
        <ul className="text-text list-outside list-disc pr-3 pl-5 text-[12px] font-normal">
          {feedbacks.map((feedback, index) => (
            <li key={index}>{feedback}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
