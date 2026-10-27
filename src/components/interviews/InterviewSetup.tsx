import type {
  InterviewConfig,
  InterviewCategoryType,
  InterviewModeType,
} from "@/types/interviews/interview";
import Button from "@/components/shared/Button";
import InterviewCount from "./InterviewCount";
import InterviewTopic from "./InterviewTopic";
import InterviewMode from "./InterviewMode";

export default function InterviewSetup({
  config,
  onCategoryChange,
  onQuestionCountChange,
  onInterviewModeChange,
  onStart,
}: {
  config: InterviewConfig;
  onCategoryChange: (category: InterviewCategoryType) => void;
  onQuestionCountChange: (questionCount: null | number) => void;
  onInterviewModeChange: (interviewMode: InterviewModeType) => void;
  onStart: () => void;
}) {
  const isValidQuestionCount =
    config.questionCount !== null &&
    Number.isInteger(config.questionCount) &&
    config.questionCount >= 1 &&
    config.questionCount <= 5;

  return (
    <div className="flex w-111 flex-col gap-6">
      <InterviewTopic category={config.category} onChange={onCategoryChange} />
      <InterviewCount
        questionCount={config.questionCount}
        onChange={onQuestionCountChange}
      />
      <InterviewMode
        interviewMode={config.interviewMode}
        onChange={onInterviewModeChange}
      />
      <Button
        isActive={isValidQuestionCount}
        disabled={!isValidQuestionCount}
        onClick={onStart}
      >
        면접 시작하기
      </Button>
    </div>
  );
}
