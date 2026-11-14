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
  voiceDisabled = false,
}: {
  config: InterviewConfig;
  onCategoryChange: (category: InterviewCategoryType) => void;
  onQuestionCountChange: (questionCount: null | number) => void;
  onInterviewModeChange: (interviewMode: InterviewModeType) => void;
  onStart: () => void;
  voiceDisabled?: boolean;
}) {
  const isValidQuestionCount =
    config.questionCount !== null &&
    Number.isInteger(config.questionCount) &&
    config.questionCount >= 1 &&
    config.questionCount <= 5;

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 md:w-111 md:gap-6 max-md:[&_button]:min-h-9 max-md:[&_button]:py-1.5 max-md:[&_button]:text-[11px]">
      <InterviewTopic category={config.category} onChange={onCategoryChange} />
      <InterviewCount
        questionCount={config.questionCount}
        onChange={onQuestionCountChange}
      />
      <InterviewMode
        interviewMode={config.interviewMode}
        onChange={onInterviewModeChange}
        voiceDisabled={voiceDisabled}
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
