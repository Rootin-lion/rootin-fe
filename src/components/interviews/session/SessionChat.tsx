"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { SessionChatMessage } from "@/types/interviews/interview";
import { createIntroMessages } from "@/stores/useInterviewSessionStore";
import SessionMessage from "./SessionMessage";

type IntroStep = "FIRST" | "WAITING" | "SECOND" | "DONE";

export default function SessionChat({
  category,
  questionCount,
  messages,
  profileImageUrl,
  isTyping,
  isPresentingFeedback,
  introComplete,
  restoredMessageIds,
  onIntroComplete,
  onFeedbackComplete,
  onCompletionComplete,
}: {
  category: string | null;
  questionCount: number | null;
  messages: SessionChatMessage[];
  profileImageUrl: string | null;
  isTyping: boolean;
  isPresentingFeedback: boolean;
  introComplete: boolean;
  restoredMessageIds: ReadonlySet<string>;
  onIntroComplete: () => void;
  onFeedbackComplete: () => void;
  onCompletionComplete: () => void;
}) {
  const [introStep, setIntroStep] = useState<IntroStep>(
    introComplete ||
      (restoredMessageIds.has("intro-camera") &&
        restoredMessageIds.has("intro-start"))
      ? "DONE"
      : "FIRST",
  );
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const followLatestRef = useRef(true);
  const defaultIntros = createIntroMessages(category, questionCount);
  const cameraIntro = messages.find((message) => message.id === "intro-camera");
  const startIntro = messages.find((message) => message.id === "intro-start");

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
    if (container) {
      container.scrollTop = container.scrollHeight;
      followLatestRef.current = true;
    }
  }, [introStep, messages.length, isTyping, isPresentingFeedback]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    const content = contentRef.current;
    if (!container || !content || !window.ResizeObserver) return;

    const observer = new ResizeObserver(() => {
      if (followLatestRef.current) {
        container.scrollTop = container.scrollHeight;
      }
    });
    observer.observe(content);

    return () => observer.disconnect();
  }, []);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    followLatestRef.current =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      48;
  };

  return (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="interview-scrollbar min-h-0 w-full max-w-167 overflow-y-auto pr-10"
    >
      <div ref={contentRef} className="flex flex-col gap-4">
        <SessionMessage
          type="QUESTION"
          text={
            cameraIntro?.kind === "INTRO"
              ? cameraIntro.text
              : defaultIntros[0].text
          }
          animate={introStep !== "DONE"}
          onTextAnimationComplete={finishFirstMessage}
        />

        {(introStep === "SECOND" || introStep === "DONE") && (
          <SessionMessage
            type="QUESTION"
            text={
              startIntro?.kind === "INTRO"
                ? startIntro.text
                : defaultIntros[1].text
            }
            animate={introStep !== "DONE"}
            onTextAnimationComplete={finishSecondMessage}
          />
        )}

        {introStep === "DONE" &&
          messages.map((message, index) => {
            if (message.kind === "INTRO") return null;
            if (
              isPresentingFeedback &&
              (message.kind === "QUESTION" || message.kind === "COMPLETION") &&
              messages[index - 1]?.kind === "FEEDBACK"
            ) {
              return null;
            }

            return (
              <SessionMessage
                key={message.id}
                type={message.kind === "ANSWER" ? "ANSWER" : "QUESTION"}
                animate={!restoredMessageIds.has(message.id)}
                profileImageUrl={profileImageUrl}
                text={
                  message.kind === "QUESTION"
                    ? message.question.question
                    : message.text
                }
                onTextAnimationComplete={
                  message.kind === "FEEDBACK"
                    ? onFeedbackComplete
                    : message.kind === "COMPLETION"
                      ? onCompletionComplete
                      : undefined
                }
              />
            );
          })}

        {introStep === "DONE" && isTyping && (
          <SessionMessage type="QUESTION" text="" isTyping />
        )}
      </div>
    </div>
  );
}
