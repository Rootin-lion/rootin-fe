"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { useInterviewMedia } from "@/components/interviews/InterviewMediaProvider";
import {
  canUseInterviewCamera,
  getInterviewCameraKey,
  MOBILE_INTERVIEW_QUERY,
} from "@/lib/interviews/cameraPolicy";
import {
  EMPTY_INTERVIEW_SESSION,
  useInterviewSessionStore,
} from "@/stores/useInterviewSessionStore";

const subscribeToHydration = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;
const subscribeToViewport = (callback: () => void) => {
  const query = window.matchMedia(MOBILE_INTERVIEW_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
};
const getMobileSnapshot = () =>
  window.matchMedia(MOBILE_INTERVIEW_QUERY).matches;
const getServerMobileSnapshot = () => true;

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
  const isMobile = useSyncExternalStore(
    subscribeToViewport,
    getMobileSnapshot,
    getServerMobileSnapshot,
  );
  const [cameraEnabled, setCameraEnabled] = useState(() =>
    canUseInterviewCamera(interviewId),
  );

  useEffect(() => {
    const key = getInterviewCameraKey(interviewId);
    window.sessionStorage.setItem(key, cameraEnabled ? "enabled" : "disabled");
    const query = window.matchMedia(MOBILE_INTERVIEW_QUERY);
    const handleViewportChange = (event: MediaQueryListEvent) => {
      if (!event.matches) return;
      window.sessionStorage.setItem(key, "disabled");
      setCameraEnabled(false);
      stopCamera();
    };
    query.addEventListener("change", handleViewportChange);
    return () => query.removeEventListener("change", handleViewportChange);
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
