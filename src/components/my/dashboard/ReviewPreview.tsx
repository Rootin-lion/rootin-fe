import ReviewIcon from "@/assets/review.svg";
import PreviewItem from "./PreviewItem";
import { WrongAnswersState } from "@/types/my/dashboard";

export default function ReviewPreview({
  reviews,
}: {
  reviews: WrongAnswersState[];
}) {
  return (
    <div className="bg-bg-green-50 w-full max-w-98.75 rounded-lg p-2.5">
      <div className="flex flex-row items-center justify-between">
        <div className="text-error flex flex-row gap-2">
          <ReviewIcon className="h-6 w-6 shrink-0" />
          <p className="text-[14px] font-semibold">오답노트</p>
        </div>
        <p className="text-sub-text cursor-pointer text-[10px] font-medium">
          더보기
        </p>
      </div>
      <div className="mt-3 flex flex-col gap-3">
        {reviews.length > 0
          ? reviews.map((review) => (
              <PreviewItem
                key={review.competitionProblemId}
                type="review"
                item={review}
              />
            ))
          : "오답 노트가 없습니다."}
      </div>
    </div>
  );
}
