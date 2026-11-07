import type { ReactNode } from "react";
import type { InterviewReportQuestion } from "@/types/interviews/interview";
import InterviewResultAccuracyBar from "./InterviewResultAccuracyBar";

function DetailMetricLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-sub-text shrink-0 text-[11px] font-semibold md:text-[12px]">
      {children}
    </p>
  );
}

function RecommendedConceptItem({ concept }: { concept: string }) {
  return (
    <li className="bg-primary-100 text-primary-900 max-w-full rounded-full px-2 py-1 text-[11px] font-medium wrap-anywhere max-md:leading-relaxed md:px-3 md:text-[12px]">
      {concept}
    </li>
  );
}

export default function InterviewResultQuestionFeedbackBody({
  question,
}: {
  question: InterviewReportQuestion;
}) {
  const recommendedConcepts = question.missingKeywords
    .split(",")
    .map((concept) => concept.trim())
    .filter((concept) => concept !== "" && concept !== "없음");

  return (
    <div className="flex min-w-0 flex-col gap-3 md:gap-5 md:px-2">
      <div className="grid grid-cols-1 items-start gap-1.5 md:grid-cols-[60px_minmax(0,1fr)] md:gap-4">
        <h4 className="text-xs font-semibold text-black md:text-[14px]">내 답변</h4>
        <p className="rounded-lg border border-[#E0E0E0] bg-[#F1F1F1] px-3 py-2 text-xs font-normal wrap-anywhere whitespace-pre-wrap text-[#1a1a1a] max-md:leading-relaxed md:text-[14px]">
          {question.answer}
        </p>
      </div>
      <div className="grid grid-cols-1 items-start gap-1.5 md:grid-cols-[60px_minmax(0,1fr)] md:gap-4">
        <h4 className="text-xs font-semibold text-black md:text-[14px]">피드백</h4>
        <p className="rounded-lg border border-[#FFB4B4] bg-[#FCEEEE] px-3 py-2 text-xs font-normal wrap-anywhere whitespace-pre-wrap text-[#1a1a1a] max-md:leading-relaxed md:text-[14px]">
          {question.feedback}
        </p>
      </div>
      <div className="md:pl-19">
        <div className="flex flex-wrap items-center gap-2 md:gap-4">
          <DetailMetricLabel>정확도</DetailMetricLabel>
          <InterviewResultAccuracyBar
            accuracy={question.accuracy}
            label={`${question.questionOrder}번 질문 정확도`}
            className="h-2 w-25"
          />
          <p className="text-primary text-xs font-semibold md:text-[14px]">
            {question.accuracy}%
          </p>
        </div>
        <div className="mt-3 flex flex-col items-start gap-2 md:mt-2 md:flex-row md:items-center md:gap-6">
          <DetailMetricLabel>보완 학습 추천 개념</DetailMetricLabel>
          {recommendedConcepts.length > 0 ? (
            <ul className="flex min-w-0 flex-wrap gap-1.5 md:gap-4">
              {recommendedConcepts.map((concept) => (
                <RecommendedConceptItem key={concept} concept={concept} />
              ))}
            </ul>
          ) : (
            <p className="text-sub-text text-[11px] md:text-[12px]">없음</p>
          )}
        </div>
      </div>
    </div>
  );
}
