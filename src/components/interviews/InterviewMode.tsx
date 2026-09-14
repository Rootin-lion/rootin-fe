import type { InterviewModeType } from "@/types/interviews/interview";

import OptionButton from "@/components/shared/OptionButton";

export default function InterviewMode({
  interviewMode,
  onChange,
}: {
  interviewMode: InterviewModeType;
  onChange: (mode: InterviewModeType) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-body-3 text-text">면접 방식</div>
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
          onClick={() => onChange("VOICE")}
        >
          음성
        </OptionButton>
      </div>
    </div>
  );
}
