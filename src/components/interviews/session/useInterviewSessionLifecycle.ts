"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { useInterviewMedia } from "@/components/interviews/InterviewMediaProvider";
import {
  canUseInterviewCamera,
  getInterviewCameraKey,
} from "@/lib/interviews/cameraPolicy";
import useMediaAvailability from "@/hooks/useMediaAvailability";
import {
  canRequestMedia,
  subscribeToMediaViewport,
} from "@/lib/shared/mediaPolicy";
import {
  EMPTY_INTERVIEW_SESSION,
  useInterviewSessionStore,
} from "@/stores/useInterviewSessionStore";

const subscribeToHydration = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function useInterviewSessionLifecycle({
  interviewId,
  category,
  questionCount,
}: {
  interviewId: number;
  category: string | null;
  questionCount: number | null;
}) {
  const { stream, stopCamera } = useInterviewMedia();
  const { canUseMedia } = useMediaAvailability();
  const isMobile = !canUseMedia;
  const [cameraEnabled, setCameraEnabled] = useState(() =>
    canUseInterviewCamera(interviewId),
  );

  useEffect(() => {
    const key = getInterviewCameraKey(interviewId);
    window.sessionStorage.setItem(key, cameraEnabled ? "enabled" : "disabled");
    return subscribeToMediaViewport(() => {
      if (canRequestMedia()) return;
      window.sessionStorage.setItem(key, "disabled");
      setCameraEnabled(false);
      stopCamera();
    });
  }, [cameraEnabled, interviewId, stopCamera]);

  const session = useInterviewSessionStore(
    (state) => state.sessions[interviewId] ?? EMPTY_INTERVIEW_SESSION,
  );
  const completeIntro = useInterviewSessionStore(
    (state) => state.completeIntro,
  );
  const ensureIntro = useInterviewSessionStore((state) => state.ensureIntro);
  const [restoredMessageIds] = useState(
    () =>
      new Set(
        useInterviewSessionStore
          .getState()
          .sessions[interviewId]?.messages.map((message) => message.id) ?? [],
      ),
  );
  const sessionReady = useSyncExternalStore(
    subscribeToHydration,
    getClientSnapshot,
    getServerSnapshot,
  );
  const resumedIntro =
    restoredMessageIds.has("intro-camera") &&
    restoredMessageIds.has("intro-start");
  const isIntroComplete = session.introComplete;

  useEffect(() => {
    if (!sessionReady) return;
    ensureIntro(interviewId, category, questionCount, cameraEnabled);
    if (resumedIntro && !isIntroComplete) completeIntro(interviewId);
  }, [
    category,
    cameraEnabled,
    completeIntro,
    ensureIntro,
    interviewId,
    isIntroComplete,
    questionCount,
    resumedIntro,
    sessionReady,
  ]);

  const handleIntroComplete = useCallback(() => {
    completeIntro(interviewId);
  }, [completeIntro, interviewId]);

  return {
    stream,
    isMobile,
    cameraEnabled,
    sessionReady,
    messages: session.messages,
    isIntroComplete,
    interviewCompleted: session.interviewCompleted,
    restoredMessageIds,
    handleIntroComplete,
  };
}
