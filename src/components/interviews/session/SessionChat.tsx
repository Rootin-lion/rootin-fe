"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import SessionMessage from "./SessionMessage";
import { SessionChatMessage } from "@/types/interviews/interview";

type IntroStep = "FIRST" | "WAITING" | "SECOND" | "DONE";

export default function SessionChat({
  category,
  questionCount,
  messages,
  profileImageUrl,
  isTyping,
  onIntroComplete,
}: {
  category: string | null;
  questionCount: number | null;
  messages: SessionChatMessage[];
  profileImageUrl: string | null;
  isTyping: boolean;
  onIntroComplete: () => void;
}) {
  const [introStep, setIntroStep] = useState<IntroStep>("FIRST");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const finishFirstMessage = useCallback(() => {
    setIntroStep("WAITING");
  }, []);

  const finishSecondMessage = useCallback(() => {
    setIntroStep("DONE");
    onIntroComplete();
  }, [onIntroComplete]);

  useEffect(() => {
    if (introStep !== "WAITING") return;

    const timeoutId = window.setTimeout(() => {
      setIntroStep("SECOND");
    }, 2000);

    return () => window.clearTimeout(timeoutId);
  }, [introStep]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) container.scrollTop = container.scrollHeight;
  }, [introStep, messages.length, isTyping]);

  return (
    <div
      ref={scrollContainerRef}
      className="interview-scrollbar flex w-full max-w-167 flex-col gap-4 overflow-y-auto pr-10"
    >
      <SessionMessage
        type="QUESTION"
        text={`안녕하세요. 면접을 시작하기 전에 먼저 카메라를 켜고 본인의\n화면이 잘 나오는지 확인해주세요.`}
        onTextAnimationComplete={finishFirstMessage}
      />

      {(introStep === "SECOND" || introStep === "DONE") && (
        <SessionMessage
          type="QUESTION"
          text={`그럼 지금부터 ${category || "-"} 분야 면접을 시작하겠습니다.\n총 ${questionCount || 0}개의 질문이 진행되며, 답변에 따라 꼬리 질문이 추가될 수 있습니다.\n준비되셨다면 ‘네’라고 말씀해주세요.`}
          onTextAnimationComplete={finishSecondMessage}
        />
      )}

      {introStep === "DONE" &&
        messages.map((message) => (
          <SessionMessage
            key={message.id}
            type={message.kind}
            profileImageUrl={profileImageUrl}
            text={
              message.kind === "QUESTION"
                ? message.question.question
                : message.text
            }
          />
        ))}

      {introStep === "DONE" && isTyping && (
        <SessionMessage type="QUESTION" text="" isTyping />
      )}
    </div>
  );
}
