"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useRouter } from "next/navigation";
import type { SessionChatMessage } from "@/types/interviews/interview";
import {
  getInterviewQuestionAction,
  submitInterviewAnswerAction,
} from "@/app/(service)/interviews/action";
import { useInterviewMedia } from "@/components/interviews/InterviewMediaProvider";
import ErrorModal from "@/components/shared/ErrorModal";
import useErrorModal from "@/hooks/useErrorModal";
import {
  EMPTY_INTERVIEW_SESSION,
  useInterviewSessionStore,
} from "@/stores/useInterviewSessionStore";
import SessionChat from "./SessionChat";
import SessionwForm from "./SessionForm";
import SessionVideo from "./SessionVideo";

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
  const appendExchange = useInterviewSessionStore(
    (state) => state.appendExchange,
  );
  const appendAnswerResult = useInterviewSessionStore(
    (state) => state.appendAnswerResult,
  );
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
  const [answer, setAnswer] = useState<string>("");
  const [pendingAnswer, setPendingAnswer] = useState<SessionChatMessage | null>(
    null,
  );
  const [isTyping, setIsTyping] = useState(false);
  const [isPresentingFeedback, setIsPresentingFeedback] = useState(false);
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
  const displayedMessages = pendingAnswer
    ? [...messages, pendingAnswer]
    : messages;
  const requestPendingRef = useRef(false);
  const navigationPendingRef = useRef(false);
  const { error, setErrorContext, isModalOpen, openModal, closeModal } =
    useErrorModal();

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

  const handleFeedbackComplete = useCallback(() => {
    setIsPresentingFeedback(false);
  }, []);

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

  // 답변 체인지
  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value);
  };

  // 답변 제출
  const handleSubmitClick = async () => {
    const trimmedAnswer = answer.trim();
    if (
      !sessionReady ||
      !isIntroComplete ||
      interviewCompleted ||
      isPresentingFeedback ||
      requestPendingRef.current ||
      !trimmedAnswer
    )
      return;

    const currentQuestion = messages.findLast(
      (message) => message.kind === "QUESTION",
    );
    if (!currentQuestion && trimmedAnswer !== "네") return;

    const answerMessage: Extract<SessionChatMessage, { kind: "ANSWER" }> =
      currentQuestion
        ? {
            id: `answer-${currentQuestion.question.questionId}`,
            kind: "ANSWER",
            questionId: currentQuestion.question.questionId,
            text: trimmedAnswer,
          }
        : { id: "intro-answer", kind: "ANSWER", text: trimmedAnswer };

    requestPendingRef.current = true;
    setPendingAnswer(answerMessage);
    setAnswer("");
    setIsTyping(true);

    const restoreAnswer = () => {
      setPendingAnswer(null);
      setAnswer(trimmedAnswer);
    };

    try {
      if (currentQuestion) {
        const res = await submitInterviewAnswerAction(interviewId, {
          questionId: currentQuestion.question.questionId,
          answer: trimmedAnswer,
        });

        if (!res.ok) {
          restoreAnswer();
          setErrorContext(res.error);
          openModal();
          return;
        }

        setIsPresentingFeedback(Boolean(res.data.feedback.trim()));
        appendAnswerResult(interviewId, answerMessage, res.data);
      } else {
        const res = await getInterviewQuestionAction(interviewId);

        if (!res.ok) {
          restoreAnswer();
          setErrorContext(res.error);
          openModal();
          return;
        }

        appendExchange(interviewId, answerMessage, res.data);
      }

      setPendingAnswer(null);
    } catch {
      restoreAnswer();
      setErrorContext({
        code: "UNKNOWN_ERROR",
        message: currentQuestion
          ? "답변 제출에 실패했습니다."
          : "질문 조회에 실패했습니다.",
      });
      openModal();
    } finally {
      requestPendingRef.current = false;
      setIsTyping(false);
    }
  };

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
      <SessionwForm
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
