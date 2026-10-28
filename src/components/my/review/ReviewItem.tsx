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
    <div className="flex w-full flex-col gap-3 rounded-xl border border-[#E1E1E1] bg-white px-4 py-5">
      <div className="relative flex flex-row items-start justify-between">
        <button
          type="button"
          aria-label={`${review.title} 답변 ${isExpanded ? "접기" : "펼치기"}`}
          aria-expanded={isExpanded}
          aria-controls={detailId}
          className="focus-visible:outline-primary absolute inset-0 z-10 cursor-pointer rounded-lg focus-visible:outline-2"
          onClick={() => setIsExpanded((prev) => !prev)}
        />
        <div className="flex min-w-0 flex-row items-start gap-2">
          <ProblemCategory
            label={CATEGORY_LABEL[review.category] ?? review.category}
            className="bg-[#FEF3F2]"
          />
          <ProblemText
            title={review.title}
            description={review.problemContent}
            descriptionClassName="text-sub-text"
          />
        </div>
        <div className="ml-4 flex shrink-0 flex-col items-center justify-between self-stretch">
          <ProblemDate date={formatDottedDate(review.participationDate)} />
          <ChevronIcon
            strokeWidth={2}
            className="h-4 w-2.5 rotate-90 text-[#999999]"
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
