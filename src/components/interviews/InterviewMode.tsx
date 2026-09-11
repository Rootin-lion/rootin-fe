import { InterviewModeType } from "@/types/interviews/interview";
import InterviewOptionButton from "./InterviewOptionButton";

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
        <InterviewOptionButton
          isActive={interviewMode === "TEXT"}
          onClick={() => onChange("TEXT")}
        >
          텍스트
        </InterviewOptionButton>
        <InterviewOptionButton
          isActive={interviewMode === "VOICE"}
          onClick={() => onChange("VOICE")}
        >
          음성
        </InterviewOptionButton>
      </div>
    </div>
  );
}
