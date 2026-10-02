"use client";

import { useEffect, useState } from "react";
import type { MessageType } from "@/types/interviews/interview";

const MESSAGE_STYLES = {
  QUESTION: "rounded-tr-2xl rounded-b-2xl border-[#DDE8D0] bg-white ",
  ANSWER: "bg-primary-200 border-bg-green-50 rounded-tl-2xl rounded-b-2xl ",
};

function AnimatedAiText({
  text,
  onComplete,
}: {
  text: string;
  onComplete?: () => void;
}) {
  const [visibleCharacterCount, setVisibleCharacterCount] = useState(0);

  useEffect(() => {
    const characterCount = Array.from(text).length;
    let nextCharacterCount = 0;

    const intervalId = window.setInterval(() => {
      nextCharacterCount += 1;
      setVisibleCharacterCount(nextCharacterCount);

      if (nextCharacterCount >= characterCount) {
        window.clearInterval(intervalId);
        onComplete?.();
      }
    }, 80);

    return () => window.clearInterval(intervalId);
  }, [text, onComplete]);

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {Array.from(text).slice(0, visibleCharacterCount).join("")}
      </span>
    </>
  );
}

export default function MessageBubble({
  type = "QUESTION",
  text,
  loading = false,
  onTextAnimationComplete,
}: {
  type: MessageType;
  text: string;
  loading: boolean;
  onTextAnimationComplete?: () => void;
}) {
  return (
    <div
      className={`${MESSAGE_STYLES[type]} left-6 border px-4 py-3 text-[14px] font-normal whitespace-pre-wrap text-[#1A1A1A] ${loading ? "flex h-15 w-20 justify-center" : ""}`}
    >
      {loading ? (
        <span className="flex items-center gap-2" aria-hidden="true">
          {/* shadow-[0_3px_4px_rgba(81,160,92,0.35)] */}
          <span className="bg-primary animate-typing-bounce h-1.75 w-1.75 rounded-full [animation-delay:-300ms] motion-reduce:animate-none" />
          <span className="bg-primary animate-typing-bounce h-1.75 w-1.75 rounded-full [animation-delay:-150ms] motion-reduce:animate-none" />
          <span className="bg-primary animate-typing-bounce h-1.75 w-1.75 rounded-full motion-reduce:animate-none" />
        </span>
      ) : type === "QUESTION" ? (
        <AnimatedAiText
          key={text}
          text={text}
          onComplete={onTextAnimationComplete}
        />
      ) : (
        text
      )}
    </div>
  );
}
