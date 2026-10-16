import { InterviewReportQuestion } from "@/types/interviews/interview";
import InterviewResultProlemItem from "./InterviewResultProblemItem";

export default function InterviewResultProblem({
  questions,
}: {
  questions: InterviewReportQuestion[];
}) {
  return (
    <div>
      <h3 className="text-[15px] leading-5.5 font-bold text-[#1a1a1a]">
        문항별 상세 피드백
      </h3>
      <div className="mt-3">
        {questions.map((question) => (
          <InterviewResultProlemItem
            key={question.questionId}
            question={question}
          />
        ))}
      </div>
    </div>
  );
}
