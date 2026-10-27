import type { InterviewReportQuestion } from "@/types/interviews/interview";
import InterviewResultQuestionFeedbackItem from "./InterviewResultQuestionFeedbackItem";

export default function InterviewResultQuestionFeedback({
  questions,
}: {
  questions: InterviewReportQuestion[];
}) {
  const questionGroups: {
    mainQuestion: InterviewReportQuestion;
    followUpQuestions: InterviewReportQuestion[];
  }[] = [];

  questions.forEach((question) => {
    if (question.questionType === "BASIC" || questionGroups.length === 0) {
      questionGroups.push({ mainQuestion: question, followUpQuestions: [] });
    } else {
      questionGroups[questionGroups.length - 1].followUpQuestions.push(
        question,
      );
    }
  });

  return (
    <div>
      <h3 className="text-[15px] leading-5.5 font-bold text-[#1a1a1a]">
        문항별 상세 피드백
      </h3>
      <div className="mt-3">
        {questionGroups.map(({ mainQuestion, followUpQuestions }) => (
          <InterviewResultQuestionFeedbackItem
            key={mainQuestion.questionId}
            question={mainQuestion}
            followUpQuestions={followUpQuestions}
          />
        ))}
      </div>
    </div>
  );
}
