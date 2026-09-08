import InterviewOptionButton from "./InterviewOptionButton";
import { InterviewFieldType } from "../../types/interviews/interview";

const TOPIC_LIST: {
  id: number;
  title: string;
  label: InterviewFieldType;
}[] = [
  { id: 1, title: "운영체제", label: "OPERATING_SYSTEM" },
  { id: 2, title: "네트워크", label: "NETWORK" },
  { id: 3, title: "데이터베이스", label: "DATABASE" },
  { id: 4, title: "인프라", label: "INFRA_CLOUD" },
  { id: 5, title: "자료구조/알고리즘", label: "DATA_STRUCTURE_ALGORITHM" },
  { id: 6, title: "자바/스프링", label: "JAVA_SPRING" },
];

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
