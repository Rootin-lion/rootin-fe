import QuestionButtonBox from "./QuestionButtonBox";
import QuestionCard from "./QuestionCard";
import QuestionSurface from "./QuestionSurface";

const NumberLabel = () => {
  return (
    <div className="text-primary-900 bg-primary-100 flex h-6 w-12.5 items-center justify-center rounded-xl text-[10px] font-medium">
      1번 문제
    </div>
  );
};

export default function QuestionPanel() {
  return (
    <QuestionSurface>
      <div className="flex h-full flex-col justify-between">
        <div className="flex flex-col gap-7">
          <NumberLabel />
          <QuestionCard />
        </div>
        <QuestionButtonBox status="isLast" />
      </div>
    </QuestionSurface>
  );
}
