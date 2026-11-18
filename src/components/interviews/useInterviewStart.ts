"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createInterviewAction } from "@/app/(service)/interviews/action";
import useErrorModal from "@/hooks/useErrorModal";
import {
  getInterviewCameraKey,
  MOBILE_INTERVIEW_QUERY,
} from "@/lib/interviews/cameraPolicy";
import { canRequestMedia } from "@/lib/shared/mediaPolicy";
import type { ApiError } from "@/types/api/error";
import type { InterviewConfig } from "@/types/interviews/interview";
import { useInterviewMedia } from "./InterviewMediaProvider";

export default function useInterviewStart({
  config,
  speechSupported,
  closeStartModal,
}: {
  config: InterviewConfig;
  speechSupported: boolean;
  closeStartModal: () => void;
}) {
  const router = useRouter();
  const { startCamera, stopCamera } = useInterviewMedia();
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const cameraEnabledForStartRef = useRef(false);
  const {
    error,
    setErrorContext,
    isModalOpen: isErrorModalOpen,
    openModal: openErrorModal,
    closeModal: closeErrorModal,
  } = useErrorModal();

  useEffect(() => {
    const query = window.matchMedia(MOBILE_INTERVIEW_QUERY);
    const handleViewportChange = (event: MediaQueryListEvent) => {
      if (event.matches) cameraEnabledForStartRef.current = false;
    };
    query.addEventListener("change", handleViewportChange);
    return () => query.removeEventListener("change", handleViewportChange);
  }, []);

  const handleCreateError = (context: ApiError) => {
    setErrorContext(context);
    stopCamera();
    setCameraError(null);
    setIsStarting(false);
    closeStartModal();
    openErrorModal();
  };

  const createInterview = async (questionCount: number) => {
    try {
      const interviewMode =
        canRequestMedia() && speechSupported ? config.interviewMode : "TEXT";
      const res = await createInterviewAction({
        ...config,
        questionCount,
        interviewMode,
      });

      if (!res.ok) {
        handleCreateError(res.error);
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
        interviewMode,
      });
      router.push(`/interviews/${interviewId}?${query.toString()}`);
    } catch {
      handleCreateError({
        code: "UNKNOWN_ERROR",
        message: "면접 생성에 실패했습니다.",
      });
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
      if (cameraEnabledForStartRef.current)
        await startCamera(config.interviewMode === "VOICE" && speechSupported);
      await createInterview(questionCount);
    } catch {
      setCameraError("카메라·마이크 권한과 연결된 장치를 확인해주세요.");
      setIsStarting(false);
    }
  };

  return {
    handleStart,
    isStarting,
    cameraError,
    error,
    isErrorModalOpen,
    closeErrorModal,
  };
}
