"use client";

import InterviewPreview from "@/components/interviews/InterviewPreview";
import InterveiwSetup from "@/components/interviews/InterviewSetup";
import InterviewConfig, {
  InterviewFieldType,
  InterviewModeType,
} from "../../../types/interviews/interview";
import { useState } from "react";
// import ModalWrapper from "@/components/shared/ModalWrapper";
// import Button from "@/components/shared/Button";

export default function InterviewsPage() {
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

  return (
    <div className="bg-bg-ivory border-bg-green-200 mx-auto mt-11 flex max-w-218 flex-row gap-5 rounded-[14px] border px-6 py-9">
      {/* <ModalWrapper>
          <ModalWrapper.Box>
            <ModalWrapper.Title>면접을 시작하시겠습니까?</ModalWrapper.Title>
          </ModalWrapper.Box>
          <ModalWrapper.Notice>
            <div className="text-text text-[15px] font-semibold">
              면접 주의사항
            </div>
            <ul className="text-disabled-text mt-3 list-inside list-disc text-[13px] font-medium whitespace-pre-line">
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
              <Button>취소</Button>
              <Button isActive={true}>시작하기</Button>
            </div>
          </ModalWrapper.Box>
        </ModalWrapper> */}

      <InterveiwSetup
        config={config}
        onFieldChange={handleFieldChange}
        onQuestionCountChange={handleQuestionCountChange}
        onInterviewModeChange={handleInterviewModeChange}
      />
      <InterviewPreview field={config.field} />
    </div>
  );
}
