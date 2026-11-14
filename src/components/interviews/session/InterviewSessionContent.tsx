"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useRouter } from "next/navigation";
import { useInterviewMedia } from "@/components/interviews/InterviewMediaProvider";
import {
  canUseInterviewCamera,
  getInterviewCameraKey,
  MOBILE_INTERVIEW_QUERY,
} from "@/lib/interviews/cameraPolicy";
import ErrorModal from "@/components/shared/ErrorModal";
import {
  EMPTY_INTERVIEW_SESSION,
  useInterviewSessionStore,
} from "@/stores/useInterviewSessionStore";
import SessionChat from "./SessionChat";
import SessionForm from "./SessionForm";
import SessionVideo from "./SessionVideo";
import SessionTimer from "./SessionTimer";
import useInterviewAnswer from "./useInterviewAnswer";
import useSpeechInput from "@/hooks/useSpeechInput";
import type { InterviewModeType } from "@/types/interviews/interview";

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

export default function InterviewSessionContent({
  interviewId,
  profileImageUrl,
  category,
  questionCount,
  interviewMode = "TEXT",
}: {
  interviewId: number;
  profileImageUrl: string | null;
  category: string | null;
  questionCount: number | null;
  interviewMode?: InterviewModeType;
}) {
  const router = useRouter();
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
  const messages = session.messages;
  const isIntroComplete = session.introComplete;
  const interviewCompleted = session.interviewCompleted;
  const [restoredMessageIds] = useState(
    () =>
      new Set(
        useInterviewSessionStore
          .getState()
          .sessions[interviewId]?.messages.map((message) => message.id) ?? [],
      ),
  );
  const [completionPresented, setCompletionPresented] = useState(() =>
    Boolean(
      useInterviewSessionStore
        .getState()
        .sessions[
          interviewId
        ]?.messages.some((message) => message.kind === "COMPLETION"),
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
  const navigationPendingRef = useRef(false);
  const {
    answer,
    updateAnswer,
    canAcceptAnswer,
    pendingAnswer,
    isTyping,
    isPresentingFeedback,
    handleSubmitClick,
    handleFeedbackComplete,
    error,
    isModalOpen,
    closeModal,
  } = useInterviewAnswer({
    interviewId,
    sessionReady,
    isIntroComplete,
    interviewCompleted,
    messages,
  });
  const inputDisabled =
    !sessionReady ||
    !isIntroComplete ||
    interviewCompleted ||
    isTyping ||
    isPresentingFeedback ||
    isModalOpen;
  const currentQuestionId =
    messages.findLast((message) => message.kind === "QUESTION")?.question
      .questionId ?? "intro";
  const audioTrack = stream
    ?.getAudioTracks()
    .find((track) => track.readyState === "live");
  const speech = useSpeechInput({
    value: answer,
    onValueChange: updateAnswer,
    disabled: inputDisabled,
    available: interviewMode === "VOICE" && !interviewCompleted,
    draftKey: currentQuestionId,
    canAcceptTranscript: canAcceptAnswer,
    autoStart: interviewMode === "VOICE" && Boolean(audioTrack),
    audioTrack,
  });
  const submitAnswer = () =>
    handleSubmitClick(speech.snapshot(), () => speech.resetDraft(""));
  const displayedMessages = pendingAnswer
    ? [...messages, pendingAnswer]
    : messages;

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

  return (
    <div className="bg-bg-green-50 flex h-[calc(100dvh-56px)] min-h-80 w-full flex-none flex-col justify-between gap-3 md:min-h-0 md:gap-4 lg:h-auto lg:flex-1 lg:gap-19">
      {isModalOpen && (
        <ErrorModal
          code={error.code}
          message={error.message}
          onClose={closeModal}
        />
      )}

      <div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col gap-3 px-4 pt-4 md:flex-row md:gap-6 md:px-6 md:pt-6 lg:max-h-126 lg:gap-10 xl:px-0">
        {sessionReady && (
          <SessionChat
            cameraEnabled={cameraEnabled}
            category={category}
            questionCount={questionCount}
            messages={displayedMessages}
            profileImageUrl={profileImageUrl}
            isTyping={isTyping}
            isPresentingFeedback={isPresentingFeedback}
            introComplete={isIntroComplete}
            restoredMessageIds={restoredMessageIds}
            onIntroComplete={handleIntroComplete}
            onFeedbackComplete={handleFeedbackComplete}
            onCompletionComplete={handleCompletionComplete}
          />
        )}
        <div className="order-first flex shrink-0 flex-col gap-4 md:order-last md:min-h-0 md:w-56 lg:w-70.5">
          <SessionTimer interviewId={interviewId} />
          {sessionReady && !isMobile && (
            <SessionVideo
              cameraEnabled={cameraEnabled && !isMobile}
              withMicrophone={interviewMode === "VOICE"}
            />
          )}
        </div>
      </div>
      <SessionForm
        answer={answer}
        onChange={(event) => speech.changeValue(event.target.value)}
        onSubmit={submitAnswer}
        onCompositionStart={speech.onCompositionStart}
        onCompositionEnd={speech.onCompositionEnd}
        disabled={inputDisabled}
      />
    </div>
  );
}
