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
    <div className="px-6 py-8">
      <InterviewResultQuestionFeedbackBody question={question} />
      {followUpQuestions.map((followUpQuestion) => (
        <div
          key={followUpQuestion.questionId}
          className="mt-8 border-t border-[#E1E1E1] pt-8"
        >
          <div className="mb-6 flex flex-row items-start gap-4">
            <p className="text-primary-900 bg-primary-100 flex h-5 w-18 shrink-0 items-center justify-center rounded-xl text-[11px] font-semibold">
              꼬리질문
            </p>
            <p className="text-[14px] font-normal text-black">
              {followUpQuestion.question}
            </p>
          </div>
          <InterviewResultQuestionFeedbackBody question={followUpQuestion} />
        </div>
      ))}
    </div>
  );
}
