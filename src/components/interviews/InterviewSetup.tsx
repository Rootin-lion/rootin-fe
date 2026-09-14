import type InterviewConfig from "@/types/interviews/interview";
import type {
  InterviewFieldType,
  InterviewModeType,
} from "@/types/interviews/interview";

import Button from "@/components/shared/Button";

import InterviewCount from "./InterviewCount";
import InterviewMode from "./InterviewMode";
import InterviewTopic from "./InterviewField";

export default function InterviewSetup({
  config,
  onFieldChange,
  onQuestionCountChange,
  onInterviewModeChange,
}: {
  config: InterviewConfig;
  onFieldChange: (field: InterviewFieldType) => void;
  onQuestionCountChange: (questionCount: null | number) => void;
  onInterviewModeChange: (interviewMode: InterviewModeType) => void;
}) {
  return (
    <div className="flex w-111 flex-col gap-6">
      <InterviewTopic field={config.field} onChange={onFieldChange} />
      <InterviewCount
        questionCount={config.questionCount}
        onChange={onQuestionCountChange}
      />
      <InterviewMode
        interviewMode={config.interviewMode}
        onChange={onInterviewModeChange}
      />
      <Button isActive={true}>면접 시작하기</Button>
    </div>
  );
}
