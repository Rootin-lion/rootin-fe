import type { InterviewModeType } from "@/types/interviews/interview";
import OptionButton from "@/components/shared/OptionButton";

export default function InterviewMode({
  interviewMode,
  onChange,
  voiceDisabled = false,
}: {
  interviewMode: InterviewModeType;
  onChange: (mode: InterviewModeType) => void;
  voiceDisabled?: boolean;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="text-body-3 text-text mb-2">면접 방식</legend>
      <div className="grid grid-cols-2 gap-2">
        <OptionButton
          variant="filled"
          selected={interviewMode === "TEXT"}
          onClick={() => onChange("TEXT")}
        >
          텍스트
        </OptionButton>
        <OptionButton
          variant="filled"
          selected={interviewMode === "VOICE"}
          disabled={voiceDisabled}
          onClick={() => onChange("VOICE")}
        >
          음성
        </OptionButton>
      </div>
      {voiceDisabled && (
        <p className="text-sub-text mt-2 text-xs">
          음성 면접은 태블릿부터 가능해요.
        </p>
      )}
    </fieldset>
  );
}
