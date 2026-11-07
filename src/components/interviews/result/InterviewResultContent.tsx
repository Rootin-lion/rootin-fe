"use client";

import { useState, useEffect } from "react";
import type { InterviewReportState } from "@/types/interviews/interview";
import { INTERVIEW_CATEGORY_LABEL } from "@/constants/interviews/category";
import { getMyInterviewReportAction } from "@/app/(service)/interviews/action";
import ErrorModal from "@/components/shared/ErrorModal";
import useErrorModal from "@/hooks/useErrorModal";
import { formatDottedDate } from "@/lib/shared/formatDottedDate";
import InterviewResultFeedback from "./InterviewResultFeedback";
import InterviewResultOverall from "./InterviewResultOverall";
import InterviewResultQuestionFeedback from "./InterviewResultQuestionFeedback";

export default function InterviewResultContent({
  interviewId,
}: {
  interviewId: number;
}) {
  const [interviewReport, setInterviewReport] = useState<InterviewReportState>({
    interviewId: 5,
    category: "OPERATING_SYSTEM",
    questionCount: 0,
    completedAt: "",
    status: "",
    averageAccuracy: 0,
    overallFeedback: "",
    strengths: [],
    weaknesses: [],
    questions: [],
  });
  const { error, setErrorContext, isModalOpen, openModal, closeModal } =
    useErrorModal();

  // 면접 결과 조회
  useEffect(() => {
    const getReport = async () => {
      try {
        const res = await getMyInterviewReportAction(interviewId);

        if (!res.ok) {
          setErrorContext(res.error);
          openModal();

          return;
        }

        setInterviewReport(res.data);
      } catch {
        setErrorContext({
          code: "INTERVIEW_FAILED",
          message: "면접 결과 조회에 실패했습니다.",
        });
        openModal();
      }
    };

    void getReport();
  }, [interviewId, setErrorContext, openModal]);

  return (
    <div className="px-4 pb-12 md:px-6 md:pb-20">
      <div className="mx-auto mt-6 flex w-full max-w-5xl flex-col gap-5 rounded-xl border border-[#F0F0F0] bg-white p-4 md:mt-10 md:gap-6 md:px-8 md:py-11 lg:px-21">
        {isModalOpen && (
          <ErrorModal
            code={error.code}
            message={error.message}
            onClose={closeModal}
          />
        )}

        <div>
          <h1 className="text-gradient-primary w-fit text-[24px] font-semibold md:text-[30px]">
            AI 면접 결과
          </h1>
          <p className="text-body-3 text-text mt-3">
            {interviewReport
              ? INTERVIEW_CATEGORY_LABEL[interviewReport.category]
              : "-"}{" "}
            | {interviewReport?.questionCount || 0}문항 |{" "}
            {interviewReport?.completedAt
              ? formatDottedDate(interviewReport.completedAt)
              : "0000.00.00"}
          </p>
        </div>

        <InterviewResultOverall interviewReport={interviewReport} />
        <InterviewResultFeedback interviewReport={interviewReport} />
        <InterviewResultQuestionFeedback
          questions={interviewReport.questions}
        />
      </div>
    </div>
  );
}
