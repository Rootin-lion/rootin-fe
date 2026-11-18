"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useInterviewMedia } from "@/components/interviews/InterviewMediaProvider";
import { useInterviewSessionStore } from "@/stores/useInterviewSessionStore";

export default function useInterviewCompletion({
  interviewId,
  sessionReady,
  interviewCompleted,
  isPresentingFeedback,
}: {
  interviewId: number;
  sessionReady: boolean;
  interviewCompleted: boolean;
  isPresentingFeedback: boolean;
}) {
  const router = useRouter();
  const { stopCamera } = useInterviewMedia();
  const navigationPendingRef = useRef(false);
  const [completionPresented, setCompletionPresented] = useState(() =>
    Boolean(
      useInterviewSessionStore
        .getState()
        .sessions[
          interviewId
        ]?.messages.some((message) => message.kind === "COMPLETION"),
    ),
  );

  const handleCompletionComplete = useCallback(() => {
    setCompletionPresented(true);
  }, []);

  useEffect(() => {
    if (
      !sessionReady ||
      !interviewCompleted ||
      !completionPresented ||
      isPresentingFeedback ||
      navigationPendingRef.current
    )
      return;

    navigationPendingRef.current = true;
    stopCamera();
    const query = new URLSearchParams({
      flow: "interview-report",
      interviewId: String(interviewId),
    });
    router.replace(`/transition?${query.toString()}`);
  }, [
    completionPresented,
    interviewCompleted,
    interviewId,
    isPresentingFeedback,
    router,
    sessionReady,
    stopCamera,
  ]);

  return { handleCompletionComplete };
}
