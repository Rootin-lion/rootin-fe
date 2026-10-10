"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ApiError } from "@/types/api/error";
import { generateInterviewReportAction } from "@/app/(service)/interviews/action";
import useErrorModal from "@/hooks/useErrorModal";
import ErrorModal from "@/components/shared/ErrorModal";
import TransitionScreen from "@/components/shared/TransitionScreen";

const REPORT_POLL_INTERVAL_MS = 3000;

export default function InterviewReportLoading({
  interviewId,
}: {
  interviewId: number;
}) {
  const router = useRouter();
  const [failed, setFailed] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const { error, setErrorContext, isModalOpen, openModal, closeModal } =
    useErrorModal();

  useEffect(() => {
    let active = true;
    let timeoutId: number;

    const fail = (context: ApiError) => {
      setFailed(true);
      setErrorContext(context);
      openModal();
    };

    const checkReport = async () => {
      try {
        const result = await generateInterviewReportAction(interviewId);
        if (!active) return;

        if (!result.ok) {
          // 마지막 답변 분석이 진행 중이면 다음 주기에 다시 확인한다.
          if (result.error.code === "C409-6") {
            scheduleNextCheck();
            return;
          }
          fail(result.error);
          return;
        }

        if (result.data.status === "COMPLETED") {
          router.replace(`/interviews/${interviewId}/result`);
          return;
        }

        if (result.data.status === "FAILED") {
          fail({
            code: "INTERVIEW_REPORT_FAILED",
            message: "면접 리포트 생성에 실패했습니다. 다시 시도해주세요.",
          });
          return;
        }

        scheduleNextCheck();
      } catch {
        if (!active) return;
        fail({
          code: "UNKNOWN_ERROR",
          message: "면접 리포트 상태를 확인하지 못했습니다. 다시 시도해주세요.",
        });
      }
    };

    const scheduleNextCheck = () => {
      timeoutId = window.setTimeout(() => {
        void checkReport();
      }, REPORT_POLL_INTERVAL_MS);
    };

    timeoutId = window.setTimeout(() => {
      void checkReport();
    }, 0);

    return () => {
      active = false;
      window.clearTimeout(timeoutId);
    };
  }, [interviewId, openModal, retryCount, router, setErrorContext]);

  const retryReport = () => {
    closeModal();
    setFailed(false);
    setRetryCount((count) => count + 1);
  };

  return (
    <>
      {isModalOpen && (
        <ErrorModal
          code={error.code}
          message={error.message}
          onClose={closeModal}
        />
      )}
      <TransitionScreen
        title="수고하셨습니다."
        caption={
          failed
            ? "결과 생성에 실패했습니다. 다시 시도해주세요."
            : "결과를 생성 중이니 잠시만 기다려주세요."
        }
      >
        {failed && (
          <button
            type="button"
            onClick={retryReport}
            className="text-primary-900 font-semibold underline"
          >
            다시 시도
          </button>
        )}
      </TransitionScreen>
    </>
  );
}
