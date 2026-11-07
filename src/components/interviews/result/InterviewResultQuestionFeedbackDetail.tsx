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
    <div className="px-3 py-5 md:px-6 md:py-8">
      <InterviewResultQuestionFeedbackBody question={question} />
      {followUpQuestions.map((followUpQuestion) => (
        <div
          key={followUpQuestion.questionId}
          className="mt-8 border-t border-[#E1E1E1] pt-8"
        >
          <div className="mb-4 flex flex-col items-start gap-2 md:mb-6 md:flex-row md:gap-4">
            <p className="text-primary-900 bg-primary-100 flex h-5 w-18 shrink-0 items-center justify-center rounded-xl text-[11px] font-semibold">
              꼬리질문
            </p>
            <p className="min-w-0 text-xs font-normal wrap-anywhere text-black md:text-[14px]">
              {followUpQuestion.question}
            </p>
          </div>
          <InterviewResultQuestionFeedbackBody question={followUpQuestion} />
        </div>
      ))}
    </div>
  );
}
