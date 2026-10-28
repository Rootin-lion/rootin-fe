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
import ErrorModal from "@/components/shared/ErrorModal";
import {
  EMPTY_INTERVIEW_SESSION,
  useInterviewSessionStore,
} from "@/stores/useInterviewSessionStore";
import SessionChat from "./SessionChat";
import SessionForm from "./SessionForm";
import SessionVideo from "./SessionVideo";
import useInterviewAnswer from "./useInterviewAnswer";

const subscribeToHydration = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function InterviewSessionContent({
  interviewId,
  profileImageUrl,
  category,
  questionCount,
}: {
  interviewId: number;
  profileImageUrl: string | null;
  category: string | null;
  questionCount: number | null;
}) {
  const router = useRouter();
  const { stopCamera } = useInterviewMedia();
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
    pendingAnswer,
    isTyping,
    isPresentingFeedback,
    handleAnswerChange,
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
  const displayedMessages = pendingAnswer
    ? [...messages, pendingAnswer]
    : messages;

  useEffect(() => {
    if (!sessionReady) return;
    ensureIntro(interviewId, category, questionCount);
    if (resumedIntro && !isIntroComplete) completeIntro(interviewId);
  }, [
    category,
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
    <div className="bg-bg-green-50 flex w-full flex-1 flex-col justify-between gap-19">
      {isModalOpen && (
        <ErrorModal
          code={error.code}
          message={error.message}
          onClose={closeModal}
        />
      )}

      <div className="mx-auto flex max-h-126 w-full max-w-5xl flex-row gap-10 pt-6">
        {sessionReady && (
          <SessionChat
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
        <SessionVideo interviewId={interviewId} />
      </div>
      <SessionForm
        answer={answer}
        onChange={handleAnswerChange}
        onSubmit={handleSubmitClick}
        disabled={
          !sessionReady ||
          !isIntroComplete ||
          interviewCompleted ||
          isTyping ||
          isPresentingFeedback
        }
      />
    </div>
  );
}
