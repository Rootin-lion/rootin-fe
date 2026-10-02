"use client";

import { useState, useEffect } from "react";
import type { InterviewReportState } from "@/types/interviews/interview";
import { INTERVIEW_CATEGORY_LABEL } from "@/constants/interviews/category";
import { formatDottedDate } from "@/lib/shared/formatDottedDate";
import InterviewResultFeedback from "@/components/interviews/result/InterviewResultFeedback";
import InterviewResultOverall from "@/components/interviews/result/InterviewResultOverall";
import { getMyInterviewReportAction } from "@/app/(service)/interviews/action";
import useErrorModal from "@/hooks/useErrorModal";
import ErrorModal from "@/components/shared/ErrorModal";
// import InterviewResultProblem from "./InterviewResultProblem";

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
    <div className="mx-auto mt-10 flex w-full max-w-5xl flex-col gap-6 rounded-xl border border-[#F0F0F0] bg-white px-21 py-11">
      {isModalOpen && (
        <ErrorModal
          code={error.code}
          message={error.message}
          onClose={closeModal}
        />
      )}

      <div>
        <h1 className="text-gradient-primary w-fit text-[30px] font-semibold">
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
      {/* <InterviewResultProblem interviewReport={interviewReport} /> */}
    </div>
  );
}
