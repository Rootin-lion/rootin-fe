import { InterviewReportFeedbackItem } from "@/types/interviews/interview";

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

const InterviewResultFeedbackItem = ({
  type,
  item,
}: {
  type: FeedbackType;
  item: InterviewReportFeedbackItem;
}) => {
  return (
    <div className="flex flex-col gap-1 rounded-lg bg-white p-3">
      <p className={`text-[13px] font-semibold ${TYPE_DATA[type].textColor}`}>
        {TYPE_DATA[type].symbol} {item.title}
      </p>
      <p className="pl-4 text-[12px] font-normal text-[#4A5568]">
        {item.content}
      </p>
    </div>
  );
};

export default function InterviewResultFeedbackGroup({
  type,
  items,
}: {
  type: FeedbackType;
  items: InterviewReportFeedbackItem[];
}) {
  return (
    <div className="bg-primary-50 flex-1 rounded-[14px] px-5 pt-5 pb-7">
      <h3 className={`${TYPE_DATA[type].titleColor} text-[16px] font-semibold`}>
        {TYPE_DATA[type].text}
      </h3>
      {items && (
        <div className="mt-3 flex flex-col gap-3">
          {items.map((item, index) => (
            <InterviewResultFeedbackItem type={type} key={index} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
