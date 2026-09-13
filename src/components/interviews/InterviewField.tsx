import InterviewOptionButton from "./InterviewOptionButton";
import { InterviewFieldType } from "../../types/interviews/interview";
import { TOPIC_LIST } from "@/constants/interviews/interview";

export default function InterviewTopic({
  field,
  onChange,
}: {
  field: InterviewFieldType;
  onChange: (field: InterviewFieldType) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-body-3 text-text">면접 분야</div>
      <div className="grid grid-cols-3 gap-4">
        {TOPIC_LIST.map((item) => (
          <InterviewOptionButton
            key={item.id}
            isActive={item.label === field}
            onClick={() => onChange(item.label)}
          >
            {item.title}
          </InterviewOptionButton>
        ))}
      </div>
    </div>
  );
}
