import type { InterviewCategoryType } from "@/types/interviews/interview";
import { Field_LIST } from "@/constants/interviews/interview";
import OptionButton from "@/components/shared/OptionButton";

export default function InterviewTopic({
  category,
  onChange,
}: {
  category: InterviewCategoryType;
  onChange: (category: InterviewCategoryType) => void;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="text-body-3 text-text mb-2">면접 분야</legend>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:gap-4">
        {Field_LIST.map((item) => (
          <OptionButton
            variant="filled"
            key={item.id}
            selected={item.label === category}
            onClick={() => onChange(item.label)}
          >
            {item.title}
          </OptionButton>
        ))}
      </div>
    </fieldset>
  );
}
