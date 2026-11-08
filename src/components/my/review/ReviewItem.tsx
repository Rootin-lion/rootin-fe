"use client";

import { useState } from "react";
import ChevronIcon from "@/assets/icon/shared/chevron.svg";
import { CATEGORY_LABEL } from "@/constants/shared/category";
import { formatDottedDate } from "@/lib/shared/formatDottedDate";
import type { MyReviewItem } from "@/types/my/review";
import ProblemCategory from "../shared/ProblemCategory";
import ProblemDate from "../shared/ProblemDate";
import ProblemText from "../shared/ProblemText";
import ReviewItemDetail from "./ReviewItemDetail";

export default function ReviewItem({ review }: { review: MyReviewItem }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const detailId = `review-detail-${review.competitionId}-${review.competitionProblemId}`;

  return (
    <div className="flex w-full min-w-0 flex-col gap-2 rounded-xl border border-[#E1E1E1] bg-white p-2.5 md:gap-3 md:px-4 md:py-5">
      <div className="relative grid min-h-11 grid-cols-[minmax(0,1fr)_auto] items-start gap-x-2 gap-y-1 md:flex md:min-h-0 md:justify-between md:gap-0">
        <button
          type="button"
          aria-label={`${review.title} 답변 ${isExpanded ? "접기" : "펼치기"}`}
          aria-expanded={isExpanded}
          aria-controls={detailId}
          className="focus-visible:outline-primary absolute inset-0 z-10 cursor-pointer rounded-lg focus-visible:outline-2"
          onClick={() => setIsExpanded((prev) => !prev)}
        />
        <div className="contents md:flex md:min-w-0 md:items-start md:gap-2">
          <ProblemCategory
            label={CATEGORY_LABEL[review.category] ?? review.category}
            className="bg-[#FEF3F2] max-md:col-start-1 max-md:row-start-1 max-md:justify-self-start max-md:text-[10px]"
          />
          <ProblemText
            title={review.title}
            description={review.problemContent}
            className="max-md:col-span-2 max-md:row-start-2 max-md:gap-1"
            titleClassName="[overflow-wrap:anywhere] max-md:text-[13px]"
            descriptionClassName="text-sub-text [overflow-wrap:anywhere] max-md:leading-relaxed"
          />
        </div>
        <div className="contents md:ml-4 md:flex md:shrink-0 md:flex-col md:items-center md:justify-between md:self-stretch">
          <div className="max-md:col-start-2 max-md:row-start-1 max-md:self-center max-md:[&>p]:text-[10px]">
            <ProblemDate date={formatDottedDate(review.participationDate)} />
          </div>
          <ChevronIcon
            strokeWidth={2}
            aria-hidden="true"
            className="h-3 w-1.5 rotate-90 text-[#999999] max-md:col-span-2 max-md:row-start-3 max-md:mt-1 max-md:justify-self-center md:h-4 md:w-2.5"
          />
        </div>
      </div>
      {isExpanded && (
        <div id={detailId}>
          <ReviewItemDetail review={review} />
        </div>
      )}
    </div>
  );
}
