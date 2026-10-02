import { InterviewReportState } from "@/types/interviews/interview";

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
    <div className="bg-primary-50 flex w-full max-w-214 flex-row gap-4 rounded-lg py-4">
      <div className="text-text flex flex-col items-center pr-5 pl-9 font-medium">
        <h3 className="text-[16px]">평균 정확도</h3>
        <p className="mt-2 text-[14px]">{accuracy}%</p>
        <div
          role="progressbar"
          aria-label="평균 정확도"
          aria-valuenow={accuracy}
          aria-valuemin={0}
          aria-valuemax={100}
          className="mt-3 h-4 w-51.75 overflow-hidden rounded-full bg-[#E5E7EB]"
        >
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,#6FB377_0%,#69AC70_50%,#36723E_100%)]"
            style={{ width: `${accuracy}%` }}
          />
        </div>
      </div>

      <div className="border-disabled-text h-25.75 w-0 border"></div>

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
