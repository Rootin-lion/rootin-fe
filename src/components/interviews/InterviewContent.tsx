"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import type {
  InterviewConfig,
  InterviewCategoryType,
  InterviewModeType,
} from "@/types/interviews/interview";
import { createInterviewAction } from "@/app/(service)/interviews/action";
import Button from "@/components/shared/Button";
import ErrorModal from "@/components/shared/ErrorModal";
import ModalWrapper from "@/components/shared/ModalWrapper";
import useErrorModal from "@/hooks/useErrorModal";
import useModal from "@/hooks/useModal";
import {
  getInterviewCameraKey,
  MOBILE_INTERVIEW_QUERY,
} from "@/lib/interviews/cameraPolicy";
import InterviewPreview from "./InterviewPreview";
import InterviewSetup from "./InterviewSetup";
import { useInterviewMedia } from "./InterviewMediaProvider";

const subscribeToViewport = (callback: () => void) => {
  const query = window.matchMedia(MOBILE_INTERVIEW_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
};
const getMobileSnapshot = () =>
  window.matchMedia(MOBILE_INTERVIEW_QUERY).matches;
const getServerSnapshot = () => true;

export default function InterviewContent() {
  const router = useRouter();
  const isMobile = useSyncExternalStore(
    subscribeToViewport,
    getMobileSnapshot,
    getServerSnapshot,
  );
  const { startCamera, stopCamera } = useInterviewMedia();
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const cameraEnabledForStartRef = useRef(false);

  useEffect(() => {
    const query = window.matchMedia(MOBILE_INTERVIEW_QUERY);
    const handleViewportChange = (event: MediaQueryListEvent) => {
      if (event.matches) cameraEnabledForStartRef.current = false;
    };
    query.addEventListener("change", handleViewportChange);
    return () => query.removeEventListener("change", handleViewportChange);
  }, []);
  const {
    error,
    setErrorContext,
    isModalOpen: isErrorModalOpen,
    openModal: openErrorModal,
    closeModal: closeErrorModal,
  } = useErrorModal();
  const { isModalOpen, openModal, closeModal } = useModal();
  const [config, setConfig] = useState<InterviewConfig>({
    category: "OPERATING_SYSTEM",
    questionCount: 1,
    interviewMode: "TEXT",
  });

  const handleCategoryChange = (category: InterviewCategoryType) => {
    setConfig((prev) => ({ ...prev, category }));
  };

  const handleQuestionCountChange = (questionCount: null | number) => {
    setConfig((prev) => ({ ...prev, questionCount }));
  };

  const handleInterviewModeChange = (interviewMode: InterviewModeType) => {
    setConfig((prev) => ({ ...prev, interviewMode }));
  };

  const createInterview = async (questionCount: number) => {
    try {
      const res = await createInterviewAction({ ...config, questionCount });

      if (!res.ok) {
        setErrorContext(res.error);
        stopCamera();
        setCameraError(null);
        setIsStarting(false);
        closeModal();
        openErrorModal();

        return;
      }
      const interviewId = res.data.interviewId;
      window.sessionStorage.setItem(
        getInterviewCameraKey(interviewId),
        cameraEnabledForStartRef.current &&
          !window.matchMedia(MOBILE_INTERVIEW_QUERY).matches
          ? "enabled"
          : "disabled",
      );

      const query = new URLSearchParams({
        category: config.category,
        questionCount: String(questionCount),
      });

      router.push(`/interviews/${interviewId}?${query.toString()}`);
    } catch {
      setErrorContext({
        code: "UNKNOWN_ERROR",
        message: "면접 생성에 실패했습니다.",
      });
      stopCamera();
      setCameraError(null);
      setIsStarting(false);
      closeModal();
      openErrorModal();
    }
  };

  const handleStart = async () => {
    if (isStarting) return;

    const questionCount = config.questionCount;
    if (
      questionCount === null ||
      !Number.isInteger(questionCount) ||
      questionCount < 1 ||
      questionCount > 5
    ) {
      return;
    }

    setCameraError(null);
    setIsStarting(true);
    cameraEnabledForStartRef.current = !window.matchMedia(
      MOBILE_INTERVIEW_QUERY,
    ).matches;

    try {
      if (cameraEnabledForStartRef.current) await startCamera();
      await createInterview(questionCount);
    } catch {
      setCameraError("카메라 권한과 연결된 장치를 확인해주세요.");
      setIsStarting(false);
    }
  };

  return (
    <div className="bg-bg-ivory border-bg-green-200 mx-auto mt-6 flex w-full max-w-218 flex-col gap-6 rounded-[14px] border p-4 md:mt-11 md:flex-row md:gap-5 md:px-6 md:py-9">
      {isErrorModalOpen && (
        <ErrorModal
          code={error.code}
          message={error.message}
          onClose={closeErrorModal}
        />
      )}

      {isModalOpen && (
        <ModalWrapper
          onClose={() => {
            if (!isStarting) closeModal();
          }}
        >
          <ModalWrapper.Box>
            <ModalWrapper.Title>면접을 시작하시겠습니까?</ModalWrapper.Title>
          </ModalWrapper.Box>
          <ModalWrapper.Notice>
            <div className="text-text text-[15px] font-semibold">
              면접 주의사항
            </div>
            <ul className="text-disabled-text mt-3 list-outside list-disc pl-5 text-[12px] leading-5 font-medium">
              <li>
                {isMobile
                  ? "모바일에서는 카메라 없이 면접을 진행합니다."
                  : "면접 시작 전 마이크 및 카메라 권한을 확인해주세요."}
              </li>
              <li>제한 시간 초과 시 빈 문자열이 자동 제출됩니다.</li>
              <li>
                음성 면접 시 말을 끝내고 전송을 눌러야 최종 텍스트가 전송됩니다.
              </li>
              <li>진행 중 페이지를 벗어나면 면접이 초기화됩니다.</li>
            </ul>
          </ModalWrapper.Notice>
          <ModalWrapper.Box>
            <div className="flex flex-row gap-3 md:gap-6">
              <Button onClick={closeModal} disabled={isStarting}>
                취소
              </Button>
              <Button
                isActive={true}
                onClick={handleStart}
                disabled={isStarting}
              >
                <span className="flex items-center justify-center">
                  {isStarting ? (
                    <>
                      <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      <span className="sr-only">면접 시작 중</span>
                    </>
                  ) : (
                    "시작하기"
                  )}
                </span>
              </Button>
            </div>
          </ModalWrapper.Box>
          {cameraError && (
            <p role="alert" className="text-sub-text text-body-3">
              {cameraError}
            </p>
          )}
        </ModalWrapper>
      )}

      <InterviewSetup
        config={config}
        onCategoryChange={handleCategoryChange}
        onQuestionCountChange={handleQuestionCountChange}
        onInterviewModeChange={handleInterviewModeChange}
        onStart={openModal}
      />
      <InterviewPreview category={config.category} />
    </div>
  );
}
