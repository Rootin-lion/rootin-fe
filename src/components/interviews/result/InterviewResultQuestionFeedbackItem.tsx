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
        className="bg-primary-200 flex w-full cursor-pointer flex-row items-center gap-4 rounded-lg p-4 text-left"
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <div className="bg-primary-800 flex h-6 w-6 shrink-0 items-center justify-center rounded-[50%] text-[14px] font-normal text-white">
          {question.questionOrder}
        </div>
        <p className="pr-2 text-[14px] font-normal text-black">
          {question.question}
        </p>
        <span className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center text-[#666666]">
          <ChevronIcon
            className={`h-6 w-3.5 transition-transform ${isExpanded ? "-rotate-90" : "rotate-90"}`}
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
