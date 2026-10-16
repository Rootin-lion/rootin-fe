import { InterviewReportQuestion } from "@/types/interviews/interview";
import type { ReactNode } from "react";

function DetailMetricLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-sub-text shrink-0 text-[12px] font-semibold">
      {children}
    </p>
  );
}

function RecommendedConceptItem({ concept }: { concept: string }) {
  return (
    <li className="bg-primary-100 text-primary-900 rounded-full px-3 py-1 text-[12px] font-medium">
      {concept}
    </li>
  );
}

export default function InterviewResultProblemItemDetail({
  question,
}: {
  question: InterviewReportQuestion;
}) {
  const recommendedConcepts = question.missingKeywords
    .split(",")
    .map((concept) => concept.trim())
    .filter((concept) => concept !== "" && concept !== "없음");

  return (
    <div className="flex flex-col gap-4 px-4 py-6">
      {/* <div className="flex flex-row gap-3">
        <p className="text-primary-900 flex h-5 w-14 items-center justify-center rounded-xl bg-[#EEF6E8] text-[11px] font-semibold">
          꼬리 질문
        </p>
        <p className="text-[14px] font-normal text-black">
          프로세스와 스레드의 차이점을 설명해주세요.
        </p>
      </div> */}
      <div className="flex flex-row items-start gap-4">
        <h4 className="text-[14px] font-semibold text-black">내 답변</h4>
        <p className="border-primary-200 bg-primary-50 flex-1 rounded-lg border px-3 py-2 text-[14px] font-normal text-[#1a1a1a]">
          {question.answer}
        </p>
      </div>
      <div className="flex flex-row items-start gap-4">
        <h4 className="text-[14px] font-semibold text-black">피드백</h4>
        <p className="flex-1 rounded-lg border border-[#F2DEC8] bg-[#FFF9F2] px-3 py-2 text-[14px] font-normal text-[#1a1a1a]">
          {question.feedback}
        </p>
      </div>
      <div className="pl-14">
        <div className="flex items-center gap-4">
          <DetailMetricLabel>정확도</DetailMetricLabel>
          <div
            role="progressbar"
            aria-valuenow={question.accuracy}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-2 w-25 overflow-hidden rounded-full bg-[#E5E7EB]"
          >
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#6FB377_0%,#69AC70_50%,#36723E_100%)]"
              style={{ width: `${question.accuracy}%` }}
            />
          </div>
          <p className="text-primary text-[14px] font-semibold">
            {question.accuracy}%
          </p>
        </div>
        <div className="mt-2 flex items-center gap-6">
          <DetailMetricLabel>보완 학습 추천 개념</DetailMetricLabel>
          {recommendedConcepts.length > 0 ? (
            <ul className="flex flex-wrap gap-4">
              {recommendedConcepts.map((concept) => (
                <RecommendedConceptItem key={concept} concept={concept} />
              ))}
            </ul>
          ) : (
            <p className="text-sub-text text-[12px]">없음</p>
          )}
        </div>
      </div>
    </div>
  );
}
