"use client";

import ErrorModal from "@/components/shared/ErrorModal";
import SessionChat from "./SessionChat";
import SessionForm from "./SessionForm";
import SessionVideo from "./SessionVideo";
import SessionTimer from "./SessionTimer";
import useInterviewAnswer from "./useInterviewAnswer";
import useInterviewSessionLifecycle from "./useInterviewSessionLifecycle";
import useInterviewCompletion from "./useInterviewCompletion";
import useSpeechInput from "@/hooks/useSpeechInput";
import type { InterviewModeType } from "@/types/interviews/interview";

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
  const {
    stream,
    isMobile,
    cameraEnabled,
    sessionReady,
    messages,
    isIntroComplete,
    interviewCompleted,
    restoredMessageIds,
    handleIntroComplete,
  } = useInterviewSessionLifecycle({ interviewId, category, questionCount });
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

  const { handleCompletionComplete } = useInterviewCompletion({
    interviewId,
    sessionReady,
    interviewCompleted,
    isPresentingFeedback,
  });

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
