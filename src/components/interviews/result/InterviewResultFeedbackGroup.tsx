type FeedbackType = "strength" | "improvement";

const TYPE_DATA = {
  strength: {
    text: "잘하고 있어요.",
    titleColor: "text-[#2E7D32]",
    textColor: "text-[#2D6A0E]",
    symbol: "✓",
  },
  improvement: {
    text: "보완이 필요해요.",
    titleColor: "text-error ",
    textColor: "text-error",
    symbol: "△",
  },
};

const InterviewResultFeedbackItem = ({ type }: { type: FeedbackType }) => {
  return (
    <div className="flex flex-col gap-1 rounded-lg bg-white p-3">
      <p className={`text-[13px] font-semibold ${TYPE_DATA[type].textColor}`}>
        {TYPE_DATA[type].symbol} 데이터베이스 인덱스
      </p>
      <p className="pl-4 text-[12px] font-normal text-[#4A5568]">
        B+트리 구조와 쿼리 최적화에 대한 깊은 이해를 보여주었습니다.
      </p>
    </div>
  );
};

export default function InterviewResultFeedbackGroup({
  type,
}: {
  type: FeedbackType;
}) {
  return (
    <div className="bg-primary-50 flex-1 rounded-[14px] px-5 pt-5 pb-7">
      <h3 className={`${TYPE_DATA[type].titleColor} text-[16px] font-semibold`}>
        {TYPE_DATA[type].text}
      </h3>
      <div className="mt-3 flex h-56.5 flex-col gap-3">
        <InterviewResultFeedbackItem type={type} />
        <InterviewResultFeedbackItem type={type} />
        <InterviewResultFeedbackItem type={type} />
      </div>
    </div>
  );
}
