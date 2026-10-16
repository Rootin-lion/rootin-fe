"use client";

import { useState } from "react";
import ChevronIcon from "@/assets/icon/shared/chevron.svg";
import { InterviewReportQuestion } from "@/types/interviews/interview";
import InterviewResultProblemItemDetail from "./InterviewResultProblemItemDetail";

export default function InterviewResultProlemItem({
  question,
}: {
  question: InterviewReportQuestion;
}) {
  const [isShow, setIsShow] = useState<boolean>(false);

  return (
    <div className="border-primary-200 rounded-lg border">
      <div
        className="bg-primary-200 flex w-full cursor-pointer flex-row items-center gap-4 rounded-lg p-4"
        onClick={() => setIsShow((prev) => !prev)}
      >
        <div className="bg-primary-800 flex h-6 w-6 shrink-0 items-center justify-center rounded-[50%] text-[14px] font-normal text-white">
          {question.questionOrder}
        </div>
        <p className="pr-2 text-[14px] font-normal text-black">
          {question.question}
        </p>
        <span className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center text-[#666666]">
          <ChevronIcon
            className={`h-6 w-3.5 transition-transform ${isShow ? "-rotate-90" : "rotate-90"}`}
          />
        </span>
      </div>
      {isShow && <InterviewResultProblemItemDetail question={question} />}
    </div>
  );
}
