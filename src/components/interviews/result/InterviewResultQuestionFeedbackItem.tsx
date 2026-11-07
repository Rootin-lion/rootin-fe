"use client";

import { useState } from "react";
import ChevronIcon from "@/assets/icon/shared/chevron.svg";
import type { InterviewReportQuestion } from "@/types/interviews/interview";
import InterviewResultQuestionFeedbackDetail from "./InterviewResultQuestionFeedbackDetail";

export default function InterviewResultQuestionFeedbackItem({
  question,
  followUpQuestions,
}: {
  question: InterviewReportQuestion;
  followUpQuestions: InterviewReportQuestion[];
}) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <div className="border-primary-200 rounded-lg border">
      <button
        type="button"
        aria-expanded={isExpanded}
        className="bg-primary-200 flex min-h-11 w-full cursor-pointer flex-row items-center gap-2 rounded-lg px-3 py-2.5 text-left md:gap-4 md:p-4"
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <div className="bg-primary-800 flex h-5 w-5 shrink-0 items-center justify-center rounded-[50%] text-[11px] font-medium text-white md:h-6 md:w-6 md:text-[14px] md:font-normal">
          {question.questionOrder}
        </div>
        <p className="min-w-0 text-xs font-normal wrap-anywhere text-black max-md:leading-relaxed md:pr-2 md:text-[14px]">
          {question.question}
        </p>
        <span className="ml-auto flex h-5 w-5 shrink-0 items-center justify-center text-[#666666] md:h-6 md:w-6">
          <ChevronIcon
            className={`h-4 w-2.5 transition-transform md:h-6 md:w-3.5 ${isExpanded ? "-rotate-90" : "rotate-90"}`}
          />
        </span>
      </button>
      {isExpanded && (
        <InterviewResultQuestionFeedbackDetail
          question={question}
          followUpQuestions={followUpQuestions}
        />
      )}
    </div>
  );
}
