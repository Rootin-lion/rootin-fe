import type { ReactNode } from "react";
import type { InterviewReportQuestion } from "@/types/interviews/interview";
import InterviewResultAccuracyBar from "./InterviewResultAccuracyBar";

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
    <div className="flex flex-col gap-5 px-2">
      <div className="grid grid-cols-[60px_minmax(0,1fr)] items-start gap-4">
        <h4 className="text-[14px] font-semibold text-black">내 답변</h4>
        <p className="rounded-lg border border-[#E0E0E0] bg-[#F1F1F1] px-3 py-2 text-[14px] font-normal text-[#1a1a1a]">
          {question.answer}
        </p>
      </div>
      <div className="grid grid-cols-[60px_minmax(0,1fr)] items-start gap-4">
        <h4 className="text-[14px] font-semibold text-black">피드백</h4>
        <p className="rounded-lg border border-[#FFB4B4] bg-[#FCEEEE] px-3 py-2 text-[14px] font-normal text-[#1a1a1a]">
          {question.feedback}
        </p>
      </div>
      <div className="pl-19">
        <div className="flex items-center gap-4">
          <DetailMetricLabel>정확도</DetailMetricLabel>
          <InterviewResultAccuracyBar
            accuracy={question.accuracy}
            label={`${question.questionOrder}번 질문 정확도`}
            className="h-2 w-25"
          />
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
