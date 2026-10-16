"use client";

import ChevronIcon from "@/assets/icon/shared/chevron.svg";
import ProblemCategory from "../shared/ProblemCategory";
import ProblemDate from "../shared/ProblemDate";
import ProblemText from "../shared/ProblemText";
import ReviewItemDetail from "./ReviewItemDetail";
import { useState } from "react";

export default function ReviewItem() {
  const [isShow, setIsShow] = useState<boolean>(false);

  return (
    <div className="flex w-full flex-col gap-3 rounded-xl border border-[#E1E1E1] bg-white px-4 py-5">
      <div
        className="flex cursor-pointer flex-row items-start justify-between"
        onClick={() => setIsShow((prev) => !prev)}
      >
        <div className="flex min-w-0 flex-row items-start gap-2">
          <ProblemCategory label="알고리즘" className="bg-[#FEF3F2]" />
          <ProblemText
            title="동적 프로그래밍 - 배낭 문제 풀이법"
            description="0/1 배낭 문제(Knapsack Problem)에서 DP 테이블을 구성하는 방법과 시간복잡도를 설명하세요."
            descriptionClassName="text-sub-text"
          />
        </div>
        <div className="ml-4 flex shrink-0 flex-col items-center justify-between self-stretch">
          <ProblemDate date="2026.04.14" />
          <ChevronIcon
            strokeWidth={2}
            className="h-4 w-2.5 rotate-90 text-[#999999]"
          />
        </div>
      </div>
      {isShow && <ReviewItemDetail />}
    </div>
  );
}
