import type { InterviewReportQuestion } from "@/types/interviews/interview";
import InterviewResultQuestionFeedbackBody from "./InterviewResultQuestionFeedbackBody";

export default function InterviewResultQuestionFeedbackDetail({
  question,
  followUpQuestions,
}: {
  question: InterviewReportQuestion;
  followUpQuestions: InterviewReportQuestion[];
}) {
  return (
    <div className="p-3 md:px-6 md:py-8">
      <InterviewResultQuestionFeedbackBody question={question} />
      {followUpQuestions.map((followUpQuestion) => (
        <div
          key={followUpQuestion.questionId}
          className="mt-5 border-t border-[#E1E1E1] pt-5 md:mt-8 md:pt-8"
        >
          <div className="mb-3 flex flex-col items-start gap-1.5 md:mb-6 md:flex-row md:gap-4">
            <p className="text-primary-900 bg-primary-100 flex h-5 shrink-0 items-center justify-center rounded-xl px-2 text-[10px] font-semibold md:w-18 md:px-0 md:text-[11px]">
              꼬리질문
            </p>
            <p className="min-w-0 text-xs font-normal wrap-anywhere text-black max-md:leading-relaxed md:text-[14px]">
              {followUpQuestion.question}
            </p>
          </div>
          <InterviewResultQuestionFeedbackBody question={followUpQuestion} />
        </div>
      ))}
    </div>
  );
}
