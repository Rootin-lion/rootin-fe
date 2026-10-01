"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type {
  InterviewConfig,
  InterviewFieldType,
  InterviewModeType,
} from "@/types/interviews/interview";
import InterviewPreview from "@/components/interviews/InterviewPreview";
import InterviewSetup from "@/components/interviews/InterviewSetup";
import Button from "@/components/shared/Button";
import ModalWrapper from "@/components/shared/ModalWrapper";
import useModal from "@/hooks/useModal";
import { useInterviewMedia } from "./InterviewMediaProvider";
import { createInterviewAction } from "@/app/(service)/interviews/action";
import useErrorModal from "@/hooks/useErrorModal";
import ErrorModal from "../shared/ErrorModal";

export default function InterviewContent() {
  const router = useRouter();
  const { startCamera, stopCamera } = useInterviewMedia();
  const [cameraError, setCameraError] = useState<string | null>(null);
  const {
    error,
    setErrorContext,
    isModalOpen: isErrorModalOpen,
    openModal: openErrorModal,
    closeModal: closeErrorModal,
  } = useErrorModal();
  const { isModalOpen, openModal, closeModal } = useModal();
  const [config, setConfig] = useState<InterviewConfig>({
    field: "OPERATING_SYSTEM",
    questionCount: null,
    interviewMode: "TEXT",
  });

  const handleFieldChange = (field: InterviewFieldType) => {
    setConfig((prev) => ({ ...prev, field }));
  };

  const handleQuestionCountChange = (questionCount: null | number) => {
    if (questionCount === null) return;

    setConfig((prev) => ({ ...prev, questionCount }));
  };

  const handleInterviewModeChange = (interviewMode: InterviewModeType) => {
    setConfig((prev) => ({ ...prev, interviewMode }));
  };

  const createInterview = async () => {
    try {
      const res = await createInterviewAction(config);

      if (!res.ok) {
        setErrorContext(res.error);
        stopCamera();
        setCameraError(null);
        openErrorModal();

        return;
      }
      const interviewId = res.data.interviewId;
      router.push(`/interviews/${interviewId}`);
    } catch {
      setErrorContext({
        code: "UNKNOWN_ERROR",
        message: "면접 생성에 실패했습니다.",
      });
      stopCamera();
      setCameraError(null);
      openErrorModal();
    }
  };

  const handleStart = async () => {
    setCameraError(null);

    try {
      await startCamera();
      await createInterview();
    } catch {
      setCameraError("카메라 권한과 연결된 장치를 확인해주세요.");
    }
  };

  return (
    <div className="bg-bg-ivory border-bg-green-200 mx-auto mt-11 flex max-w-218 flex-row gap-5 rounded-[14px] border px-6 py-9">
      {isErrorModalOpen && (
        <ErrorModal
          code={error.code}
          message={error.message}
          onClose={closeErrorModal}
        />
      )}

      {isModalOpen && (
        <ModalWrapper onClose={closeModal}>
          <ModalWrapper.Box>
            <ModalWrapper.Title>면접을 시작하시겠습니까?</ModalWrapper.Title>
          </ModalWrapper.Box>
          <ModalWrapper.Notice>
            <div className="text-text text-[15px] font-semibold">
              면접 주의사항
            </div>
            <ul className="text-disabled-text mt-3 list-outside list-disc pl-5 text-[12px] leading-5 font-medium">
              <li>면접 시작 전 마이크 및 카메라 권한을 확인해주세요.</li>
              <li>제한 시간 초과 시 빈 문자열이 자동 제출됩니다.</li>
              <li>
                음성 면접 시 말을 끝내고 전송을 눌러야 최종 텍스트가 전송됩니다.
              </li>
              <li>진행 중 페이지를 벗어나면 면접이 초기화됩니다.</li>
            </ul>
          </ModalWrapper.Notice>
          <ModalWrapper.Box>
            <div className="flex flex-row gap-6">
              <Button onClick={closeModal}>취소</Button>
              <Button isActive={true} onClick={handleStart}>
                시작하기
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
        onFieldChange={handleFieldChange}
        onQuestionCountChange={handleQuestionCountChange}
        onInterviewModeChange={handleInterviewModeChange}
        onStart={openModal}
      />
      <InterviewPreview field={config.field} />
    </div>
  );
}
