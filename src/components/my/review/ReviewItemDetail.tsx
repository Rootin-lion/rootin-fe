import type { MyReviewItem } from "@/types/my/review";

export default function ReviewItemDetail({ review }: { review: MyReviewItem }) {
  return (
    <div className="flex min-w-0 flex-col gap-3 md:gap-4">
      <div className="border-primary-200 bg-bg-green-50 flex min-w-0 flex-col gap-2 rounded-xl border p-2.5 md:gap-3 md:p-4">
        <p className="text-text text-[12px] font-semibold md:text-[14px]">
          내 답변 비교
        </p>
        <div className="flex min-w-0 flex-col items-start gap-1 rounded-lg border border-[#F5D6D2] bg-[#FFF7F6] px-2.5 py-2 md:flex-row md:gap-3 md:px-4 md:py-3">
          <p className="shrink-0 text-[11px] font-semibold text-[#DC2626] md:text-[12px]">
            내 답변
          </p>
          <p className="text-text text-body-3 min-w-0 leading-5 [overflow-wrap:anywhere]">
            {review.myAnswer}
          </p>
        </div>
        <div className="border-primary-200 bg-primary-50 flex min-w-0 flex-col items-start gap-1 rounded-lg border px-2.5 py-2 md:flex-row md:gap-3 md:px-4 md:py-3">
          <p className="text-primary-900 shrink-0 text-[11px] font-semibold md:text-[12px]">
            정답
          </p>
          <p className="text-text text-body-3 min-w-0 leading-5 [overflow-wrap:anywhere]">
            {review.correctAnswer}
          </p>
        </div>
      </div>
      <div className="flex min-w-0 flex-col gap-1 border-t border-[#E1E1E1] pt-3 md:gap-2 md:pt-4">
        <p className="text-text text-[12px] font-semibold md:text-[14px]">
          해설
        </p>
        <p className="text-body-3 text-sub-text leading-5 [overflow-wrap:anywhere] md:leading-6">
          {review.explanation}
        </p>
      </div>
    </div>
  );
}
