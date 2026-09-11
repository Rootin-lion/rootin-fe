const QuestionOption = () => {
  return (
    <div className="border-primary-200 flex h-15 w-170 items-center gap-5 rounded-lg border bg-white pl-5">
      <div className="border-primary-200 h-3.5 w-3.5 rounded-[50%] border" />
      <p className="text-[15px] font-medium text-black">
        프로세스는 스레드의 실행 단위이다.
      </p>
    </div>
  );
};

export default function QuestionCard() {
  return (
    <div>
      <h1 className="text-[18px] font-semibold text-black">
        1. 프로세스(Process)와 스레드(Thread)의 관계에 대한 설명으로 옳은 것은?
      </h1>
      <div className="mt-7.5 flex flex-col gap-4">
        <QuestionOption />
        <QuestionOption />
        <QuestionOption />
      </div>
    </div>
  );
}
